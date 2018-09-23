// package: msg
// file: api.updates.proto

import * as jspb from "google-protobuf";
import * as core_messages_pb from "./core.messages_pb";
import * as core_types_pb from "./core.types_pb";

export class UpdateGetState extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateGetState.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateGetState): UpdateGetState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateGetState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateGetState;
  static deserializeBinaryFromReader(message: UpdateGetState, reader: jspb.BinaryReader): UpdateGetState;
}

export namespace UpdateGetState {
  export type AsObject = {
  }
}

export class UpdateGetDifference extends jspb.Message {
  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): number | undefined;
  setFrom(value: number): void;

  hasLimit(): boolean;
  clearLimit(): void;
  getLimit(): number | undefined;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateGetDifference.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateGetDifference): UpdateGetDifference.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateGetDifference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateGetDifference;
  static deserializeBinaryFromReader(message: UpdateGetDifference, reader: jspb.BinaryReader): UpdateGetDifference;
}

export namespace UpdateGetDifference {
  export type AsObject = {
    from?: number,
    limit?: number,
  }
}

export class UpdateDifference extends jspb.Message {
  hasMore(): boolean;
  clearMore(): void;
  getMore(): boolean | undefined;
  setMore(value: boolean): void;

  hasMaxupdateid(): boolean;
  clearMaxupdateid(): void;
  getMaxupdateid(): number | undefined;
  setMaxupdateid(value: number): void;

  hasMinupdateid(): boolean;
  clearMinupdateid(): void;
  getMinupdateid(): number | undefined;
  setMinupdateid(value: number): void;

  clearUpdatesList(): void;
  getUpdatesList(): Array<core_messages_pb.UpdateEnvelope>;
  setUpdatesList(value: Array<core_messages_pb.UpdateEnvelope>): void;
  addUpdates(value?: core_messages_pb.UpdateEnvelope, index?: number): core_messages_pb.UpdateEnvelope;

  clearUsersList(): void;
  getUsersList(): Array<core_types_pb.User>;
  setUsersList(value: Array<core_types_pb.User>): void;
  addUsers(value?: core_types_pb.User, index?: number): core_types_pb.User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateDifference.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateDifference): UpdateDifference.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateDifference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateDifference;
  static deserializeBinaryFromReader(message: UpdateDifference, reader: jspb.BinaryReader): UpdateDifference;
}

export namespace UpdateDifference {
  export type AsObject = {
    more?: boolean,
    maxupdateid?: number,
    minupdateid?: number,
    updatesList: Array<core_messages_pb.UpdateEnvelope.AsObject>,
    usersList: Array<core_types_pb.User.AsObject>,
  }
}

export class UpdateState extends jspb.Message {
  hasUpdateid(): boolean;
  clearUpdateid(): void;
  getUpdateid(): number | undefined;
  setUpdateid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateState.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateState): UpdateState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateState;
  static deserializeBinaryFromReader(message: UpdateState, reader: jspb.BinaryReader): UpdateState;
}

export namespace UpdateState {
  export type AsObject = {
    updateid?: number,
  }
}

export class UpdateMessageID extends jspb.Message {
  hasUcount(): boolean;
  clearUcount(): void;
  getUcount(): number | undefined;
  setUcount(value: number): void;

  hasMessageid(): boolean;
  clearMessageid(): void;
  getMessageid(): number | undefined;
  setMessageid(value: number): void;

  hasRandomid(): boolean;
  clearRandomid(): void;
  getRandomid(): number | undefined;
  setRandomid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMessageID.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMessageID): UpdateMessageID.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateMessageID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMessageID;
  static deserializeBinaryFromReader(message: UpdateMessageID, reader: jspb.BinaryReader): UpdateMessageID;
}

export namespace UpdateMessageID {
  export type AsObject = {
    ucount?: number,
    messageid?: number,
    randomid?: number,
  }
}

export class UpdateNewMessage extends jspb.Message {
  hasUcount(): boolean;
  clearUcount(): void;
  getUcount(): number | undefined;
  setUcount(value: number): void;

  hasUpdateid(): boolean;
  clearUpdateid(): void;
  getUpdateid(): number | undefined;
  setUpdateid(value: number): void;

  hasMessage(): boolean;
  clearMessage(): void;
  getMessage(): core_types_pb.UserMessage;
  setMessage(value?: core_types_pb.UserMessage): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateNewMessage.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateNewMessage): UpdateNewMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateNewMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateNewMessage;
  static deserializeBinaryFromReader(message: UpdateNewMessage, reader: jspb.BinaryReader): UpdateNewMessage;
}

export namespace UpdateNewMessage {
  export type AsObject = {
    ucount?: number,
    updateid?: number,
    message: core_types_pb.UserMessage.AsObject,
  }
}

