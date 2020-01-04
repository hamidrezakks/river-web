/*
    Creation Time: 2018 - Sep - 29
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2018
*/

import DB from '../../services/db/user';
import {IUser} from './interface';
import {differenceBy, find, uniqBy} from 'lodash';
import SDK from "../../services/sdk";
import {DexieUserDB} from '../../services/db/dexie/user';
import Dexie from 'dexie';
import {Int64BE} from 'int64-buffer';
// @ts-ignore
import CRC from 'js-crc/build/crc.min';
import {InputUser, UserStatus} from '../../services/sdk/messages/chat.core.types_pb';
import RiverTime from '../../services/utilities/river_time';
import Broadcaster from '../../services/broadcaster';
import {kMerge} from "../../services/utilities/kDash";

export const getContactsCrc = (users: IUser[]) => {
    const ids = users.map((user) => {
        const space = '                    ';
        const id = user.id || '';
        const wLen = 20 - id.length;
        return {
            id: new Int64BE(id),
            wid: space.slice(0, wLen) + id
        };
    });
    ids.sort((i1, i2) => {
        return i1.wid < i2.wid ? -1 : 1;
    });
    const data: number[] = [];
    ids.forEach((id) => {
        data.push(...id.id.toArray());
    });
    return parseInt(CRC.crc32(data), 16);
};

