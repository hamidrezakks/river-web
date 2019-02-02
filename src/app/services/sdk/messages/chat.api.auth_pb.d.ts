// package: msg
// file: chat.api.auth.proto

import * as jspb from "google-protobuf";
import * as chat_core_types_pb from "./chat.core.types_pb";

export class AuthRegister extends jspb.Message {
  hasPhone(): boolean;
  clearPhone(): void;
  getPhone(): string | undefined;
  setPhone(value: string): void;

  hasFirstname(): boolean;
  clearFirstname(): void;
  getFirstname(): string | undefined;
  setFirstname(value: string): void;

  hasLastname(): boolean;
  clearLastname(): void;
  getLastname(): string | undefined;
  setLastname(value: string): void;

  hasPhonecode(): boolean;
  clearPhonecode(): void;
  getPhonecode(): string | undefined;
  setPhonecode(value: string): void;

  hasPhonecodehash(): boolean;
  clearPhonecodehash(): void;
  getPhonecodehash(): string | undefined;
  setPhonecodehash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthRegister.AsObject;
  static toObject(includeInstance: boolean, msg: AuthRegister): AuthRegister.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthRegister, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthRegister;
  static deserializeBinaryFromReader(message: AuthRegister, reader: jspb.BinaryReader): AuthRegister;
}

export namespace AuthRegister {
  export type AsObject = {
    phone?: string,
    firstname?: string,
    lastname?: string,
    phonecode?: string,
    phonecodehash?: string,
  }
}

export class AuthLogin extends jspb.Message {
  hasPhone(): boolean;
  clearPhone(): void;
  getPhone(): string | undefined;
  setPhone(value: string): void;

  hasPhonecodehash(): boolean;
  clearPhonecodehash(): void;
  getPhonecodehash(): string | undefined;
  setPhonecodehash(value: string): void;

  hasPhonecode(): boolean;
  clearPhonecode(): void;
  getPhonecode(): string | undefined;
  setPhonecode(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthLogin.AsObject;
  static toObject(includeInstance: boolean, msg: AuthLogin): AuthLogin.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthLogin, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthLogin;
  static deserializeBinaryFromReader(message: AuthLogin, reader: jspb.BinaryReader): AuthLogin;
}

export namespace AuthLogin {
  export type AsObject = {
    phone?: string,
    phonecodehash?: string,
    phonecode?: string,
  }
}

export class AuthLogout extends jspb.Message {
  clearAuthidsList(): void;
  getAuthidsList(): Array<string>;
  setAuthidsList(value: Array<string>): void;
  addAuthids(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthLogout.AsObject;
  static toObject(includeInstance: boolean, msg: AuthLogout): AuthLogout.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthLogout, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthLogout;
  static deserializeBinaryFromReader(message: AuthLogout, reader: jspb.BinaryReader): AuthLogout;
}

export namespace AuthLogout {
  export type AsObject = {
    authidsList: Array<string>,
  }
}

export class AuthLoginByToken extends jspb.Message {
  hasToken(): boolean;
  clearToken(): void;
  getToken(): string | undefined;
  setToken(value: string): void;

  hasProvider(): boolean;
  clearProvider(): void;
  getProvider(): string | undefined;
  setProvider(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthLoginByToken.AsObject;
  static toObject(includeInstance: boolean, msg: AuthLoginByToken): AuthLoginByToken.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthLoginByToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthLoginByToken;
  static deserializeBinaryFromReader(message: AuthLoginByToken, reader: jspb.BinaryReader): AuthLoginByToken;
}

export namespace AuthLoginByToken {
  export type AsObject = {
    token?: string,
    provider?: string,
  }
}

export class AuthCheckPhone extends jspb.Message {
  hasPhone(): boolean;
  clearPhone(): void;
  getPhone(): string | undefined;
  setPhone(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthCheckPhone.AsObject;
  static toObject(includeInstance: boolean, msg: AuthCheckPhone): AuthCheckPhone.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthCheckPhone, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthCheckPhone;
  static deserializeBinaryFromReader(message: AuthCheckPhone, reader: jspb.BinaryReader): AuthCheckPhone;
}

export namespace AuthCheckPhone {
  export type AsObject = {
    phone?: string,
  }
}

export class AuthSendCode extends jspb.Message {
  hasPhone(): boolean;
  clearPhone(): void;
  getPhone(): string | undefined;
  setPhone(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthSendCode.AsObject;
  static toObject(includeInstance: boolean, msg: AuthSendCode): AuthSendCode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthSendCode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthSendCode;
  static deserializeBinaryFromReader(message: AuthSendCode, reader: jspb.BinaryReader): AuthSendCode;
}

export namespace AuthSendCode {
  export type AsObject = {
    phone?: string,
  }
}

export class AuthResendCode extends jspb.Message {
  hasPhone(): boolean;
  clearPhone(): void;
  getPhone(): string | undefined;
  setPhone(value: string): void;

