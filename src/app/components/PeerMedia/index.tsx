/*
    Creation Time: 2019 - Feb - 19
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2019
*/

import * as React from 'react';
import MediaRepo from '../../repository/media';
import {InputPeer} from '../../services/sdk/messages/chat.core.types_pb';
import {getMediaInfo, IMediaInfo} from '../MessageMedia';
import CachedPhoto from '../CachedPhoto';
import {
    PlayCircleFilledRounded,
    InsertDriveFileTwoTone,
    HeadsetTwoTone,
    KeyboardVoiceTwoTone,
    PlayArrowRounded,
    PauseRounded,
} from '@material-ui/icons';
import {C_MESSAGE_TYPE} from '../../repository/message/consts';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {C_MEDIA_TYPE} from '../../repository/media/interface';
import DocumentViewerService, {IDocument} from '../../services/documentViewerService';
import Scrollbars from 'react-custom-scrollbars';
import {getFileExtension, getHumanReadableSize} from '../MessageFile';
import DownloadProgress from '../DownloadProgress';
import {IMessage} from '../../repository/message/interface';
import AudioPlayer, {IAudioEvent, IAudioInfo} from '../../services/audioPlayer';

import './style.css';

interface IMedia {
    _modified?: boolean;
    download: boolean;
    id: number;
    info: IMediaInfo;
    peerId: string;
    playing?: boolean;
    saved: boolean;
    type: number;
    userId: string;
}

interface IProps {
    className?: string;
    full: boolean;
    onAction?: (cmd: 'cancel' | 'download' | 'cancel_download' | 'view' | 'open', messageId: number) => void;
    onMore?: () => void;
    peer: InputPeer;
}

interface IState {
    className: string;
    items: IMedia[];
    loading: boolean;
    tab: number;
}

class PeerMedia extends React.Component<IProps, IState> {
    private eventReferences: any[] = [];
    private peerId: string = '';
    private mediaRepo: MediaRepo;
    private documentViewerService: DocumentViewerService;
    private itemMap: { [key: number]: number } = {};
    private audioPlayer: AudioPlayer;

    constructor(props: IProps) {
        super(props);

        this.state = {
            className: props.className || '',
            items: [],
            loading: true,
            tab: 0,
        };

        this.peerId = props.peer.getId() || '';
        this.mediaRepo = MediaRepo.getInstance();
        this.documentViewerService = DocumentViewerService.getInstance();
        this.audioPlayer = AudioPlayer.getInstance();
    }

