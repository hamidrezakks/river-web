/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var chat_core_types_pb = require('./chat.core.types_pb.js');
goog.exportSymbol('proto.msg.File', null, global);
goog.exportSymbol('proto.msg.FileGet', null, global);
goog.exportSymbol('proto.msg.FileSavePart', null, global);
goog.exportSymbol('proto.msg.FileType', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.msg.FileSavePart = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msg.FileSavePart, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.FileSavePart.displayName = 'proto.msg.FileSavePart';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.msg.FileSavePart.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.FileSavePart.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.FileSavePart} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.FileSavePart.toObject = function(includeInstance, msg) {
  var f, obj = {
    fileid: jspb.Message.getField(msg, 1),
    partid: jspb.Message.getField(msg, 2),
    totalparts: jspb.Message.getField(msg, 3),
    bytes: msg.getBytes_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.msg.FileSavePart}
 */
proto.msg.FileSavePart.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.FileSavePart;
  return proto.msg.FileSavePart.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.FileSavePart} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.FileSavePart}
 */
proto.msg.FileSavePart.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readInt64String());
      msg.setFileid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPartid(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTotalparts(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBytes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.msg.FileSavePart.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.FileSavePart.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.FileSavePart} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.FileSavePart.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeInt64String(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeBytes(
      4,
      f
    );
  }
};


/**
 * required int64 FileID = 1;
 * @return {string}
 */
proto.msg.FileSavePart.prototype.getFileid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, "0"));
};


/** @param {string} value */
proto.msg.FileSavePart.prototype.setFileid = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.msg.FileSavePart.prototype.clearFileid = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.FileSavePart.prototype.hasFileid = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * required int32 PartID = 2;
 * @return {number}
 */
proto.msg.FileSavePart.prototype.getPartid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.msg.FileSavePart.prototype.setPartid = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.msg.FileSavePart.prototype.clearPartid = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.FileSavePart.prototype.hasPartid = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * required int32 TotalParts = 3;
 * @return {number}
 */
proto.msg.FileSavePart.prototype.getTotalparts = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.msg.FileSavePart.prototype.setTotalparts = function(value) {
  jspb.Message.setField(this, 3, value);
};


proto.msg.FileSavePart.prototype.clearTotalparts = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.FileSavePart.prototype.hasTotalparts = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * required bytes Bytes = 4;
 * @return {!(string|Uint8Array)}
 */
proto.msg.FileSavePart.prototype.getBytes = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * required bytes Bytes = 4;
 * This is a type-conversion wrapper around `getBytes()`
 * @return {string}
 */
proto.msg.FileSavePart.prototype.getBytes_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBytes()));
};


/**
 * required bytes Bytes = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBytes()`
 * @return {!Uint8Array}
 */
proto.msg.FileSavePart.prototype.getBytes_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBytes()));
};


/** @param {!(string|Uint8Array)} value */
proto.msg.FileSavePart.prototype.setBytes = function(value) {
  jspb.Message.setField(this, 4, value);
};


proto.msg.FileSavePart.prototype.clearBytes = function() {
  jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.FileSavePart.prototype.hasBytes = function() {
  return jspb.Message.getField(this, 4) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.msg.FileGet = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msg.FileGet, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.FileGet.displayName = 'proto.msg.FileGet';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.msg.FileGet.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.FileGet.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.FileGet} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.FileGet.toObject = function(includeInstance, msg) {
  var f, obj = {
    location: (f = msg.getLocation()) && chat_core_types_pb.InputFileLocation.toObject(includeInstance, f),
    offset: jspb.Message.getField(msg, 2),
    limit: jspb.Message.getField(msg, 3)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.msg.FileGet}
 */
proto.msg.FileGet.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.FileGet;
  return proto.msg.FileGet.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.FileGet} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.FileGet}
 */
