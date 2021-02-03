import React from 'react';
import APIManager from "../../services/sdk";
import UserRepo from "../../repository/user";
import GroupRepo from "../../repository/group";
import {PhoneCallRecord} from "../../services/sdk/messages/chat.phone_pb";
import {Loading} from "../Loading";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList, ListOnItemsRenderedProps} from "react-window";
import Scrollbars from "react-custom-scrollbars";
import IsMobile from "../../services/isMobile";
import getScrollbarWidth from "../../services/utilities/scrollbar_width";
import {C_LOCALSTORAGE} from "../../services/sdk/const";
import {
    CallRounded,
    KeyboardBackspaceRounded,
    CallMadeRounded,
    CallReceivedRounded,
    CallMissedRounded,
    CallMissedOutgoingRounded
} from "@material-ui/icons";
import i18n from "../../services/i18n";
import {PeerType} from "../../services/sdk/messages/core.types_pb";
import UserAvatar from "../UserAvatar";
import GroupAvatar from "../GroupAvatar";
import GroupName from "../GroupName";
import UserName from "../UserName";
import TimeUtility from "../../services/utilities/time";
import IconButton from "@material-ui/core/IconButton/IconButton";
import DialogSkeleton from "../DialogSkeleton";

import './style.scss';

export enum CallStatus {
    Nope = 0x00,
    Init = 0x01,
    Ended = 0x02,
    Busy = 0x03,
    Unavailable = 0x04,
};

const C_FETCH_LIMIT = 100;

const listStyle: React.CSSProperties = {
    overflowX: 'visible',
    overflowY: 'visible',
};

interface IProps {
    onClose?: () => void;
    teamId: string;
}

interface IState {
    list: PhoneCallRecord.AsObject[];
    loading: boolean;
}

class CallHistory extends React.Component<IProps, IState> {
    private apiManager: APIManager;
    private userRepo: UserRepo;
    private groupRepo: GroupRepo;
    private listRef: FixedSizeList;
    private isMobile = IsMobile.isAny();
    private hasScrollbar = getScrollbarWidth() > 0;
    private rtl = localStorage.getItem(C_LOCALSTORAGE.LangDir) === 'rtl';
    private firstTimeLoad: boolean = true;
    private hasMore: boolean = false;

    constructor(props: IProps) {
        super(props);

        this.state = {
            list: [],
            loading: false,
        };

        this.apiManager = APIManager.getInstance();
        this.userRepo = UserRepo.getInstance();
        this.groupRepo = GroupRepo.getInstance();
    }

    public componentDidMount() {
        this.getCallHistory();
    }

    public componentWillUnmount() {
        //
    }

    public render() {
        return (<div className="call-history">
            <div className="menu-header">
                <IconButton onClick={this.props.onClose}>
                    <KeyboardBackspaceRounded/>
                </IconButton>
                <label>{i18n.t('chat.call_history')}</label>
            </div>
            <div className="call-list-container">
                {this.getWrapper()}
            </div>
        </div>);
    }

    private getWrapper() {
        const {list, loading} = this.state;
        if (list.length === 0) {
            if (!this.firstTimeLoad && loading) {
                return (<div className="calls-container">
                    <Loading/>
                </div>);
            } else {
                return (<div className="calls-container">{this.noRowsRenderer()}</div>);
            }
        } else {
            if (this.isMobile || !this.hasScrollbar) {
                return (
                    <AutoSizer>
                        {({width, height}: any) => (
                            <FixedSizeList
                                ref={this.refHandler}
                                itemSize={64}
                                itemCount={list.length}
                                overscanCount={32}
                                width={width}
                                height={height}
                                className="calls-container"
                                direction={this.rtl ? 'ltr' : 'rtl'}
                                onItemsRendered={this.listItemRenderedHandler}
                            >{({index, style}) => {
                                return this.rowRender({index, key: index, style});
                            }}
                            </FixedSizeList>
                        )}
                    </AutoSizer>);
            } else {
                return (<AutoSizer>
                    {({width, height}: any) => (
                        <div className="calls-inner" style={{
                            height: height + 'px',
                            width: width + 'px',
                        }}>
                            <Scrollbars
                                autoHide={true}
                                style={{
                                    height: height + 'px',
                                    width: width + 'px',
                                }}
                                onScroll={this.handleScroll}
                                universal={true}
                                rtl={this.rtl}
                            >
                                <FixedSizeList
                                    ref={this.refHandler}
                                    itemSize={64}
                                    itemCount={list.length}
                                    overscanCount={32}
                                    width={width}
                                    height={height}
                                    className="calls-container"
                                    style={listStyle}
                                    onItemsRendered={this.listItemRenderedHandler}
                                >{({index, style}) => {
                                    return this.rowRender({index, key: index, style});
                                }}
                                </FixedSizeList>
                            </Scrollbars>
                        </div>
                    )}
                </AutoSizer>);
            }
        }
    }

