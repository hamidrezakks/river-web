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
goog.exportSymbol('proto.msg.ContactsDelete', null, global);
goog.exportSymbol('proto.msg.ContactsGet', null, global);
goog.exportSymbol('proto.msg.ContactsImport', null, global);
goog.exportSymbol('proto.msg.ContactsImported', null, global);
goog.exportSymbol('proto.msg.ContactsMany', null, global);

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
proto.msg.ContactsImport = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.msg.ContactsImport.repeatedFields_, null);
};
goog.inherits(proto.msg.ContactsImport, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.ContactsImport.displayName = 'proto.msg.ContactsImport';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.msg.ContactsImport.repeatedFields_ = [1];



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
proto.msg.ContactsImport.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.ContactsImport.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.ContactsImport} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsImport.toObject = function(includeInstance, msg) {
  var f, obj = {
    contactsList: jspb.Message.toObjectList(msg.getContactsList(),
    chat_core_types_pb.PhoneContact.toObject, includeInstance),
    replace: jspb.Message.getField(msg, 2)
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
 * @return {!proto.msg.ContactsImport}
 */
proto.msg.ContactsImport.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.ContactsImport;
  return proto.msg.ContactsImport.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.ContactsImport} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.ContactsImport}
 */
proto.msg.ContactsImport.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new chat_core_types_pb.PhoneContact;
      reader.readMessage(value,chat_core_types_pb.PhoneContact.deserializeBinaryFromReader);
      msg.addContacts(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReplace(value);
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
proto.msg.ContactsImport.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.ContactsImport.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.ContactsImport} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsImport.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getContactsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      chat_core_types_pb.PhoneContact.serializeBinaryToWriter
    );
  }
  f = /** @type {boolean} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * repeated PhoneContact Contacts = 1;
 * @return {!Array.<!proto.msg.PhoneContact>}
 */
proto.msg.ContactsImport.prototype.getContactsList = function() {
  return /** @type{!Array.<!proto.msg.PhoneContact>} */ (
    jspb.Message.getRepeatedWrapperField(this, chat_core_types_pb.PhoneContact, 1));
};


/** @param {!Array.<!proto.msg.PhoneContact>} value */
proto.msg.ContactsImport.prototype.setContactsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.msg.PhoneContact=} opt_value
 * @param {number=} opt_index
 * @return {!proto.msg.PhoneContact}
 */
proto.msg.ContactsImport.prototype.addContacts = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.msg.PhoneContact, opt_index);
};


proto.msg.ContactsImport.prototype.clearContactsList = function() {
  this.setContactsList([]);
};


/**
 * required bool Replace = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.msg.ContactsImport.prototype.getReplace = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.msg.ContactsImport.prototype.setReplace = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.msg.ContactsImport.prototype.clearReplace = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.ContactsImport.prototype.hasReplace = function() {
  return jspb.Message.getField(this, 2) != null;
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
proto.msg.ContactsGet = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msg.ContactsGet, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.ContactsGet.displayName = 'proto.msg.ContactsGet';
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
proto.msg.ContactsGet.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.ContactsGet.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.ContactsGet} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsGet.toObject = function(includeInstance, msg) {
  var f, obj = {
    md5hash: jspb.Message.getField(msg, 1)
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
 * @return {!proto.msg.ContactsGet}
 */
proto.msg.ContactsGet.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.ContactsGet;
  return proto.msg.ContactsGet.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.ContactsGet} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.ContactsGet}
 */
proto.msg.ContactsGet.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setMd5hash(value);
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
proto.msg.ContactsGet.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.ContactsGet.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.ContactsGet} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsGet.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * required string MD5Hash = 1;
 * @return {string}
 */
proto.msg.ContactsGet.prototype.getMd5hash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.msg.ContactsGet.prototype.setMd5hash = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.msg.ContactsGet.prototype.clearMd5hash = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.ContactsGet.prototype.hasMd5hash = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.msg.ContactsDelete = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.msg.ContactsDelete.repeatedFields_, null);
};
goog.inherits(proto.msg.ContactsDelete, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.ContactsDelete.displayName = 'proto.msg.ContactsDelete';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.msg.ContactsDelete.repeatedFields_ = [1];



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
proto.msg.ContactsDelete.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.ContactsDelete.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.ContactsDelete} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsDelete.toObject = function(includeInstance, msg) {
  var f, obj = {
    useridsList: jspb.Message.getRepeatedField(msg, 1)
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
 * @return {!proto.msg.ContactsDelete}
 */
proto.msg.ContactsDelete.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.ContactsDelete;
  return proto.msg.ContactsDelete.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.ContactsDelete} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.ContactsDelete}
 */
proto.msg.ContactsDelete.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readInt64String());
      msg.addUserids(value);
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
proto.msg.ContactsDelete.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.ContactsDelete.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.ContactsDelete} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsDelete.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUseridsList();
  if (f.length > 0) {
    writer.writeRepeatedInt64String(
      1,
      f
    );
  }
};


/**
 * repeated int64 UserIDs = 1;
 * @return {!Array.<string>}
 */
proto.msg.ContactsDelete.prototype.getUseridsList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/** @param {!Array.<string>} value */
proto.msg.ContactsDelete.prototype.setUseridsList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {!string} value
 * @param {number=} opt_index
 */
