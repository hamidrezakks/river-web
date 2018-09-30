import * as React from 'react';
import Dialog from '../../components/Dialog/index';
import {IMessage} from '../../repository/message/interface';
import Message from '../../components/Message/index';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Attachment, MoreVert as MoreVertIcon} from '@material-ui/icons';
// import * as faker from 'faker';
import MessageRepo from '../../repository/message/index';
import DialogRepo from '../../repository/dialog/index';
import UniqueId from '../../services/uniqueId/index';
import Uploader from '../../components/Uploader/index';
import TextInput from '../../components/TextInput/index';
import {trimStart} from 'lodash';
import SDK from '../../services/sdk/index';

import './style.css';
import NewMessage from "../../components/NewMessage";
import {InputPeer, PeerType, PhoneContact} from "../../services/sdk/messages/core.types_pb";
import {IConnInfo} from "../../services/sdk/interface";
import {IDialog} from "../../repository/dialog/interface";

interface IProps {
    match?: any;
    location?: any;
}

interface IState {
    anchorEl: any;
    dialogs: IDialog[];
    inputVal: string;
    messages: IMessage[];
    openNewMessage: boolean;
    rightMenu: boolean;
    selectedDialogId: number;
    toggleAttachment: boolean;
}

class Chat extends React.Component<IProps, IState> {
    private rightMenu: any = null;
    private message: any = null;
    private idToIndex: any = {};
    private messageRepo: MessageRepo;
    private dialogRepo: DialogRepo;
    // private uniqueId: UniqueId;
    private isLoading: boolean = false;
    private sdk: SDK;
    private connInfo: IConnInfo;

    constructor(props: IProps) {
        super(props);
        this.state = {
            anchorEl: null,
            dialogs: [],
            inputVal: '',
            messages: [],
            openNewMessage: false,
            rightMenu: false,
            selectedDialogId: props.match.params.id === 'null' ? -1 : props.match.params.id,
            toggleAttachment: false,
        };
        this.messageRepo = new MessageRepo();
        this.dialogRepo = new DialogRepo();
        // this.uniqueId = UniqueId.getInstance();
        this.sdk = SDK.getInstance();
        this.connInfo = this.sdk.getConnInfo();
        // setInterval(() => {
        //     const messages = this.state.messages;
        //     const message: IMessage = {
        //         _id: this.uniqueId.getId('msg', 'msg_'),
        //         avatar: undefined,
        //         conversation_id: this.state.selectedDialogId,
        //         me: false,
        //         message: faker.lorem.words(15),
        //         timestamp: new Date().getTime(),
        //     };
        //     if (messages.length > 0) {
        //         if (!message.me && messages[messages.length-1].me !== message.me) {
        //             message.avatar = faker.image.avatar();
        //         }
        //     } else {
        //         message.avatar = faker.image.avatar();
        //     }
        //     messages.push(message);
        //     this.setState({
        //         messages,
        //     }, () => {
        //         setTimeout(() => {
        //             this.animateToEnd();
        //         }, 50);
        //     });
        //     this.messageRepo.createMessage(message);
        // }, 3000);
    }

    public componentWillReceiveProps(newProps: IProps) {
        const selectedId = newProps.match.params.id;
        if (selectedId === 'null') {
            this.setState({
                selectedDialogId: -1,
            });
        } else {
            this.getMessagesByDialogId(parseInt(selectedId, 10), true);
        }
    }

    public componentDidMount() {
        const selectedId = this.props.match.params.id;
        if (selectedId !== 'null') {
            this.getMessagesByDialogId(selectedId);
        }

        window.addEventListener('wasmInit', () => {
            const info = this.sdk.getConnInfo();
            if (info && info.UserID) {
                this.sdk.recall(parseInt(info.UserID, 10)).then((data) => {
                    window.console.log(data);
                });
            }
            // this.sdk.getContacts().then((res) => {
            //     window.console.log(res);
            // }).catch((err) => {
            //     window.console.log(err);
            // });
            //
            this.sdk.getDialogs(0, 100).then((res) => {
                this.dialogRepo.importBulk(res.dialogsList).then((res1) => {
                    window.console.log(res1);
                }).catch((err1) => {
                    window.console.log(err1);
                });
                // this.messageRepo.importBulk(res.messagesList).then((res1) => {
                //     window.console.log(res1);
                // }).catch((err1) => {
                //     window.console.log(err1);
                // });
                window.console.log(res);
            }).catch((err) => {
                window.console.log(err);
            });
        });

        this.dialogRepo.getDialogs({}).then((res) => {
            this.setState({
                dialogs: res
            });
        });
    }

