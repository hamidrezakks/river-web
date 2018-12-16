import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import {Picker} from 'emoji-mart';
import PopUpMenu from '../PopUpMenu';
import {cloneDeep, throttle} from 'lodash';
import {ClearRounded, DeleteRounded, ForwardRounded, SendRounded, SentimentSatisfiedRounded} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';
import UserAvatar from '../UserAvatar';
import RTLDetector from '../../services/utilities/rtl_detector';
import {IMessage} from '../../repository/message/interface';
import UserName from '../UserName';
import {C_MSG_MODE} from './consts';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import {GroupFlags, InputPeer, PeerType} from '../../services/sdk/messages/core.types_pb';
import GroupRepo from '../../repository/group';

import 'emoji-mart/css/emoji-mart.css';
import './style.css';

interface IProps {
    clearPreviewMessage?: () => void;
    onAction: (cmd: string) => void;
    onBulkAction: (cmd: string) => void;
    onMessage: (text: string, {mode, message}?: any) => void;
    onTyping?: (typing: boolean) => void;
    peer: InputPeer | null;
    previewMessage?: IMessage;
    previewMessageMode?: number;
    ref?: (ref: any) => void;
    selectable: boolean;
    selectableDisable: boolean;
    text?: string;
    userId?: string;
}

interface IState {
    disableAuthority: number;
    emojiAnchorEl: any;
    peer: InputPeer | null;
    previewMessage: IMessage | null;
    previewMessageHeight: number;
    previewMessageMode: number;
    rtl: boolean;
    selectable: boolean;
    selectableDisable: boolean;
    userId: string;
}

class TextInput extends React.Component<IProps, IState> {
    private textarea: any = null;
    private typingThrottle: any = null;
    private typingTimeout: any = null;
    private rtlDetector: RTLDetector;
    private rtlDetectorThrottle: any = null;
    private groupRepo: GroupRepo;

    constructor(props: IProps) {
        super(props);

        this.state = {
            disableAuthority: 0x0,
            emojiAnchorEl: null,
            peer: props.peer,
            previewMessage: props.previewMessage || null,
            previewMessageHeight: 0,
            previewMessageMode: props.previewMessageMode || C_MSG_MODE.Normal,
            rtl: false,
            selectable: props.selectable,
            selectableDisable: props.selectableDisable,
            userId: props.userId || '',
        };

        if (this.props.ref) {
            this.props.ref(this);
        }

        this.rtlDetector = RTLDetector.getInstance();
        this.rtlDetectorThrottle = throttle(this.detectRTL, 1000);

        this.groupRepo = GroupRepo.getInstance();

        this.checkAuthority();
    }

    public componentDidMount() {
        window.addEventListener('Group_DB_Updated', this.checkAuthority);
    }

