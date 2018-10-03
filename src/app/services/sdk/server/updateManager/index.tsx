import {C_MSG} from '../../const';
import {UpdateContainer, UpdateEnvelope} from '../../messages/core.messages_pb';
import {
    UpdateMessageEdited, UpdateMessageID,
    UpdateNewMessage,
    UpdateReadHistoryInbox,
    UpdateReadHistoryOutbox,
    UpdateUserTyping
} from '../../messages/api.updates_pb';

export default class UpdateManager {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new UpdateManager();
        }

        return this.instance;
    }

    private static instance: UpdateManager;

    private fnQueue: any = {};
    private fnIndex: number = 0;

    public constructor() {
        window.console.log('Update manager started');
    }

    public parseUpdate(bytes: string) {
        // @ts-ignore
        const arr = Uint8Array.from(atob(bytes), c => c.charCodeAt(0));
        const data = UpdateContainer.deserializeBinary(arr);
        const updates = data.getUpdatesList();
        updates.forEach((update) => {
            this.response(update);
        });
    }

    public listen(eventConstructor: number, fn: any): (() => void) | null {
        if (!eventConstructor) {
            return null;
        }
        this.fnIndex++;
        if (!this.fnQueue.hasOwnProperty(eventConstructor)) {
            this.fnQueue[eventConstructor] = {};
        }
        this.fnQueue[eventConstructor][this.fnIndex] = fn;
        return () => {
            delete this.fnQueue[eventConstructor][this.fnIndex];
        };
    }

    private response(update: UpdateEnvelope) {
        // @ts-ignore
        const data: Uint8Array = update.getUpdate();
        switch (update.getConstructor()) {
            case C_MSG.UpdateNewMessage:
                this.callHandlers(C_MSG.UpdateNewMessage, UpdateNewMessage.deserializeBinary(data).toObject());
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
                this.callHandlers(C_MSG.UpdateMessageEdited, UpdateMessageEdited.deserializeBinary(data).toObject());
                break;
            case C_MSG.UpdateMessageID:
                this.callHandlers(C_MSG.UpdateMessageID, UpdateMessageID.deserializeBinary(data).toObject());
                break;
            default:
                break;
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
}
