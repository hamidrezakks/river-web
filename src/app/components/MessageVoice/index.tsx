/*
    Creation Time: 2019 - Jan - 13
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2019
*/

import * as React from 'react';
import {IMessage} from '../../repository/message/interface';
import {InputPeer} from '../../services/sdk/messages/core.types_pb';
import VoicePlayer, {getVoiceInfo} from '../VoicePlayer';
import {MediaDocument} from '../../services/sdk/messages/chat.messages.medias_pb';

import './style.scss';
import {GetDbFileName} from "../../repository/file";

interface IProps {
    message: IMessage;
    peer: InputPeer | null;
    onAction?: (cmd: 'cancel' | 'download' | 'cancel_download' | 'open' | 'read', message: IMessage) => void;
}

interface IState {
    message: IMessage;
}

class MessageVoice extends React.Component<IProps, IState> {
    private voicePlayerRef: VoicePlayer | undefined;
    private lastId: number = 0;
    private dbFileName: string = '';
    private downloaded: boolean = false;
    private contentRead: boolean = false;

    constructor(props: IProps) {
        super(props);

        this.state = {
            message: props.message,
        };

        if (props.message) {
            this.lastId = props.message.id || 0;
            this.downloaded = props.message.downloaded || false;
            this.contentRead = props.message.contentread || false;
        }
    }

    public componentDidMount() {
        const {message} = this.state;
        const info = getVoiceInfo(message);
        if (this.voicePlayerRef) {
            this.voicePlayerRef.setData({
                bars: info.bars,
                duration: info.duration,
                fileName: info.fileName,
                state: this.getVoiceState(message),
            });
        }
    }

    public UNSAFE_componentWillReceiveProps(newProps: IProps) {
        const {message} = this.state;
        const messageMediaDocument: MediaDocument.AsObject = newProps.message.mediadata;
        if ((newProps.message && this.lastId !== newProps.message.id) || (messageMediaDocument && messageMediaDocument.doc && GetDbFileName(messageMediaDocument.doc.id, messageMediaDocument.doc.clusterid) !== this.dbFileName)) {
            const info = getVoiceInfo(message);
            this.lastId = newProps.message.id || 0;
            this.dbFileName = info.fileName || '';
            this.setState({
                message: newProps.message,
            }, () => {
                if (this.voicePlayerRef) {
                    this.voicePlayerRef.setData({
                        bars: info.bars,
                        duration: info.duration,
                        fileName: info.fileName,
                        state: this.getVoiceState(message),
                    });
                }
            });
        }
        if ((newProps.message.downloaded || false) !== this.downloaded) {
            this.downloaded = (newProps.message.downloaded || false);
            if (this.voicePlayerRef) {
                this.voicePlayerRef.setVoiceState(this.getVoiceState(newProps.message));
            }
        }
        if ((newProps.message.contentread || false) !== this.contentRead) {
            this.contentRead = (newProps.message.contentread || false);
            this.setState({
                message: newProps.message,
            });
        }
    }

    public render() {
        const {message} = this.state;
        return (
            <div className="message-voice">
                <VoicePlayer ref={this.voicePlayerRefHandler} className="play-frame"
                             max={16.0} message={this.state.message} onAction={this.actionHandler}/>
                {!message.contentread && <span className="unread-bullet"/>}
            </div>
        );
    }

    /* Voice Player ref handler */
    private voicePlayerRefHandler = (ref: any) => {
        if (!ref) {
            return;
        }
        this.voicePlayerRef = ref;
    }

    /* Get voice state for player */
    private getVoiceState(message: IMessage) {
        const id = message.id || 0;
        if (id <= 0) {
            return 'progress';
        } else if (id > 0 && !message.downloaded) {
            return 'download';
        } else {
            return 'pause';
        }
    }

    /* Voice action handler */
    private actionHandler = (cmd: 'cancel' | 'download' | 'cancel_download' | 'play') => {
        if (this.props.onAction) {
            if (cmd === 'play') {
                if (!this.state.message.contentread) {
                    this.props.onAction('read', this.state.message);
                }
            } else {
                this.props.onAction(cmd, this.state.message);
                if (this.voicePlayerRef) {
                    if (cmd === 'download') {
                        this.voicePlayerRef.setVoiceState('progress');
                    } else if (cmd === 'cancel_download') {
                        this.voicePlayerRef.setVoiceState('download');
                    }
                }
            }
        }
    }
}

export default MessageVoice;