proto.msg.ContactsDelete.prototype.addUserids = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.msg.ContactsDelete.prototype.clearUseridsList = function() {
  this.setUseridsList([]);
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
proto.msg.ContactsImported = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.msg.ContactsImported.repeatedFields_, null);
};
goog.inherits(proto.msg.ContactsImported, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.ContactsImported.displayName = 'proto.msg.ContactsImported';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.msg.ContactsImported.repeatedFields_ = [1];



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
proto.msg.ContactsImported.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.ContactsImported.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.ContactsImported} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsImported.toObject = function(includeInstance, msg) {
  var f, obj = {
    usersList: jspb.Message.toObjectList(msg.getUsersList(),
    chat_core_types_pb.ContactUser.toObject, includeInstance)
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
 * @return {!proto.msg.ContactsImported}
 */
proto.msg.ContactsImported.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.ContactsImported;
  return proto.msg.ContactsImported.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.ContactsImported} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.ContactsImported}
 */
proto.msg.ContactsImported.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new chat_core_types_pb.ContactUser;
      reader.readMessage(value,chat_core_types_pb.ContactUser.deserializeBinaryFromReader);
      msg.addUsers(value);
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
proto.msg.ContactsImported.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.ContactsImported.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.ContactsImported} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsImported.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      chat_core_types_pb.ContactUser.serializeBinaryToWriter
    );
  }
};


/**
 * repeated ContactUser Users = 1;
 * @return {!Array.<!proto.msg.ContactUser>}
 */
proto.msg.ContactsImported.prototype.getUsersList = function() {
  return /** @type{!Array.<!proto.msg.ContactUser>} */ (
    jspb.Message.getRepeatedWrapperField(this, chat_core_types_pb.ContactUser, 1));
};


/** @param {!Array.<!proto.msg.ContactUser>} value */
proto.msg.ContactsImported.prototype.setUsersList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.msg.ContactUser=} opt_value
 * @param {number=} opt_index
 * @return {!proto.msg.ContactUser}
 */
proto.msg.ContactsImported.prototype.addUsers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.msg.ContactUser, opt_index);
};


proto.msg.ContactsImported.prototype.clearUsersList = function() {
  this.setUsersList([]);
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
proto.msg.ContactsMany = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.msg.ContactsMany.repeatedFields_, null);
};
goog.inherits(proto.msg.ContactsMany, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.ContactsMany.displayName = 'proto.msg.ContactsMany';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.msg.ContactsMany.repeatedFields_ = [1,2];



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
proto.msg.ContactsMany.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.ContactsMany.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.ContactsMany} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsMany.toObject = function(includeInstance, msg) {
  var f, obj = {
    contactsList: jspb.Message.toObjectList(msg.getContactsList(),
    chat_core_types_pb.PhoneContact.toObject, includeInstance),
    usersList: jspb.Message.toObjectList(msg.getUsersList(),
    chat_core_types_pb.ContactUser.toObject, includeInstance)
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
 * @return {!proto.msg.ContactsMany}
 */
proto.msg.ContactsMany.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.ContactsMany;
  return proto.msg.ContactsMany.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.ContactsMany} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.ContactsMany}
 */
proto.msg.ContactsMany.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new chat_core_types_pb.PhoneContact;
      reader.readMessage(value,chat_core_types_pb.PhoneContact.deserializeBinaryFromReader);
      msg.addContacts(value);
      break;
    case 2:
      var value = new chat_core_types_pb.ContactUser;
      reader.readMessage(value,chat_core_types_pb.ContactUser.deserializeBinaryFromReader);
      msg.addUsers(value);
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
proto.msg.ContactsMany.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.ContactsMany.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.ContactsMany} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.ContactsMany.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getContactsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      chat_core_types_pb.PhoneContact.serializeBinaryToWriter
    );
  }
  f = message.getUsersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      chat_core_types_pb.ContactUser.serializeBinaryToWriter
    );
  }
};


/**
 * repeated PhoneContact Contacts = 1;
 * @return {!Array.<!proto.msg.PhoneContact>}
 */
proto.msg.ContactsMany.prototype.getContactsList = function() {
  return /** @type{!Array.<!proto.msg.PhoneContact>} */ (
    jspb.Message.getRepeatedWrapperField(this, chat_core_types_pb.PhoneContact, 1));
};


/** @param {!Array.<!proto.msg.PhoneContact>} value */
proto.msg.ContactsMany.prototype.setContactsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.msg.PhoneContact=} opt_value
 * @param {number=} opt_index
 * @return {!proto.msg.PhoneContact}
 */
proto.msg.ContactsMany.prototype.addContacts = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.msg.PhoneContact, opt_index);
};


proto.msg.ContactsMany.prototype.clearContactsList = function() {
  this.setContactsList([]);
};


/**
 * repeated ContactUser Users = 2;
 * @return {!Array.<!proto.msg.ContactUser>}
 */
proto.msg.ContactsMany.prototype.getUsersList = function() {
  return /** @type{!Array.<!proto.msg.ContactUser>} */ (
    jspb.Message.getRepeatedWrapperField(this, chat_core_types_pb.ContactUser, 2));
};


/** @param {!Array.<!proto.msg.ContactUser>} value */
proto.msg.ContactsMany.prototype.setUsersList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.msg.ContactUser=} opt_value
 * @param {number=} opt_index
 * @return {!proto.msg.ContactUser}
 */
proto.msg.ContactsMany.prototype.addUsers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.msg.ContactUser, opt_index);
};


proto.msg.ContactsMany.prototype.clearUsersList = function() {
  this.setUsersList([]);
};


goog.object.extend(exports, proto.msg);