export class UpdateMessageEdited extends jspb.Message {
  hasUcount(): boolean;
  clearUcount(): void;
  getUcount(): number | undefined;
  setUcount(value: number): void;

  hasUpdateid(): boolean;
  clearUpdateid(): void;
  getUpdateid(): number | undefined;
  setUpdateid(value: number): void;

  hasMessage(): boolean;
  clearMessage(): void;
  getMessage(): core_types_pb.UserMessage;
  setMessage(value?: core_types_pb.UserMessage): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMessageEdited.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMessageEdited): UpdateMessageEdited.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateMessageEdited, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMessageEdited;
  static deserializeBinaryFromReader(message: UpdateMessageEdited, reader: jspb.BinaryReader): UpdateMessageEdited;
}

export namespace UpdateMessageEdited {
  export type AsObject = {
    ucount?: number,
    updateid?: number,
    message: core_types_pb.UserMessage.AsObject,
  }
}

export class UpdateReadHistoryInbox extends jspb.Message {
  hasUcount(): boolean;
  clearUcount(): void;
  getUcount(): number | undefined;
  setUcount(value: number): void;

  hasUpdateid(): boolean;
  clearUpdateid(): void;
  getUpdateid(): number | undefined;
  setUpdateid(value: number): void;

  hasPeer(): boolean;
  clearPeer(): void;
  getPeer(): core_types_pb.Peer;
  setPeer(value?: core_types_pb.Peer): void;

  hasMaxid(): boolean;
  clearMaxid(): void;
  getMaxid(): number | undefined;
  setMaxid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateReadHistoryInbox.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateReadHistoryInbox): UpdateReadHistoryInbox.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateReadHistoryInbox, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateReadHistoryInbox;
  static deserializeBinaryFromReader(message: UpdateReadHistoryInbox, reader: jspb.BinaryReader): UpdateReadHistoryInbox;
}

export namespace UpdateReadHistoryInbox {
  export type AsObject = {
    ucount?: number,
    updateid?: number,
    peer: core_types_pb.Peer.AsObject,
    maxid?: number,
  }
}

export class UpdateReadHistoryOutbox extends jspb.Message {
  hasUcount(): boolean;
  clearUcount(): void;
  getUcount(): number | undefined;
  setUcount(value: number): void;

  hasUpdateid(): boolean;
  clearUpdateid(): void;
  getUpdateid(): number | undefined;
  setUpdateid(value: number): void;

  hasPeer(): boolean;
  clearPeer(): void;
  getPeer(): core_types_pb.Peer;
  setPeer(value?: core_types_pb.Peer): void;

  hasMaxid(): boolean;
  clearMaxid(): void;
  getMaxid(): number | undefined;
  setMaxid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateReadHistoryOutbox.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateReadHistoryOutbox): UpdateReadHistoryOutbox.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateReadHistoryOutbox, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateReadHistoryOutbox;
  static deserializeBinaryFromReader(message: UpdateReadHistoryOutbox, reader: jspb.BinaryReader): UpdateReadHistoryOutbox;
}

export namespace UpdateReadHistoryOutbox {
  export type AsObject = {
    ucount?: number,
    updateid?: number,
    peer: core_types_pb.Peer.AsObject,
    maxid?: number,
  }
}

export class UpdateUserTyping extends jspb.Message {
  hasUcount(): boolean;
  clearUcount(): void;
  getUcount(): number | undefined;
  setUcount(value: number): void;

  hasUserid(): boolean;
  clearUserid(): void;
  getUserid(): number | undefined;
  setUserid(value: number): void;

  hasAction(): boolean;
  clearAction(): void;
  getAction(): core_types_pb.TypingAction | undefined;
  setAction(value: core_types_pb.TypingAction): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateUserTyping.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateUserTyping): UpdateUserTyping.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateUserTyping, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateUserTyping;
  static deserializeBinaryFromReader(message: UpdateUserTyping, reader: jspb.BinaryReader): UpdateUserTyping;
}

export namespace UpdateUserTyping {
  export type AsObject = {
    ucount?: number,
    userid?: number,
    action?: core_types_pb.TypingAction,
  }
}

export class UpdateUserStatus extends jspb.Message {
  hasUcount(): boolean;
  clearUcount(): void;
  getUcount(): number | undefined;
  setUcount(value: number): void;

  hasUserid(): boolean;
  clearUserid(): void;
  getUserid(): number | undefined;
  setUserid(value: number): void;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): number | undefined;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateUserStatus.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateUserStatus): UpdateUserStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateUserStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateUserStatus;
  static deserializeBinaryFromReader(message: UpdateUserStatus, reader: jspb.BinaryReader): UpdateUserStatus;
}

export namespace UpdateUserStatus {
  export type AsObject = {
    ucount?: number,
    userid?: number,
    status?: number,
  }
}
