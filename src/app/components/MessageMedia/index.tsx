/*
    Creation Time: 2019 - Feb - 05
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2019
*/

import * as React from 'react';
import {IMessage} from '../../repository/message/interface';
import {FileLocation, InputPeer} from '../../services/sdk/messages/chat.core.types_pb';
import {
    DocumentAttributePhoto,
    DocumentAttributeType, DocumentAttributeVideo,
    MediaDocument
} from '../../services/sdk/messages/chat.core.message.medias_pb';
import {CloseRounded, CloudDownloadRounded} from '@material-ui/icons';
import {IFileProgress} from '../../services/sdk/fileManager';
import ProgressBroadcaster from '../../services/progress';
import CachedPhoto from '../CachedPhoto';
import {IDocument} from '../../services/documentViewerService';
import DocumentViewerService from '../../services/documentViewerService';
import {getHumanReadableSize} from '../MessageFile';

import './style.css';

const C_MAX_HEIGHT = 256;
const C_MIN_HEIGHT = 64;
const C_MAX_WIDTH = 256;
const C_MIN_WIDTH = 64;

export interface IMediaInfo {
    caption: string;
    duration?: number;
    file: FileLocation.AsObject;
    height: number;
    size: number;
    thumbFile: FileLocation.AsObject;
    type: string;
    width: number;
}

export const getMediaInfo = (message: IMessage): IMediaInfo => {
    const info: IMediaInfo = {
        caption: '',
        file: {
            accesshash: '',
            clusterid: 0,
            fileid: '',
        },
        height: 0,
        size: 0,
        thumbFile: {
            accesshash: '',
            clusterid: 0,
            fileid: '',
        },
        type: '',
        width: 0,
    };
    const messageMediaDocument: MediaDocument.AsObject = message.mediadata;
    info.caption = messageMediaDocument.caption || '';
    info.size = messageMediaDocument.doc.filesize || 0;
    info.type = messageMediaDocument.doc.mimetype || '';
    info.file = {
        accesshash: messageMediaDocument.doc.accesshash,
        clusterid: messageMediaDocument.doc.clusterid,
        fileid: messageMediaDocument.doc.id,
    };
    if (messageMediaDocument.doc.thumbnail) {
        info.thumbFile = {
            accesshash: messageMediaDocument.doc.thumbnail.accesshash,
            clusterid: messageMediaDocument.doc.thumbnail.clusterid,
            fileid: messageMediaDocument.doc.thumbnail.fileid,
        };
    }
    if (!message.attributes) {
        return info;
    }
    messageMediaDocument.doc.attributesList.forEach((attr, index) => {
        if (attr.type === DocumentAttributeType.ATTRIBUTETYPEPHOTO && message.attributes) {
            const docAttr: DocumentAttributePhoto.AsObject = message.attributes[index];
            info.height = docAttr.height || 0;
            info.width = docAttr.width || 0;
        } else if (attr.type === DocumentAttributeType.ATTRIBUTETYPEVIDEO && message.attributes) {
            const docAttr: DocumentAttributeVideo.AsObject = message.attributes[index];
            info.height = docAttr.height || 0;
            info.width = docAttr.width || 0;
            info.duration = docAttr.duration;
        }
    });
    return info;
};

interface IProps {
    measureFn: any;
    message: IMessage;
    onAction?: (cmd: 'cancel' | 'download' | 'cancel_download' | 'view' | 'open', message: IMessage) => void;
    peer: InputPeer | null;
}

interface IState {
    fileState: 'download' | 'view' | 'progress' | 'open';
    info: IMediaInfo;
    message: IMessage;
}

class MessageMedia extends React.PureComponent<IProps, IState> {
    private lastId: number = 0;
    private fileId: string = '';
    private downloaded: boolean = false;
    private saved: boolean = false;
    private circleProgressRef: any = null;
    private eventReferences: any[] = [];
    private progressBroadcaster: ProgressBroadcaster;
    private pictureSizeRef: any = null;
    private fileSize: number = 0;
    private documentViewerService: DocumentViewerService;
    private readonly pictureContentSize: { height: string, width: string } = {
        height: `${C_MIN_HEIGHT}px`,
        width: `${C_MIN_WIDTH}px`
    };
    private pictureBigRef: any = null;

