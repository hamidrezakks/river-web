/*
    Creation Time: 2019 - Jan - 22
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2019
*/

import * as React from 'react';
import AudioPlayer, {IAudioEvent, IAudioInfo, IPlaylistItem} from '../../services/audioPlayer';
import {
    CloseRounded,
    PauseRounded,
    PlayArrowRounded,
    SlowMotionVideoRounded,
    SkipNextRounded,
    SkipPreviousRounded, MusicNoteRounded,
    BarChartRounded,
} from '@material-ui/icons';
import UserName from '../UserName';
import {Link} from 'react-router-dom';
import {IMediaInfo} from '../MessageMedia';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import Scrollbars from 'react-custom-scrollbars';
import CachedPhoto from '../CachedPhoto';
import {getDuration} from '../PeerMedia';
import Slider from '@material-ui/lab/Slider';
import DownloadProgress from '../DownloadProgress';
import {findIndex} from 'lodash';

import './style.css';

const C_CELL_HEIGHT = 54;
const C_MAX_LIST_HEIGHT = 288;

interface IProps {
    className?: string;
    onVisible: (visible: boolean) => void;
    onAction?: (cmd: 'cancel' | 'download' | 'cancel_download' | 'view' | 'open', messageId: number) => void;
}

interface IState {
    className: string;
    fast: boolean;
    isVoice: boolean;
    mediaInfo?: IMediaInfo;
    messageId: number;
    openPlaylist: boolean;
    peerId: string;
    playState: 'play' | 'pause' | 'seek_play' | 'seek_pause';
    playlist: IPlaylistItem[];
    seekProgress: number;
    userId: string;
}

class AudioPlayerShell extends React.Component<IProps, IState> {
    private scrollbarRef: Scrollbars;
    private audioPlayer: AudioPlayer;
    private eventReferences: any[] = [];
    private shellRef: any = null;
    private messageId: number = 0;
    private open: boolean = false;
    // @ts-ignore
    private progressRef: any = null;

    constructor(props: IProps) {
        super(props);

        this.state = {
            className: props.className || '',
            fast: false,
            isVoice: true,
            messageId: 0,
            openPlaylist: false,
            peerId: '',
            playState: 'pause',
            playlist: [],
            seekProgress: 0,
            userId: '',
        };

        this.audioPlayer = AudioPlayer.getInstance();
    }

    public componentDidMount() {
        this.eventReferences.push(this.audioPlayer.globalListen(this.audioProgressHandler));
    }

    public componentWillUnmount() {
        this.eventReferences.forEach((canceller) => {
            if (typeof canceller === 'function') {
                canceller();
            }
        });
    }

    public render() {
        const {className, isVoice} = this.state;
        return (
            <div ref={this.shellRefHandler}
                 className={'audio-player-shell ' + (!isVoice ? 'is-music ' : '') + className}>
                {this.getView()}
                <div ref={this.progressRefHandler} className="shell-progress"/>
            </div>
        );
    }

    private shellRefHandler = (ref: any) => {
        this.shellRef = ref;
    }

    private progressRefHandler = (ref: any) => {
        this.progressRef = ref;
    }

    private getView() {
        const {fast, isVoice, messageId, mediaInfo, peerId, playState, userId} = this.state;
        if (isVoice) {
            return (
                <div className="shell">
                    <div className="audio-player-play-action">
                        {Boolean(playState === 'pause' || playState === 'seek_pause') &&
                        <PlayArrowRounded onClick={this.playHandler}/>}
                        {Boolean(playState === 'play' || playState === 'seek_play') &&
                        <PauseRounded onClick={this.pauseHandler}/>}
                    </div>
                    <div className="audio-player-content">
                        {Boolean(userId !== '') && <div className="audio-player-anchor">
                            <Link to={`/chat/${peerId}/${messageId}`}>
                                Playing from: <UserName className="user" id={userId} unsafe={true} noDetail={true}/>
                            </Link>
                        </div>}
                    </div>
                    <div className="audio-player-action">
                        <SlowMotionVideoRounded className={(fast ? 'enable' : '')} onClick={this.fastToggleHandler}/>
                        <CloseRounded className="action" onClick={this.cancelHandler}/>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="shell">
                    <div className="audio-player-play-action">
                        <SkipPreviousRounded onClick={this.prevHandler}/>
                        <div className="play-action">
                            {Boolean(playState === 'pause' || playState === 'seek_pause') &&
                            <PlayArrowRounded onClick={this.playHandler}/>}
                            {Boolean(playState === 'play' || playState === 'seek_play') &&
                            <PauseRounded onClick={this.pauseHandler}/>}
                        </div>
                        <SkipNextRounded onClick={this.nextHandler}/>
                    </div>
                    <div className="audio-player-content">
                        {mediaInfo && <div className="audio-player-info" onClick={this.openPlaylistHandler}>
                            <div className="audio-title">{mediaInfo.title}</div>
                            <div className="audio-performer">{mediaInfo.performer}</div>
                        </div>}
                        {this.getPlaylistRenderer()}
                    </div>
                    <div className="audio-player-action">
                        <CloseRounded className="action" onClick={this.cancelHandler}/>
                    </div>
                </div>
            );
        }
    }

