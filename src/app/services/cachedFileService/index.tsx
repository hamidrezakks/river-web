/*
    Creation Time: 2019 - Jan - 30
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2019
*/

import FileManager from '../sdk/fileManager/index';
import {InputFileLocation} from '../sdk/messages/chat.core.types_pb';
import FileRepo from '../../repository/file/index';
// @ts-ignore
import glur from 'glur';

interface IFile {
    location: InputFileLocation.AsObject;
    retries: number;
    size: number;
    src: string;
    timeout: null;
}

const C_MAX_RETRY = 3;
const C_CACHE_TTL = 180;

export default class CachedFileService {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new CachedFileService();
        }
        return this.instance;
    }

    private static instance: CachedFileService;

    private fileManager: FileManager;
    private fileRepo: FileRepo;
    private files: { [key: number]: IFile } = {};

    public constructor() {
        this.fileManager = FileManager.getInstance();
        this.fileRepo = FileRepo.getInstance();
    }

    /* Get file */
    public getFile(fileLocation: InputFileLocation.AsObject, size: number, blurRadius?: number): Promise<string> {
        const id = fileLocation.fileid || '';
        return new Promise((resolve, reject) => {
            if (this.files.hasOwnProperty(id)) {
                if (this.files[id].retries > C_MAX_RETRY) {
                    reject();
                    return;
                }
                if (this.files[id].src !== '') {
                    if (this.files[id].timeout !== null) {
                        clearTimeout(this.files[id].timeout);
                    }
                    resolve(this.files[id].src);
                    return;
                }
            }
            if (id !== '0') {
                this.files[id] = {
                    location: fileLocation,
                    retries: 0,
                    size,
                    src: '',
                    timeout: null,
                };
                this.getLocalFile(id, blurRadius).then((res) => {
                    resolve(res);
                }).catch(() => {
                    this.getRemoteFile(fileLocation, size, blurRadius).then((res) => {
                        resolve(res);
                    }).catch(() => {
                        reject();
                    });
                });
            }
        });
    }

    /* Reset retries */
    public resetRetries(id: string) {
        if (this.files.hasOwnProperty(id)) {
            this.files[id].retires = 0;
        }
    }

    /* Start cache clear timeout */
    public unmountCache(id: string) {
        if (this.files.hasOwnProperty(id)) {
            this.files[id].timeout = setTimeout(() => {
                if (this.files.hasOwnProperty(id)) {
                    if (this.files[id].src !== '') {
                        URL.revokeObjectURL(this.files[id].src);
                    }
                    delete this.files[id];
                }
            }, C_CACHE_TTL * 1000);
        }
    }

    /* Get blurred image */
    private getBlurredImage(id: string, blob: Blob, radius: number): Promise<Blob> {
        return this.fileRepo.get(`b_${radius}_${id}`).then((file) => {
            if (file) {
                return file.data;
            } else {
                return this.createBlurredImage(blob, radius).then((data) => {
                    this.fileRepo.createWithHash(`b_${radius}_${id}`, data).catch(() => {
                        //
                    });
                    return data;
                });
            }
        });
    }

    /* Create blurred image */
    private createBlurredImage(blob: Blob, radius: number): Promise<Blob> {
        return new Promise<Blob>((resolve, reject) => {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject('no ctx');
            }
            const img = new Image();
            img.onload = () => {
                ctx.canvas.height = img.height;
                ctx.canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                glur(imageData.data, img.width, img.height, radius);
                ctx.putImageData(imageData, 0, 0);
                canvas.toBlob((data) => {
                    if (data) {
                        resolve(data);
                    } else {
                        reject('cannot create blob');
                    }
                    URL.revokeObjectURL(img.src);
                    img.remove();
                }, 'image/png');
            };
            img.src = URL.createObjectURL(blob);
        });
    }

    /* Get remote file */
    private getRemoteFile(fileLoc: InputFileLocation.AsObject, size: number, blurRadius?: number): Promise<string> {
        const id = fileLoc.fileid || '';
        return new Promise((resolve, reject) => {
            const fileLocation = new InputFileLocation();
            fileLocation.setFileid(id);
            fileLocation.setAccesshash(fileLoc.accesshash || '');
            fileLocation.setClusterid(fileLoc.clusterid || 1);
            fileLocation.setVersion(fileLoc.version || 0);
            this.fileManager.receiveFile(fileLocation, size, 'image/jpeg').then(() => {
                this.fileRepo.get(fileLoc.fileid || '').then((fileRes) => {
                    if (fileRes) {
                        this.files[id].retries = 0;
                        if (blurRadius && fileRes.data.size > 0) {
                            this.getBlurredImage(id, fileRes.data, blurRadius).then((blurredBlob) => {
                                this.files[id].src = URL.createObjectURL(blurredBlob);
                                resolve(this.files[id].src);
                            });
                        } else {
                            this.files[id].src = fileRes.data.size === 0 ? '' : URL.createObjectURL(fileRes.data);
                            resolve(this.files[id].src);
                        }
                    } else {
                        this.files[id].retries++;
                        reject();
                    }
                });
            }).catch(() => {
                this.files[id].retries++;
                reject();
            });
        });
    }

    /* Get local file */
    private getLocalFile(id: string, blurRadius?: number): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.files.hasOwnProperty(id)) {
                this.fileRepo.get(id).then((fileRes) => {
                    if (fileRes) {
                        if (blurRadius && fileRes.data.size > 0) {
                            this.getBlurredImage(id, fileRes.data, blurRadius).then((blurredBlob) => {
                                this.files[id].src = URL.createObjectURL(blurredBlob);
                                resolve(this.files[id].src);
                            });
                        } else {
                            this.files[id].src = fileRes.data.size === 0 ? '' : URL.createObjectURL(fileRes.data);
                            resolve(this.files[id].src);
                        }
                    } else {
                        reject();
                    }
                }).catch(() => {
                    reject();
                });
            } else {
                reject();
            }
        });
    }
}