    constructor(props: IProps) {
        super(props);

        const info = getMediaInfo(props.message);
        this.fileSize = info.size;

        this.pictureContentSize = this.getContentSize(info);

        this.state = {
            fileState: this.getFileState(props.message),
            info,
            message: props.message,
        };

        if (props.message) {
            this.lastId = props.message.id || 0;
            this.downloaded = props.message.downloaded || false;
            this.saved = props.message.saved || false;
        }

        this.progressBroadcaster = ProgressBroadcaster.getInstance();
        this.documentViewerService = DocumentViewerService.getInstance();
    }

    public componentDidMount() {
        const {message} = this.state;
        const messageMediaDocument: MediaDocument.AsObject = message.mediadata;
        if (!message || !messageMediaDocument.doc) {
            return;
        }
        this.displayFileSize(0);
        this.fileId = messageMediaDocument.doc.id || '';
        this.initProgress();
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (newProps.message && this.lastId !== newProps.message.id) {
            this.lastId = newProps.message.id || 0;
            const info = getMediaInfo(newProps.message);
            this.fileSize = info.size;
            this.displayFileSize(0);
            this.setState({
                fileState: this.getFileState(newProps.message),
                info,
                message: newProps.message,
            }, () => {
                this.initProgress();
            });
        }
        const messageMediaDocument: MediaDocument.AsObject = newProps.message.mediadata;
        if (messageMediaDocument && messageMediaDocument.doc && messageMediaDocument.doc.id !== this.fileId) {
            this.fileId = messageMediaDocument.doc.id || '';
            this.setState({
                message: newProps.message,
            });
        }
        if ((newProps.message.downloaded || false) !== this.downloaded) {
            this.downloaded = (newProps.message.downloaded || false);
            this.setState({
                fileState: this.getFileState(newProps.message),
            });
        }
        if ((newProps.message.saved || false) !== this.saved) {
            this.saved = (newProps.message.saved || false);
            this.setState({
                fileState: this.getFileState(newProps.message),
                message: newProps.message,
            });
        }
    }

    public componentWillUnmount() {
        this.removeAllListeners();
    }

    /* View downloaded document */
    public viewDocument() {
        const {fileState} = this.state;
        if (this.pictureBigRef && (fileState === 'view' || fileState === 'open')) {
            this.showPictureHandler(this.pictureBigRef);
        }
    }

    public render() {
        const {fileState, info, message} = this.state;
        return (
            <div className="message-media">
                <div className="media-content" style={this.pictureContentSize}>
                    {Boolean(fileState !== 'view' && fileState !== 'open') &&
                    <React.Fragment>
                        <div className="media-size" ref={this.pictureSizeRefHandler}>0 KB</div>
                        <div className="media-thumb">
                            <CachedPhoto className="picture"
                                         fileLocation={(message.id || 0) > 0 ? info.thumbFile : info.file}
                                         onLoad={this.cachedPhotoLoadHandler} blur={10} searchTemp={true}/>
                            <div className="picture-action">
                                {Boolean(fileState === 'download') &&
                                <CloudDownloadRounded onClick={this.downloadFileHandler}/>}
                                {Boolean(fileState === 'progress') && <React.Fragment>
                                    <div className="progress">
                                        <svg viewBox='0 0 32 32'>
                                            <circle ref={this.progressRefHandler} r='14' cx='16' cy='16'/>
                                        </svg>
                                    </div>
                                    <CloseRounded className="action" onClick={this.cancelFileHandler}/>
                                </React.Fragment>}
                            </div>
                        </div>
                    </React.Fragment>}
                    {Boolean(fileState === 'view' || fileState === 'open') &&
                    <div ref={this.pictureBigRefHandler} className="media-big" onClick={this.showPictureHandler}>
                        <CachedPhoto className="picture" fileLocation={info.file}
                                     onLoad={this.cachedPhotoLoadHandler}/>
                    </div>}
                </div>
                {Boolean(info.caption.length > 0) && <div className="media-caption">{info.caption}</div>}
            </div>
        );
    }

    /* Remove all listeners */
    private removeAllListeners() {
        this.eventReferences.forEach((canceller) => {
            if (typeof canceller === 'function') {
                canceller();
            }
        });
    }

    /* Get file state */
    private getFileState(message: IMessage) {
        const id = message.id || 0;
        if (id <= 0) {
            return 'progress';
        } else if (id > 0 && !message.downloaded) {
            return 'download';
        } else if (id > 0 && !message.saved) {
            return 'view';
        } else {
            return 'open';
        }
    }

    /* Progress circle ref handler */
    private progressRefHandler = (ref: any) => {
        this.circleProgressRef = ref;
    }