    // @ts-ignore
    private getPlaylistRenderer() {
        const {openPlaylist, mediaInfo, playlist, seekProgress, playState} = this.state;
        return (
            <ClickAwayListener onClickAway={this.clickAwayHandler}>
                <div>
                    {openPlaylist && <div className="playlist-menu">
                        {mediaInfo && <div className="song-details">
                            <div className="song-cover">
                                {mediaInfo.thumbFile.fileid !== '' &&
                                <CachedPhoto className="picture" fileLocation={mediaInfo.thumbFile}/>}
                                {mediaInfo.thumbFile.fileid === '' && <div className="picture">
                                    <MusicNoteRounded/>
                                </div>}
                            </div>
                            <div className="song-info">
                                <div className="info title">{mediaInfo.title}</div>
                                <div className="info performer">{mediaInfo.performer}</div>
                                <div className="info album">{mediaInfo.album}</div>
                            </div>
                        </div>}
                        {mediaInfo && <div className="playlist-controls-container">
                            <div className="playlist-seek">
                                <div
                                    className="time left">{getDuration(Math.floor((mediaInfo.duration || 0) * ((seekProgress || 0) / 100)))}</div>
                                <div className="seek">
                                    <Slider
                                        value={seekProgress}
                                        aria-labelledby="label"
                                        onChange={this.seekChangeHandler}
                                    />
                                </div>
                                <div className="time right">{getDuration(mediaInfo.duration || 0)}</div>
                            </div>
                            <div className="playlist-controls">
                                <SkipPreviousRounded onClick={this.prevHandler}/>
                                <div className="play-action">
                                    {Boolean(playState === 'pause' || playState === 'seek_pause') &&
                                    <PlayArrowRounded onClick={this.playHandler}/>}
                                    {Boolean(playState === 'play' || playState === 'seek_play') &&
                                    <PauseRounded onClick={this.pauseHandler}/>}
                                </div>
                                <SkipNextRounded onClick={this.nextHandler}/>
                            </div>
                        </div>}
                        <div className="playlist">
                            <Scrollbars
                                ref={this.scrollbarRefHandler}
                                autoHide={true}
                                autoHeight={true}
                                autoHeightMin={this.getPlaylistHeight()}
                            >
                                {playlist.map((item) => {
                                    if (item) {
                                        return (<div key={item.id}
                                                     className={'playlist-item' + (!item.downloaded ? ' download' : '')}>
                                            <div className="playlist-avatar"
                                                 onClick={this.playHandlerById.bind(this, item.id)}>
                                                {item.music.thumbFile.fileid !== '' &&
                                                <CachedPhoto className="picture" fileLocation={item.music.thumbFile}/>}
                                                {item.music.thumbFile.fileid === '' && <div className="picture">
                                                    <MusicNoteRounded/>
                                                </div>}
                                                {!Boolean(item.event.state === 'play' || item.event.state === 'seek_play') &&
                                                <div className="playlist-action">
                                                    <PlayArrowRounded/>
                                                </div>}
                                                {Boolean(item.event.state === 'play' || item.event.state === 'seek_play') &&
                                                <div className="playlist-action playing">
                                                    <PauseRounded className="play"/>
                                                    <BarChartRounded className="bars"/>
                                                </div>}
                                            </div>
                                            <div className="playlist-info">
                                                <div className="title">{item.music.title}</div>
                                                <div className="details">
                                                    <span className="block">{item.music.performer}</span>
                                                    <span className="bull"/>
                                                    <span
                                                        className="block">{getDuration(item.music.duration || 0)}</span>
                                                </div>
                                            </div>
                                            {!item.downloaded &&
                                            <DownloadProgress className="playlist-download-action" id={item.id}
                                                              fileSize={item.music.size}
                                                              onComplete={this.downloadCompleteHandler}
                                                              hideSizeIndicator={true} onAction={this.props.onAction}/>}
                                        </div>);
                                    } else {
                                        return ('');
                                    }
                                })}
                            </Scrollbars>
                        </div>
                    </div>}
                </div>
            </ClickAwayListener>
        );
    }

    private scrollbarRefHandler = (ref: any) => {
        this.scrollbarRef = ref;
    }