    public componentDidMount() {
        this.getMedias();
        window.addEventListener('File_Downloaded', this.fileDownloadedHandler);
        window.addEventListener('Message_DB_Added', this.messageDBUpdatedHandler);
        this.eventReferences.push(this.audioPlayer.globalListen(this.audioPlayerHandler));
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (this.peerId !== (newProps.peer.getId() || '')) {
            this.peerId = newProps.peer.getId() || '';
            this.getMedias();
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('File_Downloaded', this.fileDownloadedHandler);
        window.removeEventListener('Message_DB_Added', this.messageDBUpdatedHandler);
        this.removeAllListeners();
    }

    public render() {
        const {className, tab, items} = this.state;
        return (
            <div className={`peer-media ${(this.props.full ? ' full' : '')} ${className}`}>
                {!this.props.full && <div className="peer-media-title">
                    <span className="peer-label">Shared Media</span>
                    {Boolean(items.length > 0) && <span className="more" onClick={this.props.onMore}>Show All</span>}
                </div>}
                {this.props.full && <div className="peer-media-tab">
                    <Tabs indicatorColor="primary" textColor="primary" fullWidth={true} centered={true} value={tab}
                          onChange={this.tabChangeHandler}>
                        <Tab label="Photo & Video"/>
                        <Tab label="Audio"/>
                        <Tab label="File"/>
                    </Tabs>
                </div>}
                <div className="peer-media-container">
                    {this.getContent()}
                </div>
            </div>
        );
    }

    /* Get media list content */
    private getContent() {
        const {items, tab, loading} = this.state;
        if (loading) {
            return (<div className="media-loading">Loading</div>);
        }
        if (!this.props.full) {
            if (items.length > 0) {
                return this.getGridView();
            } else {
                return (<div className="media-placeholder"><span>No Shared Media Here!</span></div>);
            }
        } else {
            switch (tab) {
                default:
                case 0:
                    if (items.length > 0) {
                        return (
                            <Scrollbars
                                autoHide={true}
                            >
                                {this.getGridView()}
                            </Scrollbars>
                        );
                    } else {
                        return (<div className="media-placeholder"><span>No Photo/Video Here!</span></div>);
                    }
                case 1:
                case 2:
                    if (items.length > 0) {
                        return (
                            <Scrollbars
                                autoHide={true}
                            >
                                {this.getListView()}
                            </Scrollbars>
                        );
                    } else {
                        if (tab === 1) {
                            return (<div className="media-placeholder"><span>No Audio Here!</span></div>);
                        } else if (tab === 2) {
                            return (<div className="media-placeholder"><span>No File Here!</span></div>);
                        } else {
                            return (<div className="media-placeholder"><span>No Shared Media Here!</span></div>);
                        }
                    }
            }
        }
    }

    /* Get grid view */
    private getGridView() {
        const {items} = this.state;
        return (
            <div className="media-grid-view">
                {items.map((item, i) => {
                    return (
                        <div key={item.id} className={`media-item item_${item.id}`}
                             onClick={this.showMediaHandler.bind(this, i)}>
                            {this.getFileIcon(item)}
                            {Boolean(item.type === C_MESSAGE_TYPE.Video) &&
                            <div className="video-icon">
                                <PlayCircleFilledRounded/>
                            </div>}
                            {Boolean(item.type === C_MESSAGE_TYPE.Video || item.type === C_MESSAGE_TYPE.Music || item.type === C_MESSAGE_TYPE.Voice) &&
                            <div className="media-duration">{this.getDuration(item.info.duration || 0)}</div>}
                        </div>
                    );
                })}
            </div>
        );
    }

    /* Get list view */
    private getListView() {
        const {items} = this.state;
        return (
            <div className="media-list-view">
                {items.map((item, i) => {
                    return (
                        <div key={item.id} className={`media-item item_${item.id}`}
                             onClick={this.showMediaHandler.bind(this, i)}>
                            {this.getFileIcon(item)}
                            <div className="media-item-info">
                                <div
                                    className="media-name">{item.type === C_MESSAGE_TYPE.Voice ? 'Voice' : item.info.fileName}</div>
                                {!(item.type === C_MESSAGE_TYPE.Voice || item.type === C_MESSAGE_TYPE.Music) &&
                                <div className="media-size">{getHumanReadableSize(item.info.size)}</div>}
                                {(item.type === C_MESSAGE_TYPE.Voice || item.type === C_MESSAGE_TYPE.Music) &&
                                <div className="media-size">{this.getDuration(item.info.duration || 0)}</div>}
                            </div>
                            {this.getMediaAction(item)}
                        </div>
                    );
                })}
            </div>
        );
    }

    /* Get file icon */
    private getFileIcon(item: IMedia) {
        if (item.info.thumbFile.fileid !== '') {
            return (<CachedPhoto className="picture" fileLocation={item.info.thumbFile}
                                 blur={item.download ? 0 : 10}/>);
        } else {
            switch (item.type) {
                default:
                case C_MESSAGE_TYPE.File:
                    return (
                        <div className="file-icon">
                            <InsertDriveFileTwoTone/>
                            <span className="file-extension">{getFileExtension(item.info.type)}</span>
                        </div>);
                case C_MESSAGE_TYPE.Music:
                    return (
                        <div className="file-icon music">
                            <HeadsetTwoTone/>
                        </div>);
                case C_MESSAGE_TYPE.Voice:
                    return (
                        <div className="file-icon voice">
                            <KeyboardVoiceTwoTone/>
                        </div>);
            }
        }
    }

    /* Get media from repository */
    private getMedias() {
        this.setState({
            loading: true,
        });
        let mediaType = C_MEDIA_TYPE.Media;
        switch (this.state.tab) {
            case 0:
                mediaType = C_MEDIA_TYPE.Media;
                break;
            case 1:
                mediaType = C_MEDIA_TYPE.Music;
                break;
            case 2:
                mediaType = C_MEDIA_TYPE.FILE;
                break;
        }
        this.mediaRepo.getMany({
            limit: this.props.full ? 128 : 8,
            type: this.props.full ? mediaType : undefined,
        }, this.peerId).then((result) => {
            if (!this.props.full) {
                result = result.slice(0, 4);
            }
            this.setState({
                items: this.modifyMediaList(result),
                loading: false,
            });
        });
    }

    /* Get duration with time format */
    private getDuration(duration: number) {
        let sec = String(duration % 60);
        if (sec.length === 1) {
            sec = '0' + sec;
        }
        return `${Math.floor(duration / 60)}:${sec}`;
    }

    /* Tab change handler */
    private tabChangeHandler = (e: any, tab: number) => {
        this.setState({
            tab,
        }, () => {
            this.getMedias();
        });
    }

    /* Show media handler */
    private showMediaHandler = (i: number, e: any) => {
        try {
            const {items} = this.state;
            const item = items[i];
            if (!(item.type === C_MESSAGE_TYPE.Picture || item.type === C_MESSAGE_TYPE.Video)) {
                return;
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            const doc: IDocument = {
                anchor: this.props.full ? 'shared_media_full' : 'shared_media',
                items: [{
                    caption: item.info.caption,
                    downloaded: item.download,
                    fileLocation: item.info.file,
                    fileSize: item.info.size,
                    height: item.info.height,
                    id: item.id || 0,
                    thumbFileLocation: item.info.thumbFile,
                    width: item.info.width,
                }],
                peerId: item.peerId || '',
                rect: (e.currentTarget || e).getBoundingClientRect(),
                type: item.type === C_MESSAGE_TYPE.Picture ? 'picture' : 'video',
            };
            this.documentViewerService.loadDocument(doc);
        } catch (e) {
            window.console.log(e);
        }
    }

    /* File downloaded handler */
    private fileDownloadedHandler = (data: any) => {
        if (!data.detail.id) {
            return;
        }
        const id = data.detail.id;
        if (!this.itemMap.hasOwnProperty(id)) {
            return;
        }
        const {items} = this.state;
        const index = this.itemMap[id];
        items[index].download = true;
        this.setState({
            items,
        });
    }

    /* Get media action */
    private getMediaAction(item: IMedia) {
        const {tab} = this.state;
        if (!item.download) {
            return (
                <DownloadProgress className="media-item-action" id={item.id}
                                  fileSize={item.info.size}
                                  hideSizeIndicator={true} onAction={this.props.onAction}/>);
        } else {
            switch (tab) {
                case 1:
                    return (<div className="media-item-action">
                        <div className="audio-action" onClick={this.audioActionClickHandler.bind(this, item.id)}>
                            {!item.playing && <PlayArrowRounded/>}
                            {item.playing && <PauseRounded/>}
                        </div>
                    </div>);
                case 2:
                default:
                    if (!item.saved) {
                        return (<div className="media-file-action">
                            <span onClick={this.mediaActionClickHandler.bind(this, item.id, 'view')}>SAVE</span>
                        </div>);
                    } else {
                        return (<div className="media-file-action">
                            <span onClick={this.mediaActionClickHandler.bind(this, item.id, 'open')}>OPEN</span>
                        </div>);
                    }
            }
        }
    }

    private mediaActionClickHandler = (id: number, cmd: 'view' | 'open') => {
        if (this.props.onAction) {
            this.props.onAction(cmd, id);
        }
    }

    /* Message repo updated handler */
    private messageDBUpdatedHandler = (event: any) => {
        const data = event.detail;
        if (data.peerids && data.peerids.indexOf(this.props.peer.getId() || '') > -1) {
            setTimeout(() => {
                this.loadMediaList(false, 32);
            }, 600);
        }
    }

    /* Update media list */
    private loadMediaList(append: boolean, limit: number) {
        this.setState({
            loading: true,
        });
        let {items} = this.state;
        let breakPoint = 0;
        if (items.length > 0) {
            if (append) {
                breakPoint = items[items.length - 1].id - 1;
            } else {
                breakPoint = items[0].id + 1;
            }
        }
        let mediaType;
        if (this.props.full) {
            switch (this.state.tab) {
                case 0:
                    mediaType = C_MEDIA_TYPE.Media;
                    break;
                case 1:
                    mediaType = C_MEDIA_TYPE.Music;
                    break;
                case 2:
                    mediaType = C_MEDIA_TYPE.FILE;
                    break;
            }
        }
        this.mediaRepo.getMany({
            after: !append ? breakPoint : undefined,
            before: append ? breakPoint : undefined,
            limit,
            type: mediaType,
        }, this.peerId).then((result) => {
            if (result.length === 0) {
                this.setState({
                    loading: false,
                });
                return;
            }
            if (append) {
                items.push.apply(items, result);
            } else {
                items.unshift.apply(items, result);
            }
            if (!this.props.full) {
                items = items.slice(0, 4);
            }
            this.setState({
                items: this.modifyMediaList(items),
                loading: false,
            });
        });
    }

    /* Modify media list */
    private modifyMediaList(list: Array<IMessage | IMedia>): IMedia[] {
        const items: IMedia[] = [];
        this.itemMap = {};
        list.forEach((item, index) => {
            // @ts-ignore
            if (item._modified) {
                // @ts-ignore
                items.push(item);
            } else {
                item = item as IMessage;
                items.push({
                    _modified: true,
                    download: item.downloaded || false,
                    id: item.id || 0,
                    info: getMediaInfo(item),
                    peerId: item.peerid || '',
                    saved: item.saved || false,
                    type: item.messagetype || C_MESSAGE_TYPE.Normal,
                    userId: item.senderid || '',
                });
            }
            this.itemMap[item.id || 0] = index;
        });
        return items;
    }

    /* Audio player handler */
    private audioPlayerHandler = (info: IAudioInfo, e: IAudioEvent) => {
        if (info.peerId !== this.peerId || !this.itemMap.hasOwnProperty(info.messageId)) {
            return;
        }
        const index = this.itemMap[info.messageId];
        const {items} = this.state;
        if ((e.state === 'play' || e.state === 'seek_play') && !items[index].playing) {
            items[index].playing = true;
            this.setState({
                items,
            });
        } else if ((e.state === 'pause' || e.state === 'seek_pause') && items[index].playing) {
            items[index].playing = false;
            this.setState({
                items,
            });
        }
    }

    /* Audio action click handler */
    private audioActionClickHandler = (id: number) => {
        if (!this.itemMap.hasOwnProperty(id)) {
            return;
        }
        const index = this.itemMap[id];
        const {items} = this.state;
        const item = items[index];
        if (!items[index].playing) {
            this.audioPlayer.addToPlaylist(id, this.peerId, item.info.file.fileid || '', item.userId, true);
            this.audioPlayer.play(id);
        } else {
            this.audioPlayer.pause(id);
        }
    }

    /* Remove all listeners */
    private removeAllListeners() {
        this.eventReferences.forEach((canceller) => {
            if (typeof canceller === 'function') {
                canceller();
            }
        });
    }

}


export default PeerMedia;