    /* Upload progress handler */
    private uploadProgressHandler = (progress: IFileProgress) => {
        const {message} = this.state;
        if ((message.id || 0) > 0) {
            this.displayFileSize(progress.download);
        } else {
            this.displayFileSize(progress.upload);
        }
        if (!this.circleProgressRef) {
            return;
        }
        let v = 3;
        if (progress.state === 'failed') {
            this.setState({
                fileState: 'download',
            });
            return;
        } else if (progress.state !== 'complete' && progress.download > 0) {
            v = progress.progress * 85;
        } else if (progress.state === 'complete') {
            v = 88;
        }
        if (v < 3) {
            v = 3;
        }
        this.circleProgressRef.style.strokeDasharray = `${v} 88`;
    }

    /* Download file handler */
    private downloadFileHandler = () => {
        if (this.props.onAction) {
            this.props.onAction('download', this.state.message);
            this.setState({
                fileState: 'progress',
            }, () => {
                this.initProgress();
            });
        }
    }

    /* Initialize progress bar */
    private initProgress() {
        const {message} = this.props;
        if (!message) {
            return;
        }
        if (this.state.fileState === 'progress') {
            if (message) {
                this.removeAllListeners();
                this.eventReferences.push(this.progressBroadcaster.listen(message.id || 0, this.uploadProgressHandler));
            }
        } else {
            if (this.progressBroadcaster.isActive(message.id || 0)) {
                this.setState({
                    fileState: 'progress',
                }, () => {
                    this.removeAllListeners();
                    this.eventReferences.push(this.progressBroadcaster.listen(message.id || 0, this.uploadProgressHandler));
                });
            }
        }
    }

    /* Cancel file download/upload */
    private cancelFileHandler = () => {
        if (this.props.onAction) {
            if (this.props.message && (this.props.message.id || 0) < 0) {
                this.props.onAction('cancel', this.state.message);
            } else {
                this.props.onAction('cancel_download', this.state.message);
            }
        }
    }

    /* CachedPhoto onLoad handler */
    private cachedPhotoLoadHandler = () => {
        if (this.props.measureFn) {
            this.props.measureFn();
        }
    }

    /* Picture big ref handler */
    private pictureBigRefHandler = (ref: any) => {
        this.pictureBigRef = ref;
    }

    /* Get content size */
    private getContentSize(info: IMediaInfo): { height: string, width: string } {
        const ratio = info.height / info.width;
        let height = info.height;
        let width = info.width;
        if (ratio > 1.0) {
            if (info.height < C_MAX_HEIGHT) {
                height = info.height;
                width = info.height / ratio;
            } else {
                height = C_MAX_HEIGHT;
                width = C_MAX_HEIGHT / ratio;
            }
        } else {
            if (info.width < C_MAX_WIDTH) {
                width = info.width;
                height = info.width * ratio;
            } else {
                width = C_MAX_WIDTH;
                height = C_MAX_WIDTH * ratio;
            }
        }
        if (isNaN(height)) {
            height = C_MIN_HEIGHT;
        }
        if (isNaN(width)) {
            width = C_MIN_WIDTH;
        }
        height = Math.max(height, C_MIN_HEIGHT);
        width = Math.max(width, C_MIN_WIDTH);
        return {
            height: `${height}px`,
            width: `${width}px`,
        };
    }

    /* Show picture handler */
    private showPictureHandler = (e: any) => {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        const {info, message} = this.state;
        if (!info || !info.file) {
            return;
        }
        const doc: IDocument = {
            items: [{
                caption: info.caption,
                fileLocation: info.file,
                height: info.height,
                id: message.id || 0,
                width: info.width,
            }],
            peerId: message.peerid || '',
            rect: (e.currentTarget || e).getBoundingClientRect(),
            type: 'picture',
        };
        this.documentViewerService.loadDocument(doc);
    }

    /* File size ref handler */
    private pictureSizeRefHandler = (ref: any) => {
        this.pictureSizeRef = ref;
    }

    /* Display file size */
    private displayFileSize(loaded: number) {
        if (!this.pictureSizeRef) {
            return;
        }
        if (loaded <= 0) {
            this.pictureSizeRef.innerText = `${getHumanReadableSize(this.fileSize)}`;
        } else {
            this.pictureSizeRef.innerText = `${getHumanReadableSize(loaded)} / ${getHumanReadableSize(this.fileSize)}`;
        }
    }
}

export default MessageMedia;