    /* Gets list element */
    private refHandler = (ref: any) => {
        this.listRef = ref;
    }

    private rowRender = ({index, style}: any): any => {
        const call = this.state.list[index];
        const {teamId} = this.props;
        return (
            <div style={style} key={call.callid} className="call-item">
                <div className="avatar">
                    {call.peertype === PeerType.PEERGROUP ?
                        <GroupAvatar id={call.peerid} teamId={teamId}/> :
                        <UserAvatar id={call.peerid}/>}
                </div>
                <div className="info">
                    {call.peertype === PeerType.PEERGROUP ?
                        <GroupName className="name" id={call.peerid} teamId={teamId}/> :
                        <UserName className="name" id={call.peerid} noIcon={true}/>}
                    <div className="status">
                        <div className="call-mode">{this.getCallModeContent(call)}</div>
                        {this.getDuration(call)}
                    </div>
                </div>
                <div className="date">
                    {TimeUtility.dateWithTime(call.createdon)}
                </div>
            </div>
        );
    }

    private getCallModeContent(call: PhoneCallRecord.AsObject) {
        const status: CallStatus = call.status;
        if (status === CallStatus.Busy || status === CallStatus.Unavailable) {
            if (call.incoming) {
                return <CallMissedRounded className="red"/>;
            } else {
                return <CallMissedOutgoingRounded className="red"/>;
            }
        } else if (status === CallStatus.Init) {
            if (call.incoming) {
                return <CallReceivedRounded className="yellow"/>;
            } else {
                return <CallMadeRounded className="yellow"/>;
            }
        }
        if (call.incoming) {
            return <CallReceivedRounded/>;
        } else {
            return <CallMadeRounded/>;
        }
    }

    private getDuration(call: PhoneCallRecord.AsObject) {
        if (call.status === CallStatus.Ended && call.endedon) {
            return TimeUtility.duration(call.createdon, call.endedon);
        }
        if (call.status === CallStatus.Busy || call.status === CallStatus.Unavailable) {
            return i18n.t('call.missed_call');
        }
        return '';
    }

    /* Custom Scrollbars handler */
    private handleScroll = (e: any) => {
        const {scrollTop} = e.target;
        if (this.listRef) {
            this.listRef.scrollTo(scrollTop);
        }
    }

    /* No Rows Renderer */
    private noRowsRenderer = () => {
        if (this.firstTimeLoad) {
            return DialogSkeleton();
        }
        return (
            <div className="no-result">
                <CallRounded/>
                {i18n.t('contact.no_result')}
            </div>
        );
    }

    private listItemRenderedHandler = (e: ListOnItemsRenderedProps) => {
        const {list, loading} = this.state;
        if (list.length === 0 || loading) {
            return;
        }
        if (this.hasMore && e.overscanStopIndex > list.length - 10) {
            this.getCallHistory(list[list.length - 1].createdon);
        }
    }

    private getCallHistory(after?: number) {
        if (this.state.loading) {
            return;
        }
        this.setState({
            loading: true,
        });
        this.apiManager.callGetHistory(C_FETCH_LIMIT, after).then((res) => {
            this.userRepo.importBulk(false, res.usersList);
            this.groupRepo.importBulk(res.usersList);
            this.hasMore = res.phonecallsList.length === C_FETCH_LIMIT;
            if (after) {
                const {list} = this.state;
                list.push(...res.phonecallsList);
                this.setState({
                    list,
                    loading: false,
                });
            } else {
                this.setState({
                    list: res.phonecallsList,
                    loading: false,
                }, () => {
                    if (this.firstTimeLoad) {
                        this.firstTimeLoad = false;
                    }
                });
            }
        }).catch(() => {
            this.setState({
                loading: false,
            });
        });
    }
}

export default CallHistory;