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

goog.exportSymbol('proto.msg.MessageActionClearHistory', null, global);
goog.exportSymbol('proto.msg.MessageActionContactRegistered', null, global);
goog.exportSymbol('proto.msg.MessageActionGroupAddUser', null, global);
goog.exportSymbol('proto.msg.MessageActionGroupCreated', null, global);
goog.exportSymbol('proto.msg.MessageActionGroupDeleteUser', null, global);
goog.exportSymbol('proto.msg.MessageActionGroupTitleChanged', null, global);

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
proto.msg.MessageActionGroupAddUser = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.msg.MessageActionGroupAddUser.repeatedFields_, null);
};
goog.inherits(proto.msg.MessageActionGroupAddUser, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.MessageActionGroupAddUser.displayName = 'proto.msg.MessageActionGroupAddUser';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.msg.MessageActionGroupAddUser.repeatedFields_ = [1];



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
proto.msg.MessageActionGroupAddUser.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.MessageActionGroupAddUser.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.MessageActionGroupAddUser} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionGroupAddUser.toObject = function(includeInstance, msg) {
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
 * @return {!proto.msg.MessageActionGroupAddUser}
 */
proto.msg.MessageActionGroupAddUser.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.MessageActionGroupAddUser;
  return proto.msg.MessageActionGroupAddUser.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.MessageActionGroupAddUser} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.MessageActionGroupAddUser}
 */
proto.msg.MessageActionGroupAddUser.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
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
proto.msg.MessageActionGroupAddUser.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.MessageActionGroupAddUser.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.MessageActionGroupAddUser} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionGroupAddUser.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUseridsList();
  if (f.length > 0) {
    writer.writeRepeatedInt64(
      1,
      f
    );
  }
};


/**
 * repeated int64 UserIDs = 1;
 * @return {!Array.<number>}
 */
proto.msg.MessageActionGroupAddUser.prototype.getUseridsList = function() {
  return /** @type {!Array.<number>} */ (jspb.Message.getRepeatedField(this, 1));
};


/** @param {!Array.<number>} value */
proto.msg.MessageActionGroupAddUser.prototype.setUseridsList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {!number} value
 * @param {number=} opt_index
 */
proto.msg.MessageActionGroupAddUser.prototype.addUserids = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.msg.MessageActionGroupAddUser.prototype.clearUseridsList = function() {
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
proto.msg.MessageActionGroupDeleteUser = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.msg.MessageActionGroupDeleteUser.repeatedFields_, null);
};
goog.inherits(proto.msg.MessageActionGroupDeleteUser, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.MessageActionGroupDeleteUser.displayName = 'proto.msg.MessageActionGroupDeleteUser';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.msg.MessageActionGroupDeleteUser.repeatedFields_ = [1];



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
proto.msg.MessageActionGroupDeleteUser.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.MessageActionGroupDeleteUser.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.MessageActionGroupDeleteUser} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionGroupDeleteUser.toObject = function(includeInstance, msg) {
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
 * @return {!proto.msg.MessageActionGroupDeleteUser}
 */
proto.msg.MessageActionGroupDeleteUser.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.MessageActionGroupDeleteUser;
  return proto.msg.MessageActionGroupDeleteUser.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.MessageActionGroupDeleteUser} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.MessageActionGroupDeleteUser}
 */
proto.msg.MessageActionGroupDeleteUser.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
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
proto.msg.MessageActionGroupDeleteUser.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.MessageActionGroupDeleteUser.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.MessageActionGroupDeleteUser} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionGroupDeleteUser.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUseridsList();
  if (f.length > 0) {
    writer.writeRepeatedInt64(
      1,
      f
    );
  }
};


/**
 * repeated int64 UserIDs = 1;
 * @return {!Array.<number>}
 */
proto.msg.MessageActionGroupDeleteUser.prototype.getUseridsList = function() {
  return /** @type {!Array.<number>} */ (jspb.Message.getRepeatedField(this, 1));
};


/** @param {!Array.<number>} value */
proto.msg.MessageActionGroupDeleteUser.prototype.setUseridsList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {!number} value
 * @param {number=} opt_index
 */
proto.msg.MessageActionGroupDeleteUser.prototype.addUserids = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.msg.MessageActionGroupDeleteUser.prototype.clearUseridsList = function() {
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
proto.msg.MessageActionGroupCreated = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.msg.MessageActionGroupCreated.repeatedFields_, null);
};
goog.inherits(proto.msg.MessageActionGroupCreated, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.MessageActionGroupCreated.displayName = 'proto.msg.MessageActionGroupCreated';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.msg.MessageActionGroupCreated.repeatedFields_ = [2];



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
proto.msg.MessageActionGroupCreated.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.MessageActionGroupCreated.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.MessageActionGroupCreated} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionGroupCreated.toObject = function(includeInstance, msg) {
  var f, obj = {
    grouptitle: jspb.Message.getField(msg, 1),
    useridsList: jspb.Message.getRepeatedField(msg, 2)
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
 * @return {!proto.msg.MessageActionGroupCreated}
 */
proto.msg.MessageActionGroupCreated.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.MessageActionGroupCreated;
  return proto.msg.MessageActionGroupCreated.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.MessageActionGroupCreated} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.MessageActionGroupCreated}
 */
