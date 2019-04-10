/*
    Creation Time: 2018 - Oct - 03
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2018
*/

import {C_MSG} from '../../const';
import {UpdateContainer, UpdateEnvelope} from '../../messages/chat.core.types_pb';
import {
    UpdateGroupPhoto,
    UpdateMessageEdited, UpdateMessageID, UpdateMessagesDeleted,
    UpdateNewMessage, UpdateNotifySettings,
    UpdateReadHistoryInbox,
    UpdateReadHistoryOutbox, UpdateReadMessagesContents, UpdateUsername, UpdateUserPhoto,
    UpdateUserTyping
} from '../../messages/chat.api.updates_pb';
import {throttle, findIndex} from 'lodash';
import {User} from '../../messages/chat.core.types_pb';
import {IMessage} from '../../../../repository/message/interface';
import MessageRepo from '../../../../repository/message';
import {base64ToU8a} from '../../fileManager/http/utils';

export interface INewMessageBulkUpdate {
    accessHashes: string[];
    messages: IMessage[];
    peerid: string;
    peertype?: number;
    senderIds: string[];
    senders: User.AsObject[];
}

export default class UpdateManager {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new UpdateManager();
        }

        return this.instance;
    }

    private static instance: UpdateManager;

    private lastUpdateId: number = 0;
    private fnQueue: any = {};
    private fnIndex: number = 0;
    private rndMsgMap: { [key: number]: boolean } = {};
    private messageList: { [key: string]: UpdateNewMessage.AsObject[] } = {};
    private messageDropList: { [key: string]: UpdateNewMessage.AsObject[] } = {};
    private readonly newMessageThrottle: any;
    private readonly newMessageDropThrottle: any;
    private readonly flushUpdateIdThrottle: any;
    private active: boolean = true;
    private userId: string = '';
    private outOfSync: boolean = false;
    private updateList: UpdateContainer.AsObject[] = [];
    private outOfSyncTimeout: any = null;

    public constructor() {
        window.console.log('Update manager started');
        this.lastUpdateId = this.loadLastUpdateId();
        this.newMessageThrottle = throttle(this.executeNewMessageThrottle, 300);
        this.newMessageDropThrottle = throttle(this.executeNewMessageDropThrottle, 300);
        this.flushUpdateIdThrottle = throttle(this.flushLastUpdateId, 300);
    }

    /* Loads last update id form localStorage */
    public loadLastUpdateId(): number {
        const data = localStorage.getItem('river.last_update_id');
        if (data) {
            this.lastUpdateId = JSON.parse(data).lastId;
            return this.lastUpdateId;
        }
        return 0;
    }

    public getLastUpdateId(): number {
        if (!this.lastUpdateId) {
            this.lastUpdateId = this.loadLastUpdateId();
        }
        return this.lastUpdateId;
    }

    public setLastUpdateId(id: number) {
        this.lastUpdateId = id;
    }

    public flushLastUpdateId = () => {
        localStorage.setItem('river.last_update_id', JSON.stringify({
            lastId: this.lastUpdateId,
        }));
    }

    public setUserId(userId: string) {
        this.userId = userId;
    }

    public getUserId() {
        return this.userId;
    }

    public parseUpdate(bytes: string) {
        if (!this.active) {
            return;
        }
        const data = UpdateContainer.deserializeBinary(base64ToU8a(bytes)).toObject();
        const currentUpdateId = this.lastUpdateId;
        const minId = data.minupdateid || 0;
        const maxId = data.maxupdateid || 0;
        window.console.log('on update, current:', currentUpdateId, 'min:', minId, 'max:', maxId);
        if ((this.outOfSync || currentUpdateId + 1 !== minId) && !(minId === 0 && maxId === 0)) {
            this.outOfSyncCheck(data);
            return;
        }
        this.applyUpdates(data);
    }

    public idleHandler() {
        this.callHandlers(C_MSG.OutOfSync, {});
    }

    public listen(eventConstructor: number, fn: any): (() => void) | null {
        if (!eventConstructor) {
            return null;
        }
        this.fnIndex++;
        const fnIndex = this.fnIndex;
        if (!this.fnQueue.hasOwnProperty(eventConstructor)) {
            this.fnQueue[eventConstructor] = {};
        }
        this.fnQueue[eventConstructor][fnIndex] = fn;
        return () => {
            delete this.fnQueue[eventConstructor][fnIndex];
        };
    }

    public forceLogOut() {
        this.callHandlers(C_MSG.UpdateAuthorizationReset, {});
    }

    public disable() {
        this.active = false;
    }

    public enable() {
        this.active = true;
    }

    /* Set message id from API */
    public setMessageId(messageId: number) {
        this.rndMsgMap[messageId] = true;
    }

    private applyUpdates(data: UpdateContainer.AsObject) {
        const updates = data.updatesList;
        const maxId = data.maxupdateid;
        if (maxId && maxId !== 0) {
            this.setLastUpdateId(maxId);
        }
        updates.forEach((update) => {
            this.responseUpdateMessageID(update);
        });
        updates.forEach((update) => {
            this.response(update);
        });
        if (data.usersList && data.usersList.length > 0) {
            this.callHandlers(C_MSG.UpdateUsers, data.usersList);
        }
        if (data.groupsList && data.groupsList.length > 0) {
            this.callHandlers(C_MSG.UpdateGroups, data.groupsList);
        }
    }

    /* Check out of sync message */
    private outOfSyncCheck(data?: UpdateContainer.AsObject) {
        if (data) {
            window.console.log('%c outOfSyncCheck', 'color: orange;');
            this.updateList.push(data);
            this.updateList.sort((i1, i2) => {
                return (i1.minupdateid || 0) - (i2.minupdateid || 0);
            });
            this.outOfSync = true;
        }
        if (this.updateList.length === 0) {
            this.outOfSync = false;
            return;
        }
        if (this.updateList[0].minupdateid === (this.lastUpdateId + 1)) {
            clearTimeout(this.outOfSyncTimeout);
            this.outOfSyncTimeout = null;
            const update = this.updateList.shift();
            if (update) {
                this.applyUpdates(update);
            }
            this.outOfSyncCheck();
        } else {
            if (this.outOfSyncTimeout === null) {
                this.outOfSyncTimeout = setTimeout(() => {
                    this.updateList = [];
                    this.outOfSync = false;
                    this.outOfSyncTimeout = null;
                    this.callHandlers(C_MSG.OutOfSync, {});
                    // this.disable();
                }, 500);
            }
        }
    }

    private responseUpdateMessageID(update: UpdateEnvelope.AsObject) {
        // @ts-ignore
        const data: Uint8Array = update.update;
        switch (update.constructor) {
            case C_MSG.UpdateMessageID:
                const updateMessageId = UpdateMessageID.deserializeBinary(data).toObject();
                this.rndMsgMap[updateMessageId.messageid || 0] = true;
                window.console.log(`%cUpdateMessageID`, 'color: #3E6A96;');
                this.callHandlers(C_MSG.UpdateMessageID, updateMessageId);
                break;
        }
    }

    private response(update: UpdateEnvelope.AsObject) {
        let flushUpdateId = false;
        // @ts-ignore
        const data: Uint8Array = update.update;
        switch (update.constructor) {
            case C_MSG.UpdateNewMessage:
                const updateNewMessage = UpdateNewMessage.deserializeBinary(data).toObject();
                if (!this.rndMsgMap[updateNewMessage.message.id || 0]) {
                    this.throttledNewMessage(updateNewMessage);
                } else {
                    window.console.log(`%cUpdateNewMessage drop on msg id: ${updateNewMessage.message.id}`, 'color: #cc0000;');
                    this.throttledNewMessageDrop(updateNewMessage);
                    delete this.rndMsgMap[updateNewMessage.message.id || 0];
                }
                break;
            case C_MSG.UpdateReadHistoryInbox:
                this.callHandlers(C_MSG.UpdateReadHistoryInbox, UpdateReadHistoryInbox.deserializeBinary(data).toObject());
                break;
            case C_MSG.UpdateReadHistoryOutbox:
                this.callHandlers(C_MSG.UpdateReadHistoryOutbox, UpdateReadHistoryOutbox.deserializeBinary(data).toObject());
                break;
            case C_MSG.UpdateUserTyping:
                this.callHandlers(C_MSG.UpdateUserTyping, UpdateUserTyping.deserializeBinary(data).toObject());
                break;
            case C_MSG.UpdateMessageEdited:
                const updateMessageEdited = UpdateMessageEdited.deserializeBinary(data).toObject();
                if (updateMessageEdited.message && this.messageList.hasOwnProperty(updateMessageEdited.message.peerid || '')) {
                    const index = findIndex(this.messageList[updateMessageEdited.message.peerid || ''], (item) => {
                        return item.message.id === updateMessageEdited.message.id;
                    });
                    if (index > -1) {
                        this.messageList[updateMessageEdited.message.peerid || ''][index].message = updateMessageEdited.message;
                    } else {
                        this.callHandlers(C_MSG.UpdateMessageEdited, updateMessageEdited);
                    }
                } else {
                    this.callHandlers(C_MSG.UpdateMessageEdited, updateMessageEdited);
                }
                flushUpdateId = true;
                break;
            case C_MSG.UpdateMessagesDeleted:
                const updateMessagesDeleted = UpdateMessagesDeleted.deserializeBinary(data).toObject();
                if (updateMessagesDeleted.peer) {
                    updateMessagesDeleted.messageidsList.forEach((id) => {
                        if (updateMessagesDeleted.peer && this.messageList.hasOwnProperty(updateMessagesDeleted.peer.id || '')) {
                            const index = findIndex(this.messageList[updateMessagesDeleted.peer.id || ''], (item) => {
                                return item.message.id === id;
                            });
                            if (index > -1) {
                                this.messageList[updateMessagesDeleted.peer.id || ''].splice(index, 1);
                            }
                        }
                    });
                }
                this.callHandlers(C_MSG.UpdateMessagesDeleted, updateMessagesDeleted);
                flushUpdateId = true;
                break;
            case C_MSG.UpdateUsername:
                this.callHandlers(C_MSG.UpdateUsername, UpdateUsername.deserializeBinary(data).toObject());
                flushUpdateId = true;
                break;
            case C_MSG.UpdateNotifySettings:
                this.callHandlers(C_MSG.UpdateNotifySettings, UpdateNotifySettings.deserializeBinary(data).toObject());
                flushUpdateId = true;
                break;
            case C_MSG.UpdateUserPhoto:
                this.callHandlers(C_MSG.UpdateUserPhoto, UpdateUserPhoto.deserializeBinary(data).toObject());
                flushUpdateId = true;
                break;
            case C_MSG.UpdateGroupPhoto:
                this.callHandlers(C_MSG.UpdateGroupPhoto, UpdateGroupPhoto.deserializeBinary(data).toObject());
                flushUpdateId = true;
                break;
            case C_MSG.UpdateReadMessagesContents:
                this.callHandlers(C_MSG.UpdateReadMessagesContents, UpdateReadMessagesContents.deserializeBinary(data).toObject());
                flushUpdateId = true;
                break;
            case C_MSG.UpdateTooLong:
                this.callHandlers(C_MSG.OutOfSync, {});
                break;
            case C_MSG.UpdateAuthorizationReset:
                this.callHandlers(C_MSG.UpdateAuthorizationReset, {});
                break;
            default:
                break;
        }
        if (flushUpdateId) {
            this.flushUpdateIdThrottle();
        }
    }

    private callHandlers(eventConstructor: number, payload: any) {
        if (!this.fnQueue[eventConstructor]) {
            return;
        }
        const keys = Object.keys(this.fnQueue[eventConstructor]);
        keys.forEach((key) => {
            const fn = this.fnQueue[eventConstructor][key];
            if (fn) {
                fn(payload);
            }
        });
    }

    private throttledNewMessage(data: UpdateNewMessage.AsObject) {
        if (!data.message.peerid) {
            return;
        }
        if (!this.messageList.hasOwnProperty(data.message.peerid)) {
            this.messageList[data.message.peerid] = [data];
        } else {
            this.messageList[data.message.peerid].push(data);
        }
        this.newMessageThrottle();
    }

    private executeNewMessageThrottle = () => {
        setTimeout(() => {
            this.prepareBulkUpdate(C_MSG.UpdateNewMessage, this.messageList);
        }, 100);
    }

    private throttledNewMessageDrop(data: UpdateNewMessage.AsObject) {
        if (!data.message.peerid) {
            return;
        }
        if (!this.messageDropList.hasOwnProperty(data.message.peerid)) {
            this.messageDropList[data.message.peerid] = [data];
        } else {
            this.messageDropList[data.message.peerid].push(data);
        }
        this.newMessageDropThrottle();
    }

    private executeNewMessageDropThrottle = () => {
        this.prepareBulkUpdate(C_MSG.UpdateNewMessageDrop, this.messageDropList);
    }

    private prepareBulkUpdate(eventConstructor: number, list: { [key: string]: UpdateNewMessage.AsObject[] }) {
        const keys = Object.keys(list);
        if (keys.length === 0) {
            return;
        }
        keys.forEach((key) => {
            const batchUpdate: INewMessageBulkUpdate = {
                accessHashes: [],
                messages: [],
                peerid: '',
                peertype: undefined,
                senderIds: [],
                senders: [],
            };
            while (list[key].length > 0) {
                const data = list[key].pop();
                if (data) {
                    batchUpdate.accessHashes.push(data.accesshash || '');
                    batchUpdate.messages.push(MessageRepo.parseMessage(data.message, this.userId));
                    batchUpdate.senderIds.push(data.sender.id || '');
                    batchUpdate.senders.push(data.sender);
                    batchUpdate.peerid = data.message.peerid || '';
                    batchUpdate.peertype = data.message.peertype;
                }
                if (batchUpdate.messages.length >= 50) {
                    break;
                }
            }
            if (batchUpdate.messages.length > 0) {
                this.callHandlers(eventConstructor, batchUpdate);
            }
        });
    }
}
