/*
    Creation Time: 2020 - Nov - 04
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2020
*/

import UpdateManager from "../sdk/updateManager";
import {C_MSG} from "../sdk/const";
import {UpdatePhoneCall} from "../sdk/messages/updates_pb";
import {
    DiscardReason,
    PhoneActionAccepted,
    PhoneActionCallEmpty,
    PhoneActionCallWaiting,
    PhoneActionDiscarded,
    PhoneActionIceExchange,
    PhoneActionRequested,
    PhoneCallAction,
    PhoneParticipant, PhoneParticipantSDP
} from "../sdk/messages/chat.phone_pb";
import {InputPeer, InputUser, PeerType} from "../sdk/messages/core.types_pb";
import UniqueId from "../uniqueId";
import APIManager from "../sdk";

export const C_CALL_EVENT = {
    CallAccept: 0x02,
    CallRejected: 0x04,
    CallRequest: 0x01,
    StreamUpdate: 0x03,
};

export interface IUpdatePhoneCall extends UpdatePhoneCall.AsObject {
    data?: any;
}

interface IConnection {
    accepted: boolean;
    connection: RTCPeerConnection;
    streams: MediaStream[];
    iceQueue: RTCIceCandidate[];
}

interface IBroadcastItem {
    fnQueue: { [key: number]: any };
    data: any;
}

interface ICallInfo {
    request: IUpdatePhoneCall;
    participants: { [key: number]: PhoneParticipant.AsObject };
    participantMap: { [key: string]: number };
}

const parseData = (constructor: number, data: any) => {
    switch (constructor) {
        case PhoneCallAction.PHONECALLREQUESTED:
            return PhoneActionRequested.deserializeBinary(data).toObject();
        case PhoneCallAction.PHONECALLACCEPTED:
            return PhoneActionAccepted.deserializeBinary(data).toObject();
        case PhoneCallAction.PHONECALLDISCARDED:
            return PhoneActionDiscarded.deserializeBinary(data).toObject();
        case PhoneCallAction.PHONECALLCALLWAITING:
            return PhoneActionCallWaiting.deserializeBinary(data).toObject();
        case PhoneCallAction.PHONECALLICEEXCHANGE:
            return PhoneActionIceExchange.deserializeBinary(data).toObject();
        case PhoneCallAction.PHONECALLEMPTY:
            return PhoneActionCallEmpty.deserializeBinary(data).toObject();
    }
    return undefined;
};

