// package: msg
// file: api.files.proto

import * as jspb from "google-protobuf";
import * as core_types_pb from "./core.types_pb";

export class FileSavePart extends jspb.Message {
  hasFileid(): boolean;
  clearFileid(): void;
  getFileid(): string | undefined;
  setFileid(value: string): void;

  hasPartid(): boolean;
  clearPartid(): void;
  getPartid(): number | undefined;
  setPartid(value: number): void;

  hasTotalparts(): boolean;
  clearTotalparts(): void;
  getTotalparts(): number | undefined;
  setTotalparts(value: number): void;

  hasBytes(): boolean;
  clearBytes(): void;
  getBytes(): Uint8Array | string;
  getBytes_asU8(): Uint8Array;
  getBytes_asB64(): string;
  setBytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FileSavePart.AsObject;
  static toObject(includeInstance: boolean, msg: FileSavePart): FileSavePart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FileSavePart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FileSavePart;
  static deserializeBinaryFromReader(message: FileSavePart, reader: jspb.BinaryReader): FileSavePart;
}

export namespace FileSavePart {
  export type AsObject = {
    fileid?: string,
    partid?: number,
    totalparts?: number,
    bytes: Uint8Array | string,
  }
}

export class FileGet extends jspb.Message {
  hasLocation(): boolean;
  clearLocation(): void;
  getLocation(): core_types_pb.InputFileLocation;
  setLocation(value?: core_types_pb.InputFileLocation): void;

  hasOffset(): boolean;
  clearOffset(): void;
  getOffset(): number | undefined;
  setOffset(value: number): void;

  hasLimit(): boolean;
  clearLimit(): void;
  getLimit(): number | undefined;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FileGet.AsObject;
  static toObject(includeInstance: boolean, msg: FileGet): FileGet.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FileGet, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FileGet;
  static deserializeBinaryFromReader(message: FileGet, reader: jspb.BinaryReader): FileGet;
}

export namespace FileGet {
  export type AsObject = {
    location: core_types_pb.InputFileLocation.AsObject,
    offset?: number,
    limit?: number,
  }
}

export class File extends jspb.Message {
  hasType(): boolean;
  clearType(): void;
  getType(): FileType | undefined;
  setType(value: FileType): void;

  hasModifiedtime(): boolean;
  clearModifiedtime(): void;
  getModifiedtime(): number | undefined;
  setModifiedtime(value: number): void;

  hasBytes(): boolean;
  clearBytes(): void;
  getBytes(): Uint8Array | string;
  getBytes_asU8(): Uint8Array;
  getBytes_asB64(): string;
  setBytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): File.AsObject;
  static toObject(includeInstance: boolean, msg: File): File.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: File, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): File;
  static deserializeBinaryFromReader(message: File, reader: jspb.BinaryReader): File;
}

export namespace File {
  export type AsObject = {
    type?: FileType,
    modifiedtime?: number,
    bytes: Uint8Array | string,
  }
}

export enum FileType {
  FILETYPEUNKNOWN = 0,
  FILETYPEPARTIAL = 1,
  FILETYPEJPEG = 2,
  FILETYPEGIF = 3,
  FILETYPEPNG = 4,
  FILETYPEWEBP = 5,
  FILETYPEMP3 = 6,
  FILETYPEMP4 = 7,
  FILETYPEMOV = 8,
}