proto.msg.FileGet.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new chat_core_types_pb.InputFileLocation;
      reader.readMessage(value,chat_core_types_pb.InputFileLocation.deserializeBinaryFromReader);
      msg.setLocation(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setOffset(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setLimit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.msg.FileGet.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.FileGet.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.FileGet} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.FileGet.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLocation();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      chat_core_types_pb.InputFileLocation.serializeBinaryToWriter
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeInt32(
      3,
      f
    );
  }
};


/**
 * required InputFileLocation Location = 1;
 * @return {!proto.msg.InputFileLocation}
 */
proto.msg.FileGet.prototype.getLocation = function() {
  return /** @type{!proto.msg.InputFileLocation} */ (
    jspb.Message.getWrapperField(this, chat_core_types_pb.InputFileLocation, 1, 1));
};


/** @param {!proto.msg.InputFileLocation} value */
proto.msg.FileGet.prototype.setLocation = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.msg.FileGet.prototype.clearLocation = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.FileGet.prototype.hasLocation = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * required int32 Offset = 2;
 * @return {number}
 */
proto.msg.FileGet.prototype.getOffset = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.msg.FileGet.prototype.setOffset = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.msg.FileGet.prototype.clearOffset = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.FileGet.prototype.hasOffset = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * required int32 Limit = 3;
 * @return {number}
 */
proto.msg.FileGet.prototype.getLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.msg.FileGet.prototype.setLimit = function(value) {
  jspb.Message.setField(this, 3, value);
};


proto.msg.FileGet.prototype.clearLimit = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.FileGet.prototype.hasLimit = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.msg.File = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msg.File, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.File.displayName = 'proto.msg.File';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.msg.File.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.File.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.File} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.File.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getField(msg, 1),
    modifiedtime: jspb.Message.getField(msg, 2),
    bytes: msg.getBytes_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.msg.File}
 */
proto.msg.File.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.File;
  return proto.msg.File.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.File} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.File}
 */
proto.msg.File.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.msg.FileType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setModifiedtime(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBytes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.msg.File.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.File.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.File} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.File.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {!proto.msg.FileType} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeBytes(
      4,
      f
    );
  }
};


/**
 * required FileType Type = 1;
 * @return {!proto.msg.FileType}
 */
proto.msg.File.prototype.getType = function() {
  return /** @type {!proto.msg.FileType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.msg.FileType} value */
proto.msg.File.prototype.setType = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.msg.File.prototype.clearType = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.File.prototype.hasType = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * required int64 ModifiedTime = 2;
 * @return {number}
 */
proto.msg.File.prototype.getModifiedtime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.msg.File.prototype.setModifiedtime = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.msg.File.prototype.clearModifiedtime = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.File.prototype.hasModifiedtime = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * required bytes Bytes = 4;
 * @return {!(string|Uint8Array)}
 */
proto.msg.File.prototype.getBytes = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * required bytes Bytes = 4;
 * This is a type-conversion wrapper around `getBytes()`
 * @return {string}
 */
proto.msg.File.prototype.getBytes_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBytes()));
};


/**
 * required bytes Bytes = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBytes()`
 * @return {!Uint8Array}
 */
proto.msg.File.prototype.getBytes_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBytes()));
};


/** @param {!(string|Uint8Array)} value */
proto.msg.File.prototype.setBytes = function(value) {
  jspb.Message.setField(this, 4, value);
};


proto.msg.File.prototype.clearBytes = function() {
  jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.File.prototype.hasBytes = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * @enum {number}
 */
proto.msg.FileType = {
  FILETYPEUNKNOWN: 0,
  FILETYPEPARTIAL: 1,
  FILETYPEJPEG: 2,
  FILETYPEGIF: 3,
  FILETYPEPNG: 4,
  FILETYPEWEBP: 5,
  FILETYPEMP3: 6,
  FILETYPEMP4: 7,
  FILETYPEMOV: 8
};

goog.object.extend(exports, proto.msg);