/*
    Creation Time: 2019 - Jan - 12
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2019
*/

import DB from '../../services/db/file';
import {IFile, IFileMap, ITempFile} from './interface';
import {DexieFileDB} from '../../services/db/dexie/file';
import Dexie from 'dexie';
import {arrayBufferToBase64} from '../../services/sdk/fileManager/http/utils';
import {sha256} from 'js-sha256';
import md5 from "md5-webworker";
import {InputFileLocation} from "../../services/sdk/messages/chat.core.types_pb";
import {find, differenceWith, uniq} from "lodash";
import {kMerge} from "../../services/utilities/kDash";
import {IMessage} from "../message/interface";
import {getMediaDocument} from "../message";
import {MediaDocument} from "../../services/sdk/messages/chat.core.message.medias_pb";

export const md5FromBlob = (theBlob: Blob): Promise<string> => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = 'tempfile';
    return md5(theBlob as File);
};

export const getFileLocation = (msg: IMessage) => {
    let fileLocation: InputFileLocation | undefined;
    const mediaDocument = getMediaDocument(msg);
    if (mediaDocument && mediaDocument.doc && mediaDocument.doc.id) {
        fileLocation = new InputFileLocation();
        fileLocation.setAccesshash(mediaDocument.doc.accesshash || '');
        fileLocation.setClusterid(mediaDocument.doc.clusterid || 0);
        fileLocation.setFileid(mediaDocument.doc.id);
        fileLocation.setVersion(mediaDocument.doc.version || 0);
    }
    return fileLocation;
};

export default class FileRepo {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new FileRepo();
        }

        return this.instance;
    }

    private static instance: FileRepo;

    private dbService: DB;
    private db: DexieFileDB;

    private constructor() {
        this.dbService = DB.getInstance();
        this.db = this.dbService.getDB();
    }

    public getTemp(id: string, part: number): Promise<ITempFile> {
        return this.db.temps.where('[id+part]').equals([id, part]).filter((item) => {
            return item.part === part;
        }).first();
    }

    public getTempsById(id: string): Promise<ITempFile[]> {
        return this.db.temps.where('[id+part]').between([id, Dexie.minKey], [id, Dexie.maxKey], true, true).toArray();
    }

    public removeTempsById(id: string) {
        return this.db.temps.where('[id+part]').between([id, Dexie.minKey], [id, Dexie.maxKey], true, true).delete();
    }

    public setTemp(tempFile: ITempFile) {
        return this.db.temps.put(tempFile);
    }

    public getIn(ids: string[]) {
        const pipe = this.db.files.where('id').anyOf(ids);
        return pipe.toArray();
    }

    public persistTempFiles(id: string, docId: string, mimeType: string) {
        return this.get(docId).then((file) => {
            if (file) {
                return {
                    md5: file.md5,
                    sha256: file.hash,
                };
            } else {
                return this.getTempsById(id).then((temps) => {
                    if (temps.length === 0) {
                        return {
                            md5: '',
                            sha256: '',
                        };
                    }
                    const blobs: Blob[] = [];
                    temps.forEach((temp) => {
                        blobs.push(temp.data);
                    });
                    const blob = new Blob(blobs, {type: mimeType});
                    setTimeout(() => {
                        this.removeTempsById(id);
                    }, 1000);
                    return this.createWithHash(docId, blob);
                });
            }
        });
    }

    public createWithHash(id: string, blob: Blob) {
        return this.createHash(blob).then((res) => {
            const file: IFile = {
                data: blob,
                hash: res.sha256,
                id,
                md5: res.md5,
                size: blob.size,
            };
            return this.create(file).then(() => {
                return {
                    md5: res.md5,
                    sha256: res.sha256,
                };
            });
        });
    }

    public create(file: IFile) {
        return this.db.files.add(file);
    }

    public remove(id: string) {
        return this.db.files.delete(id);
    }

    public removeMany(ids: string[]) {
        return this.db.files.bulkDelete(ids);
    }

    public upsertFile(id: string, blob: Blob) {
        return this.createHash(blob).then((res) => {
            const file: IFile = {
                data: blob,
                hash: res.sha256,
                id,
                md5: res.md5,
                size: blob.size,
            };
            return this.db.files.put(file);
        });
    }

    public get(id: string) {
        return this.db.files.get(id);
    }

    public upsertFileMap(fileMaps: IFileMap[]) {
        const indexList: any[] = fileMaps.map((f) => {
            return [f.id, f.clusterid];
        });
        return this.db.fileMap.where('[id+clusterid]').anyOf(indexList).toArray().then((result) => {
            const createItems: IFileMap[] = differenceWith(fileMaps, result, (i1, i2) => i1.id === i2.id && i1.clusterid === i2.clusterid);
            const updateItems: IFileMap[] = result;
            updateItems.map((fileMap: IFileMap) => {
                const t = find(fileMaps, {id: fileMap.id, clusterid: fileMap.clusterid});
                if (t) {
                    if (t.msg_ids && fileMap.msg_ids) {
                        t.msg_ids = uniq([...t.msg_ids, ...fileMap.msg_ids]);
                    }
                    return kMerge(fileMap, t);
                } else {
                    return fileMap;
                }
            });
            return this.db.fileMap.bulkPut([...createItems, ...updateItems]);
        }).catch((err: any) => {
            window.console.debug('fileMap upsert', err);
        });
    }

    public getFileMapByMediaDocument(mediaDocument: MediaDocument.AsObject): Promise<IFileMap | undefined> {
        return this.getFileMap({
            clusterid: mediaDocument.doc.clusterid,
            fileid: mediaDocument.doc.id,
        });
    }

    public getFileMap(inputFile: InputFileLocation.AsObject): Promise<IFileMap | undefined> {
        return this.db.fileMap.where('[id+clusterid]').equals([inputFile.fileid || '', inputFile.clusterid || 0]).toArray().then((res) => {
            if (res.length > 0) {
                return res[0];
            } else {
                return undefined;
            }
        });
    }

    private createSha256(blob: Blob): Promise<string> {
        return new Promise((resolve) => {
            const fileReader = new FileReader();
            fileReader.onload = (event) => {
                // @ts-ignore
                const data: ArrayBuffer = event.target.result;
                try {
                    window.crypto.subtle.digest('SHA-256', data).then((res) => {
                        resolve(arrayBufferToBase64(res));
                    });
                } catch (e) {
                    resolve(arrayBufferToBase64(sha256.arrayBuffer(data)));
                }
            };
            fileReader.readAsArrayBuffer(blob);
        });
    }

    private createHash(blob: Blob): Promise<{ md5: string, sha256: string }> {
        return new Promise<{ md5: string, sha256: string }>((resolve, reject) => {
            const promise: any[] = [];
            promise.push(md5FromBlob(blob));
            promise.push(this.createSha256(blob));
            Promise.all(promise).then((res) => {
                resolve({
                    md5: res[0],
                    sha256: res[1],
                });
            }).catch(reject);
        });
    }
}