  hasPhonecodehash(): boolean;
  clearPhonecodehash(): void;
  getPhonecodehash(): string | undefined;
  setPhonecodehash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthResendCode.AsObject;
  static toObject(includeInstance: boolean, msg: AuthResendCode): AuthResendCode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthResendCode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthResendCode;
  static deserializeBinaryFromReader(message: AuthResendCode, reader: jspb.BinaryReader): AuthResendCode;
}

export namespace AuthResendCode {
  export type AsObject = {
    phone?: string,
    phonecodehash?: string,
  }
}

export class AuthRecall extends jspb.Message {
  hasClientid(): boolean;
  clearClientid(): void;
  getClientid(): string | undefined;
  setClientid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthRecall.AsObject;
  static toObject(includeInstance: boolean, msg: AuthRecall): AuthRecall.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthRecall, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthRecall;
  static deserializeBinaryFromReader(message: AuthRecall, reader: jspb.BinaryReader): AuthRecall;
}

export namespace AuthRecall {
  export type AsObject = {
    clientid?: string,
  }
}

export class AuthDestroyKey extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthDestroyKey.AsObject;
  static toObject(includeInstance: boolean, msg: AuthDestroyKey): AuthDestroyKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthDestroyKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthDestroyKey;
  static deserializeBinaryFromReader(message: AuthDestroyKey, reader: jspb.BinaryReader): AuthDestroyKey;
}

export namespace AuthDestroyKey {
  export type AsObject = {
  }
}

export class AuthRecalled extends jspb.Message {
  hasClientid(): boolean;
  clearClientid(): void;
  getClientid(): string | undefined;
  setClientid(value: string): void;

  hasTimestamp(): boolean;
  clearTimestamp(): void;
  getTimestamp(): number | undefined;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthRecalled.AsObject;
  static toObject(includeInstance: boolean, msg: AuthRecalled): AuthRecalled.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthRecalled, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthRecalled;
  static deserializeBinaryFromReader(message: AuthRecalled, reader: jspb.BinaryReader): AuthRecalled;
}

export namespace AuthRecalled {
  export type AsObject = {
    clientid?: string,
    timestamp?: number,
  }
}

export class AuthAuthorization extends jspb.Message {
  hasExpired(): boolean;
  clearExpired(): void;
  getExpired(): number | undefined;
  setExpired(value: number): void;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): chat_core_types_pb.User;
  setUser(value?: chat_core_types_pb.User): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthAuthorization.AsObject;
  static toObject(includeInstance: boolean, msg: AuthAuthorization): AuthAuthorization.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthAuthorization, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthAuthorization;
  static deserializeBinaryFromReader(message: AuthAuthorization, reader: jspb.BinaryReader): AuthAuthorization;
}

export namespace AuthAuthorization {
  export type AsObject = {
    expired?: number,
    user: chat_core_types_pb.User.AsObject,
  }
}

export class AuthCheckedPhone extends jspb.Message {
  hasInvited(): boolean;
  clearInvited(): void;
  getInvited(): boolean | undefined;
  setInvited(value: boolean): void;

  hasRegistered(): boolean;
  clearRegistered(): void;
  getRegistered(): boolean | undefined;
  setRegistered(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthCheckedPhone.AsObject;
  static toObject(includeInstance: boolean, msg: AuthCheckedPhone): AuthCheckedPhone.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthCheckedPhone, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthCheckedPhone;
  static deserializeBinaryFromReader(message: AuthCheckedPhone, reader: jspb.BinaryReader): AuthCheckedPhone;
}

export namespace AuthCheckedPhone {
  export type AsObject = {
    invited?: boolean,
    registered?: boolean,
  }
}

export class AuthSentCode extends jspb.Message {
  hasPhone(): boolean;
  clearPhone(): void;
  getPhone(): string | undefined;
  setPhone(value: string): void;

  hasPhonecodehash(): boolean;
  clearPhonecodehash(): void;
  getPhonecodehash(): string | undefined;
  setPhonecodehash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthSentCode.AsObject;
  static toObject(includeInstance: boolean, msg: AuthSentCode): AuthSentCode.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthSentCode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthSentCode;
  static deserializeBinaryFromReader(message: AuthSentCode, reader: jspb.BinaryReader): AuthSentCode;
}

export namespace AuthSentCode {
  export type AsObject = {
    phone?: string,
    phonecodehash?: string,
  }
}