export default class CallService {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new CallService();
        }

        return this.instance;
    }

    private static instance: CallService;
    private fnIndex: number = 0;
    private updateManager: UpdateManager;
    private apiManager: APIManager;
    private listeners: { [key: number]: IBroadcastItem } = {};
    private readonly userId: string = '0';

    // Call variables
    private localStream: MediaStream | undefined;
    private peerConnections: { [key: number]: IConnection } = {};
    private offerOptions: RTCOfferOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
    };
    private configs: RTCConfiguration = {
        iceServers: [{
            credential: 'hamidreza',
            urls: 'turn:vm-02.ronaksoftware.com',
            username: 'hamid',
        }],
        iceTransportPolicy: 'all',
    };
    private peer: InputPeer | null = null;
    private activeCallId: string | undefined = '0';
    private callInfo: { [key: string]: ICallInfo } = {};

    private constructor() {
        this.updateManager = UpdateManager.getInstance();
        this.apiManager = APIManager.getInstance();
        this.userId = this.apiManager.getConnInfo().UserID || '0';

        this.updateManager.listen(C_MSG.UpdatePhoneCall, this.phoneCallHandler);
    }

    public initStream() {
        return navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
            this.localStream = stream;
            return stream;
        });
    }

    public toggleVideo(enable: boolean) {
        if (!this.localStream) {
            return;
        }
        this.localStream.getVideoTracks().forEach((track) => {
            track.enabled = enable;
        });
    }

    public toggleAudio(enable: boolean) {
        if (!this.localStream) {
            return;
        }
        this.localStream.getAudioTracks().forEach((track) => {
            track.enabled = enable;
        });
    }

    public getStreamState() {
        if (!this.localStream) {
            return;
        }
        const videoTracks = this.localStream.getVideoTracks();
        const audioTracks = this.localStream.getAudioTracks();
        return {
            audio: audioTracks.length > 0 ? audioTracks[0].enabled : false,
            video: videoTracks.length > 0 ? videoTracks[0].enabled : false,
        };
    }

    public destroy() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                track.stop();
            });
        }
    }

    public getLocalStream(): MediaStream | undefined {
        return this.localStream;
    }

    public getRemoteStreams(connId: number): MediaStream[] | undefined {
        if (!this.peerConnections.hasOwnProperty(connId)) {
            return undefined;
        }
        return this.peerConnections[connId].streams;
    }

    public call(peer: InputPeer, participants: InputUser.AsObject[]) {
        this.peer = peer;

        return this.apiManager.callInit(peer).then((res) => {
            this.configs.iceServers = res.iceserversList.map((item) => ({
                credential: item.credential,
                urls: item.urlsList,
                username: item.username,
            }));
            this.initCallParticipants('temp', participants);
            return this.initConnections(peer, 'temp').then((done) => {
                this.swapTempInfo(this.activeCallId || '0');
                return this.activeCallId || '0';
            });
        });
    }

    public accept(id: string) {
        const peer = this.peer;
        if (!peer) {
            return Promise.reject('invalid peer');
        }
        return this.apiManager.callInit(peer).then((res) => {
            this.activeCallId = id;

            this.configs.iceServers = res.iceserversList.map((item) => ({
                credential: item.credential,
                urls: item.urlsList,
                username: item.username,
            }));
            const info = this.getCallInfo(id);
            if (!info) {
                return Promise.reject('invalid call request');
            }
            if (this.isInitiator(id, info.request.userid || '0')) {
                return this.initStream().then((stream) => {
                    const sdpData = (info.request.data as PhoneActionRequested.AsObject);
                    return this.initConnections(peer, id, {
                        sdp: sdpData.sdp,
                        type: sdpData.type as any,
                    }).then(() => {
                        return stream;
                    });
                });
            } else {
                // accept all other
                return Promise.reject('not implemented yet');
            }
        });
    }

    public reject(id: string, duration: number, reason: DiscardReason) {
        const peer = this.peer;
        if (!peer) {
            return Promise.reject('invalid peer');
        }

        const participants = this.getInputUsers(id);
        if (!participants){
            return Promise.reject('invalid call id');
        }

        return this.apiManager.callReject(peer, id, participants, reason, duration).then(() => {
            this.destroyConnections(id);
        });
    }

    public destroyConnections(id: string, connId?: number) {
        const close = (conn: IConnection) => {
            conn.connection.close();
            conn.streams.forEach((stream) => {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
            });
        };

        if (connId !== undefined) {
            if (this.peerConnections.hasOwnProperty(connId)) {
                close(this.peerConnections[connId]);
                delete this.peerConnections[connId];
            }
        } else {
            Object.values(this.peerConnections).forEach((conn) => {
                close(conn);
            });
            this.peerConnections = {};
            delete this.callInfo[id];
            this.activeCallId = undefined;
        }
    }

    public listen(name: number, fn: any): (() => void) | null {
        if (!name) {
            return null;
        }
        this.fnIndex++;
        const fnIndex = this.fnIndex;
        if (!this.listeners.hasOwnProperty(name)) {
            this.listeners[name] = {
                data: null,
                fnQueue: [],
            };
        }
        this.listeners[name].fnQueue[fnIndex] = fn;
        return () => {
            if (this.listeners.hasOwnProperty(name)) {
                delete this.listeners[name].fnQueue[fnIndex];
            }
        };
    }

    private busyHandler(data: IUpdatePhoneCall) {
        const peer = this.peer;
        if (!peer) {
            return Promise.reject('invalid peer');
        }

        const participants = this.getInputUsers(data.callid || '0');
        if (!participants){
            return Promise.reject('invalid call id');
        }

        return this.apiManager.callReject(peer, data.callid || '0', participants, DiscardReason.DISCARDREASONHANGUP, 0).then(() => {
            //
        });
    }

    private callUser(peer: InputPeer, phoneParticipants: PhoneParticipantSDP[]) {
        const randomId = UniqueId.getRandomId();
        return this.apiManager.callRequest(peer, randomId, phoneParticipants).then((res) => {
            this.activeCallId = res.id || '0';
            return res;
        });
    }

    private phoneCallHandler = (data: IUpdatePhoneCall) => {
        const d = parseData(data.action || 0, data.actiondata);
        delete data.actiondata;
        window.console.log(data);
        data.data = d;
        switch (data.action) {
            case PhoneCallAction.PHONECALLREQUESTED:
                this.callRequested(data);
                break;
            case PhoneCallAction.PHONECALLACCEPTED:
                this.callAccepted(data);
                break;
            case PhoneCallAction.PHONECALLDISCARDED:
                this.callRejected(data);
                break;
            case PhoneCallAction.PHONECALLICEEXCHANGE:
                this.iceExchange(data);
                break;
        }
    }

    private callRequested(data: IUpdatePhoneCall) {
        if (false && this.activeCallId) {
            this.busyHandler(data);
            return;
        }
        this.initCallRequest(data);
        const inputPeer = new InputPeer();
        inputPeer.setId(data.peerid || '0');
        inputPeer.setAccesshash(data.peertype === PeerType.PEERGROUP ? '0' : (data.accesshash || '0'));
        inputPeer.setType(data.peertype || PeerType.PEERUSER);
        this.peer = inputPeer;
        this.callHandlers(C_CALL_EVENT.CallRequest, data);
    }

    private callAccepted(data: IUpdatePhoneCall) {
        const connId = this.getConnId(data.callid, data.userid);
        if (connId === undefined || !this.peerConnections.hasOwnProperty(connId)) {
            return;
        }

        const sdpData = (data.data as PhoneActionAccepted.AsObject);

        this.peerConnections[connId].connection.setRemoteDescription({
            sdp: sdpData.sdp,
            type: sdpData.type as any,
        }).then(() => {
            if (this.peerConnections.hasOwnProperty(connId)) {
                this.peerConnections[connId].accepted = true;
                this.flushIceCandidates(connId);
            }
        });

        this.callHandlers(C_CALL_EVENT.CallAccept, data);
    }

    private callRejected(data: IUpdatePhoneCall) {
        // const actionData = (data.data as PhoneActionDiscarded.AsObject);
        this.callHandlers(C_CALL_EVENT.CallRejected, data);
    }

    private iceExchange(data: IUpdatePhoneCall) {
        const connId = this.getConnId(data.callid, data.userid);
        const conn = this.peerConnections;
        if (connId === undefined || !conn.hasOwnProperty(connId)) {
            return Promise.reject('connId is not found');
        }

        const actionData = data.data as PhoneActionIceExchange.AsObject;
        if (!actionData) {
            return Promise.reject('cannot find sdp');
        }

        const iceCandidate = new RTCIceCandidate({
            candidate: actionData.candidate,
            sdpMLineIndex: actionData.sdpmlineindex,
            sdpMid: actionData.sdpmid,
            usernameFragment: actionData.usernamefragment,
        });

        return conn[connId].connection.addIceCandidate(iceCandidate);
    }

    private convertPhoneParticipant(item: PhoneParticipantSDP.AsObject) {
        const phoneParticipant = new PhoneParticipantSDP();
        phoneParticipant.setConnectionid(item.connectionid || 0);
        phoneParticipant.setSdp(item.sdp || '');
        phoneParticipant.setType(item.type || '');
        const peer = new InputUser();
        peer.setAccesshash(item.peer.accesshash || '0');
        peer.setUserid(item.peer.userid || '0');
        phoneParticipant.setPeer(peer);
        return phoneParticipant;
    }

    private initCallParticipants(callId: string, participants: InputUser.AsObject[]) {
        participants.unshift({
            accesshash: '0',
            userid: this.userId,
        });
        const callParticipants: {[key: number]: PhoneParticipant.AsObject} = {};
        const callParticipantMap: { [key: string]: number} = {};
        participants.forEach((participant, index) => {
            callParticipants[index] = {
                admin: index === 0,
                connectionid: index,
                initiator: index === 0,
                peer: participant,
            };
            callParticipantMap[participant.userid || '0'] = index;
        });
        this.callInfo[callId] = {
            participantMap: callParticipantMap,
            participants: callParticipants,
            request: {
                actiondata: '',
            },
        };
    }

    private initCallRequest(data: IUpdatePhoneCall) {
        const sdpData = (data.data as PhoneActionRequested.AsObject);
        const callParticipants: {[key: number]: PhoneParticipant.AsObject} = {};
        const callParticipantMap: { [key: string]: number} = {};
        sdpData.participantsList.forEach((participant) => {
            callParticipants[participant.connectionid || 0] = participant;
            callParticipantMap[participant.peer.userid || '0'] = participant.connectionid || 0;
        });
        this.callInfo[data.callid || '0'] = {
            participantMap: callParticipantMap,
            participants: callParticipants,
            request: data,
        };
    }

    private isInitiator(callId: string, userId: string) {
        const info = this.getCallInfo(callId);
        if (!info) {
            return false;
        }
        const connId = info.participantMap[userId];
        if (connId === undefined) {
            return false;
        }
        const participant = info.participants[connId];
        if (!participant) {
            return  false;
        }
        return participant.initiator || false;
    }

    private initConnections(peer: InputPeer, id: string, sdp?: RTCSessionDescriptionInit) {
        const userConnId = this.getConnId(id, this.userId) || 0;
        const callInfo = this.getCallInfo(id);
        if (!callInfo) {
            return Promise.reject('invalid call id');
        }
        const promises: any[] = [];
        Object.values(callInfo.participants).forEach((participant) => {
            // Initialize connections only for greater connId,
            // full mesh initialization will take place here
            if (userConnId > (participant.connectionid || 0)) {
                promises.push(this.initConnection(true, participant.connectionid || 0, sdp).then((res) => {
                    const rc = this.convertPhoneParticipant({
                        ...callInfo.participants[participant.connectionid || 0],
                        sdp: res.sdp || '',
                        type: res.type || 'answer',
                    });
                    return this.apiManager.callAccept(peer, id || '0', [rc]);
                }));
            } else if (userConnId < (participant.connectionid || 0)) {
                const innerPromises: any[] = [];
                innerPromises.push(this.initConnection(false, participant.connectionid || 0).then((res) => {
                    return {
                        ...callInfo.participants[participant.connectionid || 0],
                        sdp: res.sdp || '',
                        type: res.type || 'offer'
                    };
                }));
                if (innerPromises.length > 0) {
                    promises.push(Promise.all(innerPromises).then((res) => {
                        return res.map((item: PhoneParticipantSDP.AsObject) => {
                            return this.convertPhoneParticipant(item);
                        });
                    }).then((phoneParticipants) => {
                        return this.callUser(peer, phoneParticipants);
                    }));
                } else {
                    promises.push(Promise.resolve([]));
                }
            }
        });
        if (promises.length > 0) {
            return Promise.all(promises);
        } else {
            return Promise.resolve([]);
        }
    }

    private initConnection(remote: boolean, connId: number, sdp?: RTCSessionDescriptionInit) {
        const stream = this.localStream;
        if (!stream) {
            return Promise.reject('no available stream');
        }

        const pc = new RTCPeerConnection(this.configs);
        pc.addEventListener('icecandidate', (e) => {
            this.sendLocalIce(e.candidate, connId).catch((err) => {
                window.console.log('icecandidate', err);
            });
        });

        pc.addEventListener('icecandidateerror', (e) => {
            window.console.log('icecandidateerror', e);
        });

        const conn: IConnection = {
            accepted: remote,
            connection: pc,
            iceQueue: [],
            streams: [],
        };

        pc.addEventListener('track', (e) => {
            if (e.streams.length > 0) {
                conn.streams = [];
                conn.streams.push(...e.streams);
                this.callHandlers(C_CALL_EVENT.StreamUpdate, {connId, streams: e.streams});
            }
        });

        stream.getTracks().forEach((track) => {
            if (this.localStream) {
                pc.addTrack(track, this.localStream);
            }
        });

        this.peerConnections[connId] = conn;
        if (remote) {
            if (!sdp) {
                return Promise.reject('invalid sdp');
            }
            return pc.setRemoteDescription(sdp).then(() => {
                return pc.createAnswer(this.offerOptions).then((res) => {
                    return pc.setLocalDescription(res).then(() => {
                        return res;
                    });
                });
            });
        } else {
            return pc.createOffer(this.offerOptions).then((res) => {
                return pc.setLocalDescription(res).then(() => {
                    return res;
                });
            });
        }
    }

    private getInputUsers(id: string) {
        const info = this.getCallInfo(id);
        if (!info) {
            return;
        }

        const inputUsers: InputUser[] = [];
        Object.values(info.participants).forEach((participant) => {
            const inputUser = new InputUser();
            inputUser.setAccesshash(participant.peer.accesshash || '0');
            inputUser.setUserid(participant.peer.userid || '0');
            inputUsers.push(inputUser);
        });
        return inputUsers;
    }

    private getCallInfo(id: string) {
        if (!this.callInfo.hasOwnProperty(id)) {
            return undefined;
        }
        return this.callInfo[id];
    }

    private getConnId(callId: string | undefined, userId: string | undefined) {
        const info  = this.getCallInfo(callId || '0');
        if (!info) {
            return;
        }
        return info.participantMap[userId || '0'];
    }

    private swapTempInfo(callId: string) {
        const info  = this.getCallInfo('temp');
        if (!info) {
            return;
        }
        this.callInfo[callId] = info;
        delete this.callInfo.temp;
    }

    private sendLocalIce(candidate: RTCIceCandidate | null, connId: number) {
        if (!candidate) {
            return Promise.reject('invalid candidate');
        }

        const conn = this.peerConnections[connId];
        if (!conn) {
            return Promise.reject('invalid conn');
        }

        if (!conn.accepted) {
            conn.iceQueue.push(candidate);
            return Promise.resolve();
        }

        const peer = this.peer;
        if (!peer || !this.activeCallId) {
            return Promise.reject('invalid input');
        }

        const actionData = new PhoneActionIceExchange();
        actionData.setCandidate(candidate.candidate);
        if (candidate.sdpMid) {
            actionData.setSdpmid(candidate.sdpMid);
        }
        if (candidate.sdpMLineIndex) {
            actionData.setSdpmlineindex(candidate.sdpMLineIndex);
        }
        if (candidate.usernameFragment) {
            actionData.setUsernamefragment(candidate.usernameFragment);
        }

        const inputUser = new InputUser();
        inputUser.setUserid(peer.getId() || '0');
        inputUser.setAccesshash(peer.getAccesshash() || '0');

        return this.apiManager.callUpdate(peer, this.activeCallId, [inputUser], PhoneCallAction.PHONECALLICEEXCHANGE, actionData.serializeBinary()).then(() => {
            return Promise.resolve();
        });
    }

    private flushIceCandidates(connId: number) {
        const conn = this.peerConnections[connId];
        if (!conn) {
            return;
        }
        while (true) {
            const candidate = conn.iceQueue.shift();
            if (candidate) {
                this.sendLocalIce(candidate, connId);
            } else {
                return;
            }
        }
    }

    private callHandlers(name: number, data: any) {
        if (!this.listeners.hasOwnProperty(name)) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            try {
                this.listeners[name].data = data;
                const keys = Object.keys(this.listeners[name].fnQueue);
                keys.forEach((key) => {
                    const fn = this.listeners[name].fnQueue[key];
                    if (fn) {
                        fn(data);
                    }
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}