    public render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);
        return (
            <div className="wrapper">
                <div className="container">
                    <div className="column-left">
                        <div className="top">
                            <span className="new-message" onClick={this.onNewMessageOpen}>New message</span>
                        </div>
                        <Dialog items={this.state.dialogs} selectedId={this.state.selectedDialogId}/>
                    </div>
                    {this.state.selectedDialogId !== -1 && <div className="column-center">
                        <div className="top">
                            <span>To: <span
                                className="name">{this.getName(this.state.selectedDialogId)}</span></span>
                            <span className="buttons">
                                <IconButton
                                    aria-label="Attachment"
                                    aria-haspopup="true"
                                    onClick={this.toggleAttachment}
                                >
                                    <Attachment/>
                                </IconButton>
                                <IconButton
                                    aria-label="More"
                                    aria-owns={anchorEl ? 'long-menu' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <MoreVertIcon/>
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                  <MenuItem key={1}
                                            onClick={this.toggleRightMenu}
                                  >
                                      {"Contact Info"}
                                  </MenuItem>
                                </Menu>
                            </span>
                        </div>
                        <div className="conversation" hidden={this.state.toggleAttachment}>
                            <Message ref={this.messageRefHandler}
                                     items={this.state.messages}
                                     onLoadMore={this.onMessageScroll}
                            />
                        </div>
                        <div className="attachments" hidden={!this.state.toggleAttachment}>
                            <Uploader/>
                        </div>
                        {!this.state.toggleAttachment && <TextInput onMessage={this.onMessage}/>}
                    </div>}
                    {this.state.selectedDialogId === -1 && <div className="column-center">
                        <div className="start-messaging">
                            <div className="start-messaging-header"/>
                            <div className="start-messaging-img"/>
                            <div className="start-messaging-title">Choose a chat to start messaging!</div>
                            <div className="start-messaging-footer"/>
                        </div>
                    </div>}
                    <div ref={this.rightMenuRefHandler} className="column-right"/>
                </div>
                <NewMessage open={this.state.openNewMessage} onClose={this.onNewMessageClose}
                            onMessage={this.onNewMessage}/>
            </div>
        );
    }

    private handleClick = (event: any) => {
        this.setState({
            anchorEl: event.currentTarget,
        });
    }

    private handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    }

    private toggleAttachment = () => {
        this.setState({
            toggleAttachment: !this.state.toggleAttachment,
        });
    }

    private toggleRightMenu = () => {
        this.setState({
            anchorEl: null,
        });
        this.rightMenu.classList.toggle('active');
        setTimeout(() => {
            this.message.cache.clearAll();
            this.message.list.recomputeRowHeights();
            this.message.forceUpdate(() => {
                setTimeout(() => {
                    this.message.list.scrollToRow(this.state.messages.length - 1);
                }, 50);
            });
        }, 200);
    }

    private rightMenuRefHandler = (value: any) => {
        this.rightMenu = value;
    }

    private messageRefHandler = (value: any) => {
        this.message = value;
    }

    // private getMessages(conversationId: string): IMessage[] {
    //     const messages: IMessage[] = [];
    //     for (let i = 0; i < 100; i++) {
    //         const me = faker.random.boolean();
    //         if (messages.length > 0) {
    //             if (!messages[0].me && messages[0].me !== me) {
    //                 messages[0].avatar = faker.image.avatar();
    //             }
    //         }
    //         messages.unshift({
    //             _id: this.uniqueId.getId('msg', 'msg_'),
    //             avatar: undefined,
    //             conversation_id: conversationId,
    //             me,
    //             message: faker.lorem.words(15),
    //             timestamp: new Date().getTime(),
    //         });
    //     }
    //     return messages;
    // }

    private getName = (id: number) => {
        if (this.idToIndex.hasOwnProperty(id)) {
            return this.state.dialogs[this.idToIndex[id]]._id;
        }
        return '';
    }

    private animateToEnd() {
        const el = document.querySelector('.chat.active-chat');
        if (el) {
            const eldiv = el.querySelector('.chat.active-chat > div');
            if (eldiv) {
                el.scroll({
                    behavior: 'smooth',
                    top: eldiv.clientHeight,
                });
            }
        }
    }

    //
    // private createFakeMessage(conversationId: string) {
    //     const messages = this.getMessages(conversationId);
    //     this.messageRepo.createMessages(messages).then((data: any) => {
    //         window.console.log('new', data);
    //     }).catch((err: any) => {
    //         window.console.log('new', err);
    //     });
    //     return messages;
    // }

    private getMessagesByDialogId(dialogId: number, force?: boolean) {
        let messages: IMessage[] = [];

        const updateState = () => {
            this.message.cache.clearAll();
            this.message.list.recomputeRowHeights();
            this.message.forceUpdate(() => {
                setTimeout(() => {
                    this.message.list.scrollToRow(messages.length - 1);
                }, 50);
            });
        };

        this.messageRepo.getMessages({peerId: dialogId}).then((data) => {
            if (data.length === 0) {
                // messages = this.createFakeMessage(dialogId);
                messages = [];
            } else {
                messages = data.reverse();
            }
            this.setState({
                messages,
                selectedDialogId: dialogId,
            }, () => {
                if (force === true) {
                    updateState();
                }
            });
        }).catch((err: any) => {
            window.console.warn(err);
            // messages = this.createFakeMessage(dialogId);
            this.setState({
                messages,
                selectedDialogId: dialogId,
            }, () => {
                if (force === true) {
                    updateState();
                }
            });
        });
    }

    private onMessageScroll = () => {
        if (this.isLoading) {
            return;
        }
        this.messageRepo.getMessages({
            before: this.state.messages[0].id,
            conversationId: this.state.selectedDialogId
        }).then((data) => {
            if (data.length === 0) {
                return;
            }
            const messages = this.state.messages;
            messages.unshift.apply(messages, data.reverse());
            this.setState({
                messages,
            }, () => {
                this.message.cache.clearAll();
                this.message.list.recomputeRowHeights();
                this.message.forceUpdate(() => {
                    this.isLoading = false;
                });
            });
        }).catch(() => {
            this.isLoading = false;
        });
    }

    private onMessage = (text: string) => {
        if (trimStart(text).length === 0) {
            return;
        }
        const messages = this.state.messages;
        const message: IMessage = {
            _id: String(UniqueId.getRandomId()),
            body: text,
            createdon: new Date().getTime(),
            me: true,
            peerid: this.state.selectedDialogId,
            senderid: parseInt(this.connInfo.UserID || '0', 10),
        };
        messages.push(message);
        this.setState({
            inputVal: '',
            messages,
        }, () => {
            setTimeout(() => {
                this.animateToEnd();
            }, 50);
        });
        this.messageRepo.createMessage(message);
    }

    private onNewMessageOpen = () => {
        this.setState({
            openNewMessage: true,
        });
    }

    private onNewMessageClose = () => {
        this.setState({
            openNewMessage: false,
        });
    }

    private onNewMessage = (phone: string, text: string) => {
        const contacts: PhoneContact.AsObject[] = [];
        contacts.push({
            clientid: UniqueId.getRandomId(),
            firstname: "Ehsan",
            lastname: "Musa",
            phone,
        });
        this.sdk.contactImport(true, contacts).then((data) => {
            data.usersList.forEach((user) => {
                window.console.log(user);
                const peer = new InputPeer();
                peer.setType(PeerType.PEERUSER);
                if (user.accesshash) {
                    peer.setAccesshash(user.accesshash);
                }
                if (user.id) {
                    peer.setId(user.id);
                }
                this.sdk.sendMessage(text, peer).then((msg) => {
                    window.console.log(msg);
                }).catch((err) => {
                    window.console.log(err);
                });
            });
        }).catch((err) => {
            window.console.log(err);
        });
    }
}

export default Chat;