    private getPlaylistHeight = () => {
        const {playlist} = this.state;
        const height = C_CELL_HEIGHT * playlist.length;
        return Math.min(Math.max(height, 48), C_MAX_LIST_HEIGHT);
    }

    private playHandler = () => {
        this.setState({
            playState: 'play',
        });
        this.audioPlayer.play(this.messageId);
    }

    private pauseHandler = () => {
        this.setState({
            playState: 'pause',
        });
        this.audioPlayer.pause(this.messageId);
    }

    private cancelHandler = () => {
        this.openPlayer(false);
        if (this.state.playState === 'play') {
            this.audioPlayer.pause(this.messageId);
        }
        this.setState({
            openPlaylist: false,
        });
    }

    private fastToggleHandler = () => {
        this.setState({
            fast: !this.state.fast,
        }, () => {
            this.audioPlayer.fast(this.state.fast);
        });
    }

    private openPlayer(open?: boolean) {
        if (!this.shellRef) {
            return;
        }
        if (open === undefined) {
            this.shellRef.classList.toggle('open');
            this.open = !this.open;
        } else {
            if (open && !this.open) {
                this.shellRef.classList.add('open');
                this.open = true;
            } else if (!open && this.open) {
                this.shellRef.classList.remove('open');
                this.open = false;
            }
        }
        this.props.onVisible(this.open);
    }

    private setPlayState(e: IAudioEvent) {
        if (e.state === 'play' || e.state === 'seek_play') {
            this.openPlayer(true);
        }
        if (this.state.playState !== e.state) {
            this.setState({
                playState: e.state,
            });
        }
    }

    private audioProgressHandler = (info: IAudioInfo, e: IAudioEvent, mediaInfo?: IMediaInfo) => {
        this.messageId = info.messageId;
        if (info.userId !== '' && this.state.userId !== info.userId) {
            this.setState({
                isVoice: !e.music,
                userId: info.userId,
            });
        }
        if (info.peerId !== '' && this.state.peerId !== info.peerId) {
            this.setState({
                isVoice: !e.music,
                peerId: info.peerId,
            });
        }
        if (info.messageId !== 0 && this.state.messageId !== info.messageId) {
            this.setState({
                isVoice: !e.music,
                messageId: info.messageId,
            });
        }
        if (this.state.fast !== info.fast) {
            this.setState({
                fast: info.fast,
                isVoice: !e.music,
            });
        }
        if (mediaInfo) {
            this.setState({
                mediaInfo,
            });
        }
        this.setPlayState(e);
        if (this.progressRef) {
            const progress = e.progress * 100;
            this.progressRef.style.width = `${progress}%`;
            this.setState({
                seekProgress: progress,
            });
            if (e.state === 'seek_play' || e.state === 'seek_pause' || e.state === 'pause') {
                this.progressRef.classList.remove('with-transition');
            } else {
                this.progressRef.classList.add('with-transition');
            }
        }
    }

    private prevHandler = () => {
        this.audioPlayer.prev();
    }

    private nextHandler = () => {
        this.audioPlayer.next();
    }

    private openPlaylistHandler = () => {
        this.setState({
            openPlaylist: true,
        }, () => {
            if (this.state.openPlaylist) {
                this.setState({
                    playlist: this.audioPlayer.getMusicPlayList(),
                }, () => {
                    const {playlist} = this.state;
                    const currentTrack = this.audioPlayer.getCurrentTrack();
                    const index = findIndex(playlist, {id: currentTrack});
                    if (index > -1) {
                        let pos = C_CELL_HEIGHT * index;
                        if (pos > (C_MAX_LIST_HEIGHT - C_CELL_HEIGHT)) {
                            pos -= (C_MAX_LIST_HEIGHT - C_CELL_HEIGHT);
                            this.scrollbarRef.scrollTop(pos);
                        }
                    }
                });
            }
        });
    }

    private clickAwayHandler = () => {
        this.setState({
            openPlaylist: false,
        });
    }

    private playHandlerById = (id: number) => {
        if (this.audioPlayer.isPlaying(id)) {
            this.audioPlayer.pause(id);
        } else {
            this.audioPlayer.play(id);
        }
    }

    private seekChangeHandler = (e: any, value: number) => {
        this.setState({
            seekProgress: value,
        });
        this.audioPlayer.seekTo(this.messageId, value / 100);
    }

    private downloadCompleteHandler = (id: number) => {
        const {playlist} = this.state;
        const index = findIndex(playlist, {id});
        if (index > -1) {
            playlist[index].downloaded = true;
            this.setState({
                playlist,
            });
        }
    }
}

export default AudioPlayerShell;