export default class UserRepo {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserRepo();
        }

        return this.instance;
    }

    private static instance: UserRepo;

    private dbService: DB;
    private db: DexieUserDB;
    private sdk: SDK;
    private lastContactTimestamp: number = 0;
    private broadcaster: Broadcaster;
    private bubbleMode: string = localStorage.getItem('river.theme.bubble') || '4';

    private constructor() {
        this.dbService = DB.getInstance();
        this.db = this.dbService.getDB();
        this.sdk = SDK.getInstance();
        this.broadcaster = Broadcaster.getInstance();
    }

    public getBubbleMode() {
        return this.bubbleMode;
    }

    public setBubbleMode(mode: string) {
        this.bubbleMode = mode;
    }

    public getCurrentUserId(): string {
        return this.sdk.getConnInfo().UserID || '';
    }

    public create(user: IUser) {
        return this.db.users.put(user);
    }

    public createMany(users: IUser[]) {
        return this.db.users.bulkPut(users);
    }

    public get(id: string): Promise<IUser> {
        const user = this.dbService.getUser(id);
        if (user) {
            return Promise.resolve(user);
        }
        return this.db.users.get(id).then((u: IUser | undefined) => {
            if (u) {
                this.dbService.setUser(u);
            }
            return u;
        });
    }

    public findInArray(ids: string[], skip: number, limit: number) {
        return this.db.users.where('id').anyOf(ids).offset(skip || 0).limit(limit).toArray();
    }

    public getFull(id: string, cacheCB?: (us: IUser) => void): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            this.get(id).then((user) => {
                if (user) {
                    if (cacheCB) {
                        cacheCB(user);
                    }
                    const input: InputUser = new InputUser();
                    input.setUserid(user.id || '');
                    input.setAccesshash(user.accesshash || '');
                    this.sdk.getUserFull([input]).then((res) => {
                        this.upsert(false, res.usersList);
                        const u = find(res.usersList, {id});
                        if (u) {
                            // @ts-ignore
                            u.is_contact = user.is_contact;
                            if (user.phone && user.phone.length > 0) {
                                u.phone = user.phone;
                            }
                            resolve(u);
                        } else {
                            reject('none found');
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    reject('none found');
                }
            });
        });
    }

    public getInstantContact(id: string): IUser | null {
        const contact = this.dbService.getUser(id);
        if (contact && (contact.is_contact || contact.accesshash !== '')) {
            return contact;
        } else {
            return null;
        }
    }

    public getInstant(id: string): IUser | null {
        return this.dbService.getUser(id);
    }

    public getManyCache(isContact: boolean, {keyword, limit}: any): Promise<IUser[]> {
        const reg = new RegExp(keyword || '', 'gi');
        const searchFilter = (u: IUser) => {
            if (reg.test('Saved Messages')) {
                if (u.id === this.sdk.getConnInfo().UserID) {
                    return true;
                }
            }
            return (reg.test(u.phone || '') || reg.test(u.username || '') || reg.test(`${u.firstname} ${u.lastname}`));
        };
        if (isContact) {
            if (!keyword) {
                return this.db.users.where('[is_contact+username]').between([1, Dexie.minKey], [1, Dexie.maxKey], true, true).limit(limit || 1000).toArray();
            }
            return this.db.users.where('[is_contact+username]').between([1, Dexie.minKey], [1, Dexie.maxKey], true, true).filter(searchFilter).limit(limit || 12).toArray();
        } else {
            if (!keyword) {
                return this.db.users.limit(limit || 1000).toArray();
            }
            return this.db.users.filter(searchFilter).limit(limit || 12).toArray();
        }
    }

    public importBulk(isContact: boolean, users: IUser[], force?: boolean): Promise<any> {
        if (!users || users.length === 0) {
            return Promise.resolve();
        }
        const tempUsers = uniqBy(users, 'id');
        return this.upsert(isContact, tempUsers, force);
    }

    public upsert(isContact: boolean, users: IUser[], force?: boolean): Promise<any> {
        const ids = users.map((user) => {
            user.is_contact = isContact ? 1 : 0;
            return user.id || '';
        });
        if (users.length === 0) {
            return Promise.resolve();
        }
        return this.db.users.where('id').anyOf(ids).toArray().then((result) => {
            const createItems: IUser[] = differenceBy(users, result, 'id');
            const updateItems: IUser[] = result;
            updateItems.map((user: IUser) => {
                return this.mergeUser(users, user, force);
            });
            createItems.forEach((user: IUser) => {
                if (user.status === UserStatus.USERSTATUSONLINE && !user.status_last_modified) {
                    user.status_last_modified = RiverTime.getInstance().now();
                }
            });
            const list = [...createItems, ...updateItems];
            list.forEach((item) => {
                this.dbService.setUser(item);
            });
            return this.createMany(list);
        }).then((res) => {
            this.broadcastEvent('User_DB_Updated', {ids});
            return res;
        });
    }

    public getAllContacts(cb?: (users: IUser[]) => void): Promise<IUser[]> {
        if (cb) {
            this.getManyCache(true, {}).then((res) => {
                cb(res);
            });
        }
        return new Promise((resolve, reject) => {
            const now = Math.floor(Date.now() / 1000);
            if (now - this.lastContactTimestamp < 1800) {
                this.getManyCache(true, {}).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                const crc32 = this.getContactsCrc();
                this.sdk.getContacts(crc32 + 1).then((remoteRes) => {
                    if (remoteRes.modified) {
                        this.importBulk(true, remoteRes.contactusersList).then(() => {
                            this.importBulk(false, remoteRes.usersList);
                        });
                        this.storeContactsCrc(remoteRes.contactusersList);
                        this.lastContactTimestamp = now;
                        resolve(remoteRes.contactusersList);
                    } else {
                        this.lastContactTimestamp = now;
                        this.getManyCache(true, {}).then((res) => {
                            resolve(res);
                        });
                    }
                });
            }
        });
    }

    public removeContact(id: string) {
        return this.db.users.where('id').equals(id).first().then((user) => {
            if (user) {
                user.is_contact = 0;
                this.dbService.setUser(user);
                this.createMany([user]);
            }
        });
    }

    private mergeUser(users: IUser[], user: IUser, force?: boolean) {
        const t = find(users, {id: user.id});
        const modifyUser = (u1: IUser, u2: IUser): IUser => {
            if (u2.status === UserStatus.USERSTATUSONLINE && !u2.status_last_modified) {
                u2.status_last_modified = RiverTime.getInstance().now();
            }
            if (u1.status !== undefined && u2.status === undefined) {
                u2.status = u1.status;
            }
            if (u1.status_last_modified !== undefined && u2.status_last_modified === undefined) {
                u2.status_last_modified = u1.status_last_modified;
            }
            if (!force && u1.username && u1.username.length > 0 && (!u2.username || (u2.username && u2.username.length === 0))) {
                u2.username = u1.username;
            }
            if (!force && u1.bio && u1.bio.length > 0 && (!u2.bio || (u2.bio && u2.bio.length === 0))) {
                u2.bio = u1.bio;
            }
            if (!force && u1.phone && u1.phone.length > 0 && (!u2.phone || (u2.phone && u2.phone.length === 0))) {
                u2.phone = u1.phone;
            }
            if ((u2.status_last_modified || 0) < (u2.lastseen || 0)) {
                u2.status_last_modified = u2.lastseen;
            }
            if (u2.status === UserStatus.USERSTATUSOFFLINE) {
                u2.status_last_modified = 0;
            }
            return kMerge(u1, u2);
        };
        if (t && user.is_contact === 1) {
            t.is_contact = 1;
            return modifyUser(user, t);
        } else if (t) {
            return modifyUser(user, t);
        } else {
            return user;
        }
    }

    private getContactsCrc() {
        const crc = localStorage.getItem('river.contacts.hash') || '0';
        return parseInt(crc, 10);
    }

    private storeContactsCrc(users: IUser[]) {
        const crc32 = getContactsCrc(users);
        localStorage.setItem('river.contacts.hash', String(crc32));
    }

    private broadcastEvent(name: string, data: any) {
        this.broadcaster.publish(name, data);
    }
}