proto.msg.MessageActionGroupCreated.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setGrouptitle(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
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
proto.msg.MessageActionGroupCreated.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.MessageActionGroupCreated.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.MessageActionGroupCreated} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionGroupCreated.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getUseridsList();
  if (f.length > 0) {
    writer.writeRepeatedInt64(
      2,
      f
    );
  }
};


/**
 * required string GroupTitle = 1;
 * @return {string}
 */
proto.msg.MessageActionGroupCreated.prototype.getGrouptitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.msg.MessageActionGroupCreated.prototype.setGrouptitle = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.msg.MessageActionGroupCreated.prototype.clearGrouptitle = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.MessageActionGroupCreated.prototype.hasGrouptitle = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated int64 UserIDs = 2;
 * @return {!Array.<number>}
 */
proto.msg.MessageActionGroupCreated.prototype.getUseridsList = function() {
  return /** @type {!Array.<number>} */ (jspb.Message.getRepeatedField(this, 2));
};


/** @param {!Array.<number>} value */
proto.msg.MessageActionGroupCreated.prototype.setUseridsList = function(value) {
  jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!number} value
 * @param {number=} opt_index
 */
proto.msg.MessageActionGroupCreated.prototype.addUserids = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


proto.msg.MessageActionGroupCreated.prototype.clearUseridsList = function() {
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
proto.msg.MessageActionGroupTitleChanged = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msg.MessageActionGroupTitleChanged, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.MessageActionGroupTitleChanged.displayName = 'proto.msg.MessageActionGroupTitleChanged';
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
proto.msg.MessageActionGroupTitleChanged.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.MessageActionGroupTitleChanged.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.MessageActionGroupTitleChanged} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionGroupTitleChanged.toObject = function(includeInstance, msg) {
  var f, obj = {
    grouptitle: jspb.Message.getField(msg, 1)
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
 * @return {!proto.msg.MessageActionGroupTitleChanged}
 */
proto.msg.MessageActionGroupTitleChanged.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.MessageActionGroupTitleChanged;
  return proto.msg.MessageActionGroupTitleChanged.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.MessageActionGroupTitleChanged} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.MessageActionGroupTitleChanged}
 */
proto.msg.MessageActionGroupTitleChanged.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setGrouptitle(value);
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
proto.msg.MessageActionGroupTitleChanged.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.MessageActionGroupTitleChanged.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.MessageActionGroupTitleChanged} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionGroupTitleChanged.serializeBinaryToWriter = function(message, writer) {
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
 * required string GroupTitle = 1;
 * @return {string}
 */
proto.msg.MessageActionGroupTitleChanged.prototype.getGrouptitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.msg.MessageActionGroupTitleChanged.prototype.setGrouptitle = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.msg.MessageActionGroupTitleChanged.prototype.clearGrouptitle = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.MessageActionGroupTitleChanged.prototype.hasGrouptitle = function() {
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
proto.msg.MessageActionClearHistory = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msg.MessageActionClearHistory, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.MessageActionClearHistory.displayName = 'proto.msg.MessageActionClearHistory';
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
proto.msg.MessageActionClearHistory.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.MessageActionClearHistory.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.MessageActionClearHistory} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionClearHistory.toObject = function(includeInstance, msg) {
  var f, obj = {
    maxid: jspb.Message.getField(msg, 1)
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
 * @return {!proto.msg.MessageActionClearHistory}
 */
proto.msg.MessageActionClearHistory.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.MessageActionClearHistory;
  return proto.msg.MessageActionClearHistory.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.MessageActionClearHistory} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.MessageActionClearHistory}
 */
proto.msg.MessageActionClearHistory.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setMaxid(value);
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
proto.msg.MessageActionClearHistory.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.MessageActionClearHistory.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.MessageActionClearHistory} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionClearHistory.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeInt64(
      1,
      f
    );
  }
};


/**
 * required int64 MaxID = 1;
 * @return {number}
 */
proto.msg.MessageActionClearHistory.prototype.getMaxid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.msg.MessageActionClearHistory.prototype.setMaxid = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.msg.MessageActionClearHistory.prototype.clearMaxid = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.msg.MessageActionClearHistory.prototype.hasMaxid = function() {
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
proto.msg.MessageActionContactRegistered = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.msg.MessageActionContactRegistered, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.msg.MessageActionContactRegistered.displayName = 'proto.msg.MessageActionContactRegistered';
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
proto.msg.MessageActionContactRegistered.prototype.toObject = function(opt_includeInstance) {
  return proto.msg.MessageActionContactRegistered.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.msg.MessageActionContactRegistered} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionContactRegistered.toObject = function(includeInstance, msg) {
  var f, obj = {

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
 * @return {!proto.msg.MessageActionContactRegistered}
 */
proto.msg.MessageActionContactRegistered.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.msg.MessageActionContactRegistered;
  return proto.msg.MessageActionContactRegistered.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.msg.MessageActionContactRegistered} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.msg.MessageActionContactRegistered}
 */
proto.msg.MessageActionContactRegistered.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.msg.MessageActionContactRegistered.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.msg.MessageActionContactRegistered.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.msg.MessageActionContactRegistered} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.msg.MessageActionContactRegistered.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


goog.object.extend(exports, proto.msg);