    public componentWillReceiveProps(newProps: IProps) {
        this.setState({
            previewMessage: newProps.previewMessage || null,
            previewMessageMode: newProps.previewMessageMode || C_MSG_MODE.Normal,
            selectable: newProps.selectable,
            selectableDisable: newProps.selectableDisable,
            userId: newProps.userId || '',
        }, () => {
            this.animatePreviewMessage();
            this.focus('f-textarea');
        });
        if (newProps.previewMessageMode === C_MSG_MODE.Edit && newProps.previewMessage) {
            this.textarea.value = newProps.previewMessage.body;
        }
        if (this.state.peer !== newProps.peer) {
            window.console.log('toh');
            this.setState({
                peer: newProps.peer,
            }, () => {
                this.checkAuthority();
            });
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('Group_DB_Updated', this.checkAuthority);
    }

    public render() {
        const {previewMessage, previewMessageMode, previewMessageHeight, selectable, selectableDisable, disableAuthority} = this.state;

        if (!selectable && disableAuthority !== 0x0) {
            if (disableAuthority === 0x1) {
                return (<div className="input-placeholder">
                    You are no longer in this group
                    <span className="btn"
                          onClick={this.props.onAction.bind(this, 'remove_dialog')}>Delete and Exit</span>
                </div>);
            } else if (disableAuthority === 0x2) {
                return (<div className="input-placeholder">Group is deactivated</div>);
            } else {
                return '';
            }
        } else {
            return (
                <div className="write">
                    {previewMessage && <div className="previews" style={{height: previewMessageHeight + 'px'}}>
                        <div className="preview-container">
                            <div
                                className={'preview-message-wrapper ' + this.getPreviewCN(previewMessageMode, previewMessage.senderid || '')}>
                                <span className="preview-bar"/>
                                {Boolean(previewMessageMode === C_MSG_MODE.Reply) && <div className="preview-message">
                                    <UserName className="preview-message-user" id={previewMessage.senderid || ''}
                                              you={true}/>
                                    <div className="preview-message-body">
                                        <div className={'inner ' + (previewMessage.rtl ? 'rtl' : 'ltr')}
                                        >{previewMessage.body}</div>
                                    </div>
                                </div>}
                                {Boolean(previewMessageMode === C_MSG_MODE.Edit) && <div className="preview-message">
                                    <div className="preview-message-user">Edit message</div>
                                </div>}
                            </div>
                        </div>
                        <div className="preview-clear">
                        <span onClick={this.clearPreviewMessage}>
                            <IconButton aria-label="Delete" className="btn-clear">
                                <ClearRounded/>
                            </IconButton>
                        </span>
                        </div>
                    </div>}
                    {Boolean(!selectable) && <div className="inputs">
                        <div className="user">
                            <UserAvatar id={this.state.userId} className="user-avatar"/>
                        </div>
                        <div className={'input ' + (this.state.rtl ? 'rtl' : 'ltr')}>
                        <Textarea
                            className={'f-textarea'}
                            inputRef={this.textareaRefHandler}
                            maxRows={5}
                            placeholder="Type your message here..."
                            onKeyUp={this.sendMessage}
                            onKeyDown={this.inputKeyDown}
                            style={{direction: (this.state.rtl ? 'rtl' : 'ltr')}}
                        />
                            <div className="write-link">
                                <a href="javascript:;"
                                   className="smiley"
                                   aria-owns="emoji-menu"
                                   aria-haspopup="true"
                                   onClick={this.emojiHandleClick}>
                                    <SentimentSatisfiedRounded/>
                                </a>
                                <PopUpMenu anchorEl={this.state.emojiAnchorEl} onClose={this.emojiHandleClose}>
                                    <Picker custom={[]} onSelect={this.emojiSelect} native={true} showPreview={false}/>
                                </PopUpMenu>
                                <a href="javascript:;" className="send" onClick={this.submitMessage}>
                                    <SendRounded/>
                                </a>
                            </div>
                        </div>
                    </div>}
                    {Boolean(selectable && !previewMessage) && <div className="actions">
                        <div className="left-action">
                            <Tooltip
                                title="Close"
                                placement="top"
                            >
                                <IconButton aria-label="Close" onClick={this.props.onBulkAction.bind(this, 'close')}>
                                    <ClearRounded/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="right-action">
                            <Tooltip
                                title="Remove"
                                placement="top"
                            >
                                <IconButton aria-label="Remove" onClick={this.props.onBulkAction.bind(this, 'remove')}
                                            disabled={selectableDisable}>
                                    <DeleteRounded/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title="Forward"
                                placement="top"
                            >
                                <IconButton aria-label="Forward" onClick={this.props.onBulkAction.bind(this, 'forward')}
                                            disabled={selectableDisable}>
                                    <ForwardRounded/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>}
                </div>
            );
        }
    }

    private getPreviewCN(mode: number, senderid: string) {
        if (mode === C_MSG_MODE.Edit) {
            return 'edit';
        } else if (mode === C_MSG_MODE.Reply && senderid === this.props.userId) {
            return 'reply-you';
        } else if (mode === C_MSG_MODE.Reply && senderid !== this.props.userId) {
            return 'reply';
        }
        return '';
    }

    private submitMessage = () => {
        const {previewMessage, previewMessageMode} = this.state;
        if (this.props.onMessage) {
            if (this.props.onMessage) {
                if (previewMessageMode === C_MSG_MODE.Normal) {
                    this.props.onMessage(this.textarea.value);
                } else if (previewMessageMode !== C_MSG_MODE.Normal) {
                    const message = cloneDeep(previewMessage);
                    this.props.onMessage(this.textarea.value, {
                        message,
                        mode: previewMessageMode,
                    });
                    this.clearPreviewMessage();
                }
            }
        }
        this.textarea.value = '';
        this.setState({
            emojiAnchorEl: null,
        });
        if (this.props.onTyping && this.state.previewMessageMode !== C_MSG_MODE.Edit) {
            this.props.onTyping(false);
            if (this.typingThrottle !== null) {
                this.typingThrottle.cancel();
            }
            this.typingThrottle = null;
        }
    }

    private sendMessage = (e: any) => {
        const {previewMessage, previewMessageMode} = this.state;
        this.rtlDetectorThrottle(e.target.value);
        if (e.key === 'Enter' && !e.shiftKey) {
            if (this.props.onMessage) {
                if (previewMessageMode === C_MSG_MODE.Normal) {
                    this.props.onMessage(e.target.value);
                } else if (previewMessageMode !== C_MSG_MODE.Normal) {
                    const message = cloneDeep(previewMessage);
                    this.props.onMessage(e.target.value, {
                        message,
                        mode: previewMessageMode,
                    });
                    this.clearPreviewMessage();
                }
            }
            e.target.value = '';
            this.setState({
                emojiAnchorEl: null,
            });
        }
        if (this.props.onTyping && this.state.previewMessageMode !== C_MSG_MODE.Edit) {
            if (e.target.value.length === 0) {
                this.props.onTyping(false);
                if (this.typingThrottle !== null) {
                    this.typingThrottle.cancel();
                }
                this.typingThrottle = null;
            } else {
                if (this.typingThrottle === null) {
                    this.typingThrottle = throttle(() => {
                        if (this.props.onTyping) {
                            this.props.onTyping(true);
                        } else {
                            if (this.typingThrottle !== null) {
                                this.typingThrottle.cancel();
                            }
                        }
                    }, 5000);
                } else {
                    this.typingThrottle();
                    clearTimeout(this.typingTimeout);
                    this.typingTimeout = setTimeout(() => {
                        if (this.typingThrottle !== null) {
                            this.typingThrottle.cancel();
                        }
                        if (this.props.onTyping) {
                            this.props.onTyping(false);
                        }
                    }, 5000);
                }
            }
        }
    }

    private textareaRefHandler = (value: any) => {
        this.textarea = value;
    }

    private inputKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    private emojiHandleClick = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            emojiAnchorEl: event.currentTarget,
        });
    }

    private emojiSelect = (data: any) => {
        this.textarea.value += data.native;
    }

    private emojiHandleClose = () => {
        this.setState({
            emojiAnchorEl: null,
        });
    }

    private detectRTL = (text: string) => {
        const rtl = this.rtlDetector.direction(text);
        this.setState({
            rtl,
        });
    }

    private clearPreviewMessage = () => {
        this.setState({
            previewMessageHeight: 0,
        });
        setTimeout(() => {
            this.setState({
                previewMessage: null,
                previewMessageMode: C_MSG_MODE.Normal,
            });
            if (this.props.clearPreviewMessage) {
                this.props.clearPreviewMessage();
            }
        }, 102);
    }

    private animatePreviewMessage() {
        setTimeout(() => {
            const el = document.querySelector('.write .previews .preview-message-wrapper');
            if (el && this.state.previewMessage) {
                const targetEl = document.querySelector('.write .previews');
                if (targetEl) {
                    this.setState({
                        previewMessageHeight: (el.clientHeight + 8)
                    });
                } else {
                    this.setState({
                        previewMessageHeight: 0,
                    });
                }
            } else {
                this.setState({
                    previewMessageHeight: 0,
                });
            }
        }, 50);
    }

    private focus(className: string) {
        const elem: any = document.querySelector('.' + className);
        if (elem) {
            elem.focus();
        }
    }

    /* Check authority for composing message and etc. */
    private checkAuthority = (data?: any) => {
        const {peer} = this.state;
        if (!peer) {
            return;
        }
        if (data && data.detail.ids.indexOf(peer.getId()) === -1) {
            return;
        }
        if (peer.getType() === PeerType.PEERGROUP) {
            this.groupRepo.get(peer.getId() || '').then((res) => {
                if (res.flagsList.indexOf(GroupFlags.GROUPFLAGSNONPARTICIPANT) > -1) {
                    this.setState({
                        disableAuthority: 0x1,
                    });
                } else if (res.flagsList.indexOf(GroupFlags.GROUPFLAGSDEACTIVATED) > -1) {
                    this.setState({
                        disableAuthority: 0x2,
                    });
                } else {
                    this.setState({
                        disableAuthority: 0x0,
                    });
                }
            });
        } else {
            this.setState({
                disableAuthority: 0x0,
            });
        }
    }
}

export default TextInput;
