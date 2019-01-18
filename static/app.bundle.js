webpackJsonp([0],{

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var parser = __webpack_require__(50);
var Emitter = __webpack_require__(49);

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport(opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

/***/ }),

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// browser shim for xmlhttprequest module

var hasCORS = __webpack_require__(349);

module.exports = function (opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) {}

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) {}

  if (!xdomain) {
    try {
      return new global[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
    } catch (e) {}
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

  var isValidElement = function isValidElement(object) {
    return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(468)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(467)();
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var debug = __webpack_require__(578)('socket.io-parser');
var Emitter = __webpack_require__(49);
var hasBin = __webpack_require__(170);
var binary = __webpack_require__(577);
var isArray = __webpack_require__(269);
var isBuf = __webpack_require__(268);

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = ['CONNECT', 'DISCONNECT', 'EVENT', 'ACK', 'ERROR', 'BINARY_EVENT', 'BINARY_ACK'];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function (obj, callback) {
  if ((obj.type === exports.EVENT || obj.type === exports.ACK) && hasBin(obj.data)) {
    obj.type = obj.type === exports.EVENT ? exports.BINARY_EVENT : exports.BINARY_ACK;
  }

  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    encodeAsBinary(obj, callback);
  } else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {

  // first is type
  var str = '' + obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    str += obj.attachments + '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' !== obj.nsp) {
    str += obj.nsp + ',';
  }

  // immediately followed by the id
  if (null != obj.id) {
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    str += JSON.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function (obj) {
  var packet;
  if (typeof obj === 'string') {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) {
      // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else {
      // non-binary full packet
      this.emit('decoded', packet);
    }
  } else if (isBuf(obj) || obj.base64) {
    // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) {
        // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  } else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var i = 0;
  // look up type
  var p = {
    type: Number(str.charAt(0))
  };

  if (null == exports.types[p.type]) {
    return error('unknown packet type ' + p.type);
  }

  // look up attachments if type binary
  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
    var buf = '';
    while (str.charAt(++i) !== '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) !== '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' === str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' === c) break;
      p.nsp += c;
      if (i === str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i === str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    var payload = tryParse(str.substr(i));
    var isPayloadValid = payload !== false && (p.type === exports.ERROR || isArray(payload));
    if (isPayloadValid) {
      p.data = payload;
    } else {
      return error('invalid payload');
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return false;
  }
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function () {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function (binData) {
  this.buffers.push(binData);
  if (this.buffers.length === this.reconPack.attachments) {
    // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function () {
  this.reconPack = null;
  this.buffers = [];
};

function error(msg) {
  return {
    type: exports.ERROR,
    data: 'parser error: ' + msg
  };
}

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function (obj, fn) {
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function () {
    return fn.apply(obj, args.concat(slice.call(arguments)));
  };
};

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Module dependencies
 */

var XMLHttpRequest = __webpack_require__(102);
var XHR = __webpack_require__(328);
var JSONP = __webpack_require__(327);
var websocket = __webpack_require__(329);

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var Transport = __webpack_require__(101);
var parseqs = __webpack_require__(76);
var parser = __webpack_require__(50);
var inherit = __webpack_require__(69);
var yeast = __webpack_require__(271);
var debug = __webpack_require__(70)('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = function () {
  var XMLHttpRequest = __webpack_require__(102);
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
}();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling(opts) {
  var forceBase64 = opts && opts.forceBase64;
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause() {
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug('polling got data %s', data);
  var callback = function callback(packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close() {
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function callbackfn() {
    self.writable = true;
    self.emit('drain');
  };

  parser.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && ('https' === schema && Number(this.port) !== 443 || 'http' === schema && Number(this.port) !== 80)) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/***/ }),

/***/ 170:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global Blob File */

/*
 * Module requirements.
 */

var isArray = __webpack_require__(348);

var toString = Object.prototype.toString;
var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Supports Buffer, ArrayBuffer, Blob and File.
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(obj) {
  if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
    return false;
  }

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }

  if (typeof global.Buffer === 'function' && global.Buffer.isBuffer && global.Buffer.isBuffer(obj) || typeof global.ArrayBuffer === 'function' && obj instanceof ArrayBuffer || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File) {
    return true;
  }

  // see: https://github.com/Automattic/has-binary/pull/4
  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }

  return false;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var indexOf = [].indexOf;

module.exports = function (arr, obj) {
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),

/***/ 193:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(123);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = __webpack_require__(16);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utils = __webpack_require__(464);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/** An wrapper component to wrap element which need to shifted to head **/
var MetaTags = function (_Component) {
  _inherits(MetaTags, _Component);

  function MetaTags() {
    _classCallCheck(this, MetaTags);

    return _possibleConstructorReturn(this, (MetaTags.__proto__ || Object.getPrototypeOf(MetaTags)).apply(this, arguments));
  }

  _createClass(MetaTags, [{
    key: 'extractChildren',
    value: function extractChildren() {
      var extract = this.context.extract;

      if (extract) {
        extract(this.props.children);
        return;
      }
    }
  }, {
    key: 'handleChildrens',
    value: function handleChildrens() {
      var _this2 = this;

      var children = this.props.children;

      if (this.context.extract) {
        return;
      }

      var headComponent = _react2.default.createElement('div', { className: 'react-head-temp' }, children);

      var temp = document.createElement("div");
      _reactDom2.default.render(headComponent, temp, function () {
        var childStr = temp.innerHTML;

        //if html is not changed return
        if (_this2.lastChildStr === childStr) {
          return;
        }

        _this2.lastChildStr = childStr;

        var childNodes = Array.prototype.slice.call(temp.querySelector('.react-head-temp').children);

        var head = document.head;
        var headHtml = head.innerHTML;

        //filter children remove if children has not been changed
        childNodes = childNodes.filter(function (child) {
          return headHtml.indexOf((0, _utils.getDomAsString)(child)) === -1;
        });

        //remove duplicate title and meta from head
        childNodes.forEach(function (child) {
          var tag = child.tagName.toLowerCase();
          if (tag === 'title') {
            var title = (0, _utils.getDuplicateTitle)();
            if (title) (0, _utils.removeChild)(head, title);
          } else if (tag === 'meta') {
            var meta = (0, _utils.getDuplicateMeta)(child);
            if (meta) (0, _utils.removeChild)(head, meta);
          }
        });

        (0, _utils.appendChild)(document.head, childNodes);
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleChildrens();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(oldProps) {
      if (oldProps.children !== this.props.children) {
        this.handleChildrens();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.extractChildren();
      return null;
    }
  }]);

  return MetaTags;
}(_react.Component);

MetaTags.contextTypes = {
  extract: _propTypes2.default.func
};
exports.default = MetaTags;

/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(121);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(581);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),

/***/ 264:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Module dependencies.
 */

var url = __webpack_require__(574);
var parser = __webpack_require__(152);
var Manager = __webpack_require__(265);
var debug = __webpack_require__(94)('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup(uri, opts) {
  if ((typeof uri === 'undefined' ? 'undefined' : _typeof(uri)) === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] || false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = __webpack_require__(265);
exports.Socket = __webpack_require__(267);

/***/ }),

/***/ 265:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Module dependencies.
 */

var eio = __webpack_require__(325);
var Socket = __webpack_require__(267);
var Emitter = __webpack_require__(49);
var parser = __webpack_require__(152);
var on = __webpack_require__(266);
var bind = __webpack_require__(154);
var debug = __webpack_require__(94)('socket.io-client:manager');
var indexOf = __webpack_require__(176);
var Backoff = __webpack_require__(287);

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager(uri, opts) {
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && 'object' === (typeof uri === 'undefined' ? 'undefined' : _typeof(uri))) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  var _parser = opts.parser || parser;
  this.encoder = new _parser.Encoder();
  this.decoder = new _parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function () {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function () {
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.generateId(nsp);
    }
  }
};

/**
 * generate `socket.id` for the given `nsp`
 *
 * @param {String} nsp
 * @return {String}
 * @api private
 */

Manager.prototype.generateId = function (nsp) {
  return (nsp === '/' ? '' : nsp + '#') + this.engine.id;
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function (v) {
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function (v) {
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function (v) {
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function (v) {
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function (v) {
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function (v) {
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function () {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};

/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open = Manager.prototype.connect = function (fn, opts) {
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function (data) {
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function () {
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function destroy() {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function () {
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function () {
  this.lastPing = new Date();
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function () {
  this.emitAll('pong', new Date() - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function (data) {
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function (err) {
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function (nsp, opts) {
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp, opts);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function () {
      socket.id = self.generateId(nsp);
    });

    if (this.autoConnect) {
      // manually call here since connecting event is fired before listening
      onConnecting();
    }
  }

  function onConnecting() {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function (socket) {
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function (packet) {
  debug('writing packet %j', packet);
  var self = this;
  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function (encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else {
    // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function () {
  debug('cleanup');

  var subsLength = this.subs.length;
  for (var i = 0; i < subsLength; i++) {
    var sub = this.subs.shift();
    sub.destroy();
  }

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close = Manager.prototype.disconnect = function () {
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' === this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function (reason) {
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function () {
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function () {
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function (err) {
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function destroy() {
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function () {
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};

/***/ }),

/***/ 266:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function destroy() {
      obj.removeListener(ev, fn);
    }
  };
}

/***/ }),

/***/ 267:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Module dependencies.
 */

var parser = __webpack_require__(152);
var Emitter = __webpack_require__(49);
var toArray = __webpack_require__(582);
var on = __webpack_require__(266);
var bind = __webpack_require__(154);
var debug = __webpack_require__(94)('socket.io-client:socket');
var parseqs = __webpack_require__(76);

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket(io, nsp, opts) {
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  if (opts && opts.query) {
    this.query = opts.query;
  }
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function () {
  if (this.subs) return;

  var io = this.io;
  this.subs = [on(io, 'open', bind(this, 'onopen')), on(io, 'packet', bind(this, 'onpacket')), on(io, 'close', bind(this, 'onclose'))];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open = Socket.prototype.connect = function () {
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' === this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function () {
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function (ev) {
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var packet = { type: parser.EVENT, data: args };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' === typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  delete this.flags;

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function (packet) {
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function () {
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' !== this.nsp) {
    if (this.query) {
      var query = _typeof(this.query) === 'object' ? parseqs.encode(this.query) : this.query;
      debug('sending connect packet with query %s', query);
      this.packet({ type: parser.CONNECT, query: query });
    } else {
      this.packet({ type: parser.CONNECT });
    }
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function (reason) {
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function (packet) {
  if (packet.nsp !== this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function (packet) {
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function (id) {
  var self = this;
  var sent = false;
  return function () {
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    self.packet({
      type: parser.ACK,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function (packet) {
  var ack = this.acks[packet.id];
  if ('function' === typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function () {
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function () {
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function () {
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function () {
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close = Socket.prototype.disconnect = function () {
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function (compress) {
  this.flags = this.flags || {};
  this.flags.compress = compress;
  return this;
};

/***/ }),

/***/ 268:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && (obj instanceof ArrayBuffer || ArrayBuffer.isView(obj));
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 269:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),

/***/ 271:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),
    length = 64,
    map = {},
    seed = 0,
    i = 0,
    prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now + '.' + encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) {
  map[alphabet[i]] = i;
} //
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;

/***/ }),

/***/ 272:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.List = exports.Chat = exports.MessageList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarAndModules = function (_React$Component) {
    _inherits(BarAndModules, _React$Component);

    function BarAndModules(props) {
        _classCallCheck(this, BarAndModules);

        var _this = _possibleConstructorReturn(this, (BarAndModules.__proto__ || Object.getPrototypeOf(BarAndModules)).call(this, props));

        _this.state = {
            HideALl: true
        };
        _this.HideAll = _this.HideAll.bind(_this);

        return _this;
    }

    _createClass(BarAndModules, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'HideAll',
        value: function HideAll() {
            this.setState({ HideALl: !this.state.HideALl });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // clearInterval(Clock);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'StatusBar' },
                    _react2.default.createElement(
                        'div',
                        { className: 'StatusBarLeft' },
                        _react2.default.createElement(
                            'p',
                            null,
                            '\u0421\u043A\u0440\u044B\u0442\u044C'
                        ),
                        _react2.default.createElement('input', { type: 'checkbox', className: 'checkbox', id: 'checkbox-2', onChange: this.HideAll }),
                        _react2.default.createElement('label', { htmlFor: 'checkbox-2' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'StatusBarCenter' },
                        _react2.default.createElement(
                            'div',
                            { className: 'currentTime' },
                            curDateDisp()
                        )
                    )
                ),
                this.state.HideALl && _react2.default.createElement(
                    'div',
                    { className: 'chatandlist' },
                    _react2.default.createElement(
                        'div',
                        { className: 'chat', id: 'Chat' },
                        _react2.default.createElement(Chat, { className: 'chat', id: 'Chat' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'list', id: 'List' },
                        _react2.default.createElement(EventsBlockOnMainPage, null)
                    )
                )
            );
        }
    }]);

    return BarAndModules;
}(_react2.default.Component);

exports.default = BarAndModules;

var MessageList = exports.MessageList = function (_React$Component2) {
    _inherits(MessageList, _React$Component2);

    function MessageList() {
        _classCallCheck(this, MessageList);

        return _possibleConstructorReturn(this, (MessageList.__proto__ || Object.getPrototypeOf(MessageList)).apply(this, arguments));
    }

    _createClass(MessageList, [{
        key: 'render',
        value: function render() {
            var i = 0;
            var messageComponents = this.props.RoomMessages.map(function (message) {
                return _react2.default.createElement(
                    'div',
                    { className: 'messageBig', key: i++ },
                    _react2.default.createElement('hr', null),
                    _react2.default.createElement(
                        'div',
                        { className: 'messageR1', key: i++ },
                        message.dateTime
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'messageR2', key: i++ },
                        message.author,
                        ' :'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'messageR3', key: i++ },
                        message.messageText
                    )
                );
            });
            return _react2.default.createElement(
                'div',
                null,
                messageComponents
            );
        }
    }]);

    return MessageList;
}(_react2.default.Component);

;

var Chat = exports.Chat = function (_React$Component3) {
    _inherits(Chat, _React$Component3);

    function Chat(props) {
        _classCallCheck(this, Chat);

        var _this3 = _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).call(this, props));

        _this3.state = {
            BeforeJoin: true,
            SaintPRoom: false,
            Moscowroom: false,
            RoomMessages: [{
                author: '',
                messageText: '',
                dateTime: ''
            }],
            Message: ''
        };
        _this3.OpenSaintPRoom = _this3.OpenSaintPRoom.bind(_this3);
        _this3.MessageReceived = _this3.MessageReceived.bind(_this3);
        _this3.OpenMoscowRoom = _this3.OpenMoscowRoom.bind(_this3);
        _this3.BacktoRooms = _this3.BacktoRooms.bind(_this3);
        _this3.SendMeassgesSpb = _this3.SendMeassgesSpb.bind(_this3);
        _this3.SendMeassgesMSC = _this3.SendMeassgesMSC.bind(_this3);
        _this3.ChangeMessage1 = _this3.ChangeMessage1.bind(_this3);
        _this3.ChangeMessage2 = _this3.ChangeMessage2.bind(_this3);
        _this3.Keypress1 = _this3.Keypress1.bind(_this3);
        _this3.Keypress2 = _this3.Keypress2.bind(_this3);
        return _this3;
    }

    _createClass(Chat, [{
        key: 'OpenSaintPRoom',
        value: function OpenSaintPRoom() {
            this.setState({ BeforeJoin: false, SaintPRoom: true });
            SPBGetMeassges(this.MessageReceived);
        }
    }, {
        key: 'MessageReceived',
        value: function MessageReceived(messages) {
            this.setState({ RoomMessages: messages });
        }
    }, {
        key: 'OpenMoscowRoom',
        value: function OpenMoscowRoom() {
            this.setState({ BeforeJoin: false, Moscowroom: true });
            MSCGetMeassges(this.MessageReceived);
        }
    }, {
        key: 'BacktoRooms',
        value: function BacktoRooms() {
            stopInterval();
            this.setState({ BeforeJoin: true, Moscowroom: false, SaintPRoom: false, RoomMessages: [] });
        }
    }, {
        key: 'SendMeassgesSpb',
        value: function (_SendMeassgesSpb) {
            function SendMeassgesSpb() {
                return _SendMeassgesSpb.apply(this, arguments);
            }

            SendMeassgesSpb.toString = function () {
                return _SendMeassgesSpb.toString();
            };

            return SendMeassgesSpb;
        }(function () {
            SendMeassgesSpb(this.state.Message);
            document.getElementById("Message").value = '';
            this.setState({ Message: '' });
        })
    }, {
        key: 'SendMeassgesMSC',
        value: function (_SendMeassgesMSC) {
            function SendMeassgesMSC() {
                return _SendMeassgesMSC.apply(this, arguments);
            }

            SendMeassgesMSC.toString = function () {
                return _SendMeassgesMSC.toString();
            };

            return SendMeassgesMSC;
        }(function () {
            SendMeassgesMSC(this.state.Message);
            document.getElementById("Message2").value = '';
            this.setState({ Message: '' });
        })
    }, {
        key: 'ChangeMessage1',
        value: function ChangeMessage1() {
            this.setState({ Message: document.getElementById("Message").value });
        }
    }, {
        key: 'ChangeMessage2',
        value: function ChangeMessage2() {
            this.setState({ Message: document.getElementById("Message2").value });
        }
    }, {
        key: 'Keypress1',
        value: function Keypress1(event) {
            if (event.keyCode == 13) {
                this.SendMeassgesSpb();
            }
        }
    }, {
        key: 'Keypress2',
        value: function Keypress2(event) {
            if (event.keyCode == 13) {
                this.SendMeassgesMSC();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                this.state.BeforeJoin && _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'div',
                        { className: 'chatlabel' },
                        '\u041E\u043D\u043B\u0430\u0439\u043D | 890 \u0447\u0435\u043B\u043E\u0432\u0435\u043A'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'SaintProom', onClick: this.OpenSaintPRoom },
                        _react2.default.createElement('img', { src: '/images/SpbLogo.png' })
                    ),
                    _react2.default.createElement('hr', { className: 'hrlobby' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'Moscowroom', onClick: this.OpenMoscowRoom },
                        _react2.default.createElement('img', { src: '/images/MSCLogo.png' })
                    )
                ),
                this.state.SaintPRoom && _react2.default.createElement(
                    'div',
                    { className: 'room' },
                    _react2.default.createElement(
                        'div',
                        { className: 'chatMenu' },
                        _react2.default.createElement(
                            'div',
                            { className: 'leftbutton', onClick: this.BacktoRooms },
                            '\u2190'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'chatlabel' },
                        '\u041F\u0430\u0431',
                        _react2.default.createElement('hr', { color: '#6dcff6' }),
                        _react2.default.createElement(
                            'span',
                            null,
                            '\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'RoomMessages', id: 'divMessages' },
                        _react2.default.createElement(MessageList, { RoomMessages: this.state.RoomMessages })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'SendMessage' },
                        _react2.default.createElement(
                            'div',
                            { className: 'SendingUser' },
                            '\u042F:'
                        ),
                        _react2.default.createElement('textarea', { className: 'Message', id: 'Message', placeholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435...(\u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 150 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)   ', onChange: this.ChangeMessage1, onKeyDown: this.Keypress1 }),
                        _react2.default.createElement(
                            'div',
                            { className: 'SendButton', onClick: this.SendMeassgesSpb },
                            'Send'
                        )
                    )
                ),
                this.state.Moscowroom && _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'div',
                        { className: 'chatMenu' },
                        _react2.default.createElement(
                            'div',
                            { className: 'leftbutton', onClick: this.BacktoRooms },
                            '\u2190'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'chatlabel' },
                        '\u041F\u0430\u0431',
                        _react2.default.createElement('hr', { color: '#6dcff6' }),
                        _react2.default.createElement(
                            'span',
                            null,
                            '\u041C\u043E\u0441\u043A\u0432\u0430'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'RoomMessages', id: 'divMessages' },
                        _react2.default.createElement(MessageList, { RoomMessages: this.state.RoomMessages })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'SendMessage' },
                        _react2.default.createElement(
                            'div',
                            { className: 'SendingUser' },
                            '\u042F:'
                        ),
                        _react2.default.createElement('textarea', { className: 'Message', id: 'Message2', placeholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435...(\u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 150 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)', onChange: this.ChangeMessage2, onKeyDown: this.Keypress2 }),
                        _react2.default.createElement(
                            'div',
                            { className: 'SendButton', onClick: this.SendMeassgesMSC },
                            'Send'
                        )
                    )
                )
            );
        }
    }]);

    return Chat;
}(_react2.default.Component);

;

var List = exports.List = function (_React$Component4) {
    _inherits(List, _React$Component4);

    function List(props) {
        _classCallCheck(this, List);

        var _this4 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        _this4.state = {
            EventReceived: [],
            loading: true
        };

        return _this4;
    }

    _createClass(List, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            $.when($.ajax({
                url: "/GetEventEasy/",
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {

                this.setState({ EventReceived: data, loading: false });
            }.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.loading) {
                return _react2.default.createElement(
                    'div',
                    { className: 'loadingState' },
                    '        ',
                    _react2.default.createElement(
                        'div',
                        { className: 'sk-folding-cube' },
                        _react2.default.createElement('div', { className: 'sk-cube1 sk-cube' }),
                        _react2.default.createElement('div', { className: 'sk-cube2 sk-cube' }),
                        _react2.default.createElement('div', { className: 'sk-cube4 sk-cube' }),
                        _react2.default.createElement('div', { className: 'sk-cube3 sk-cube' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'loadinglabel' },
                        '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E...'
                    )
                );
            } else {
                var ResultsComponents = this.state.EventReceived.map(function (Event) {
                    if (!Event.PhotoURL) {
                        Event.PhotoURL = '../images/fav.png';
                    }
                    console.log(Event);
                    var divStyle = {
                        float: "left",
                        backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.65),rgba(29, 44, 70, 0.65)),url(' + Event.PhotoURL + ')'

                    };
                    var divStyle1 = {
                        float: "left",
                        backgroundImage: 'url(' + Event.CreatorPhoto + ')'

                    };
                    return _react2.default.createElement(
                        'div',
                        { className: 'polaroid' },
                        _react2.default.createElement(
                            'a',
                            { href: '/Event/' + Event.EventId, target: '_blank', key: Event.EventId },
                            _react2.default.createElement(
                                'div',
                                { style: divStyle, className: 'photoPolaroid' },
                                ' ',
                                _react2.default.createElement(
                                    'p',
                                    { style: divStyle1, className: 'CreatorPhotoTitle' },
                                    ' '
                                ),
                                _react2.default.createElement('br', null),
                                _react2.default.createElement('br', null),
                                ' ',
                                _react2.default.createElement(
                                    'p',
                                    { className: 'ObyavNameTitle' },
                                    Event.Name
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'textContainer' },
                                _react2.default.createElement(
                                    'div',
                                    { className: '' },
                                    ' ',
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        Event.Category,
                                        ' '
                                    )
                                ),
                                _react2.default.createElement(
                                    'p',
                                    { className: '' },
                                    Event.date[0],
                                    Event.date[1] && _react2.default.createElement(
                                        'span',
                                        null,
                                        ' - ',
                                        Event.date[1]
                                    )
                                ),
                                _react2.default.createElement('p', { className: '', dangerouslySetInnerHTML: { __html: Event.Desc } })
                            )
                        )
                    );
                }.bind(this));

                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'div',
                        { className: 'listlabel' },
                        _react2.default.createElement(
                            'b',
                            null,
                            '\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439 '
                        ),
                        '| 33 \u0437\u0430 \u044D\u0442\u0443 \u043D\u0435\u0434\u0435\u043B\u044E'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'ListContent' },
                        ResultsComponents
                    ),
                    _react2.default.createElement(
                        _reactRouter.Link,
                        { to: '/CreateEvent' },
                        _react2.default.createElement(
                            'div',
                            { className: 'createListButton' },
                            '\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435'
                        )
                    )
                );
            }
        }
    }]);

    return List;
}(_react2.default.Component);

;

/***/ }),

/***/ 273:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(602);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Chats.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Chats.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 274:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(605);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./EventsBlockOnMainPage.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./EventsBlockOnMainPage.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 275:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

var _reactMetaTags = __webpack_require__(53);

var _reactMetaTags2 = _interopRequireDefault(_reactMetaTags);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _Chats = __webpack_require__(273);

var _Chats2 = _interopRequireDefault(_Chats);

var _ChatList = __webpack_require__(614);

var _ChatList2 = _interopRequireDefault(_ChatList);

var _EventsBlockOnMainPage = __webpack_require__(274);

var _EventsBlockOnMainPage2 = _interopRequireDefault(_EventsBlockOnMainPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chats = function (_React$Component) {
    _inherits(Chats, _React$Component);

    function Chats(props) {
        _classCallCheck(this, Chats);

        var _this = _possibleConstructorReturn(this, (Chats.__proto__ || Object.getPrototypeOf(Chats)).call(this, props));

        _this.state = {
            LoadItems: 10,
            Items: [],
            Searchvalue: '',
            EvrethingIsLoaded: "false"
        };
        _this.LoadMore = _this.LoadMore.bind(_this);
        _this.LoadMore();
        _this.handleChange = _this.handleChange.bind(_this);

        return _this;
    }

    _createClass(Chats, [{
        key: 'LoadMore',
        value: function LoadMore() {
            $.when($.ajax({
                url: "/GetChats/",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ Items: this.state.LoadItems, CountOfLoad: 10 }),
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {
                if (data !== "End") {
                    this.setState({ Items: this.state.Items.concat(data) });
                    this.setState({ LoadItems: this.state.LoadItems + 10 });
                    this.setState({ EvrethingIsLoaded: "false" });
                } else {
                    this.setState({ EvrethingIsLoaded: "true" });
                }
            }.bind(this));
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            this.setState({ Searchvalue: event.target.value });
            if (event.target.value != '') {
                $.when($.ajax({
                    url: "/FindChats/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ KeyWorld: event.target.value }),
                    dataType: 'json'
                })).then(function (data, textStatus, jqXHR) {
                    this.setState({ Items: data, EvrethingIsLoaded: "search", LoadItems: 10 });
                }.bind(this));
            } else {
                this.setState({ Items: [] });
                this.LoadMore();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var metaTitle = 'NightBrowser-Чаты';
            var ResultsComponentsChats = this.state.Items.map(function (Chat) {
                if (!Chat.PhotoURL) {
                    Chat.PhotoURL = '../images/fav.png';
                }

                var divStyle = {
                    float: "left",
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.65),rgba(29, 44, 70, 0.65)),url(' + Chat.PhotoURL + ')'

                };
                var divStyle1 = {
                    float: "left"

                };
                return _react2.default.createElement(
                    'div',
                    { className: 'ChatBlockOnMainPage', id: Chat.ChatsId },
                    _react2.default.createElement(
                        _reactRouter.Link,
                        { to: '/Chats/' + Chat.ChatsId, style: divStyle, className: 'ChatBlockOnHover', id: Chat.ChatsId },
                        '\u041E\u0442\u043A\u0440\u044B\u0442\u044C'
                    ),
                    _react2.default.createElement(
                        'div',
                        { key: Chat.ChatsId },
                        _react2.default.createElement(
                            'div',
                            { style: divStyle, className: 'ChatsPrimaryBlockOnMainPageContentBlockphoto' },
                            ' ',
                            _react2.default.createElement(
                                'p',
                                { style: divStyle1, className: 'ChatsPopularityOnChatsPage' },
                                ' ',
                                Chat.Private == "0" && Chat.Popularity,
                                ' ',
                                Chat.Private == "1" && _react2.default.createElement('i', { className: 'fa fa-lock', 'aria-hidden': 'true' }),
                                ' '
                            ),
                            _react2.default.createElement('br', null),
                            _react2.default.createElement('br', null),
                            ' ',
                            _react2.default.createElement(
                                'p',
                                { className: 'ChatsPrimaryBlockOnMainPageContentBlockObyavNameTitle' },
                                Chat.Name
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsPrimaryBlockOnMainPageContentBlockText' },
                            _react2.default.createElement('p', { className: '', dangerouslySetInnerHTML: { __html: Chat.Description } })
                        )
                    )
                );
            }.bind(this));
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _reactMetaTags2.default,
                    null,
                    _react2.default.createElement(_reactMetaTags.ReactTitle, { title: metaTitle }),
                    _react2.default.createElement('meta', { name: 'description', content: '\u0412\u044B \u043C\u043E\u0436\u0435\u0435\u0442\u0435 \u043F\u043E\u043E\u0431\u0449\u0430\u0442\u044C\u0441\u044F \u0441 \u043B\u044E\u0434\u044C\u043C\u0438 \u043F\u043E \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u0443\u044E\u0449\u0438\u043C \u0432\u0430\u0441 \u0442\u0435\u043C\u0430\u043C \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u0442\u0430\u043A ' }),
                    _react2.default.createElement('meta', { property: 'og:title', content: '\u0427\u0430\u0442\u044B NightBrowser' })
                ),
                _react2.default.createElement(_Header2.default, null),
                _react2.default.createElement(
                    'div',
                    { className: 'content contentChat' },
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsBlockLabel' },
                            '\u0427\u0430\u0442\u044B \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 '
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'FindChatBlock' },
                            _react2.default.createElement('input', { type: 'text', value: this.state.Searchvalue, onChange: this.handleChange, className: 'SearchInputInChats' }),
                            _react2.default.createElement(
                                'div',
                                { className: 'SearchPoint', onClick: this.handleChange },
                                _react2.default.createElement('i', { className: 'fa fa-search poisk  ', 'aria-hidden': 'true' })
                            ),
                            _react2.default.createElement('br', null)
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsBlockSwitcher' },
                            ' \u041D\u043E\u0432\u044B\u0435',
                            _react2.default.createElement('input', { id: 'cb4', className: 'tgl1 tgl-flat1', type: 'checkbox', onChange: this.ChatSort }),
                            _react2.default.createElement('label', { className: 'tgl-btn1', htmlFor: 'cb4' }),
                            '\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsBlockMain' },
                            ResultsComponentsChats
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsBlockLabel widthFix' },
                            this.state.EvrethingIsLoaded == "false" && _react2.default.createElement(
                                'div',
                                { type: 'button', className: 'EventsPrimaryBlockOnMainPageViewNearest ', onClick: this.LoadMore },
                                '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0435\u0449\u0435'
                            ),
                            this.state.EvrethingIsLoaded == "true" && _react2.default.createElement(
                                'div',
                                { className: 'EventsPrimaryBlockOnMainPageViewNearest', onClick: this.LoadMore },
                                '\u0412\u0441\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Chats;
}(_react2.default.Component);

exports.default = Chats;
;

/***/ }),

/***/ 276:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _socket = __webpack_require__(264);

var _socket2 = _interopRequireDefault(_socket);

var _reactMetaTags = __webpack_require__(53);

var _reactMetaTags2 = _interopRequireDefault(_reactMetaTags);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _Chats = __webpack_require__(273);

var _Chats2 = _interopRequireDefault(_Chats);

var _reactRouter = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChatsPage = function (_React$Component) {
    _inherits(ChatsPage, _React$Component);

    function ChatsPage(props) {
        _classCallCheck(this, ChatsPage);

        var _this = _possibleConstructorReturn(this, (ChatsPage.__proto__ || Object.getPrototypeOf(ChatsPage)).call(this, props));

        _this.state = {
            ChatData: {},
            username: '',
            Message: '',
            messages: [],
            NewMessage: false,
            LoadItems: 15,
            EvrethingIsLoaded: false,
            NotAuth: false,
            firstTime: true,
            DescStyle: {
                opacity: '0',
                marginTop: '-10px',
                transition: '0.2s'
            }
        };
        _this.LoadMore = _this.LoadMore.bind(_this);
        _this.scrollImidiatly = _this.scrollImidiatly.bind(_this);

        _this.Scroll = _this.Scroll.bind(_this);
        _this.scrollToDown = _this.scrollToDown.bind(_this);
        _this.KeyPressArea = _this.KeyPressArea.bind(_this);
        _this.Desc = _this.Desc.bind(_this);
        fetch('/ChatData/' + _this.props.params.id).then(function (response) {
            return response.json();
        }).then(function (ChatData) {
            if (ChatData === true) {
                window.location.replace("/");
            } else _this.setState({ ChatData: ChatData }); // all the attributes of the bug are top level state items
        });

        _this.LoadMore();
        _this.socket = (0, _socket2.default)('http://nightbrowser.ru:80');
        _this.socket.on('connect', function () {
            // Connected, let's sign-up for to receive messages for this room
            this.socket.emit('room', this.props.params.id);
            // scrollint1();
            this.scrollToDown();
        }.bind(_this));
        _this.socket.on('RECEIVE_MESSAGE', function (data) {

            addMessage(data);
            this.scrollToDown();
        }.bind(_this));
        var addMessage = function addMessage(data) {
            _this.setState({ messages: [].concat(_toConsumableArray(_this.state.messages), [data]) });
        };
        _this.sendMessage = function (ev) {

            ev.preventDefault();
            if (_this.state.Message !== "") _this.socket.emit('SEND_MESSAGE', {
                Author: _this.state.username,
                Message: _this.state.Message,
                roomId: _this.props.params.id
            });
            _this.setState({ Message: '' });
            var el = _this.refs.DisplayMessages;
            el.scrollTop = el.scrollHeight;
        };
        return _this;
    }

    _createClass(ChatsPage, [{
        key: 'LoadMore',
        value: function LoadMore() {
            console.log(this.state.LoadItems + 15);
            $.when($.ajax({
                url: "/ChatDataMessages/",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ id: this.props.params.id, Items: this.state.LoadItems, CountOfLoad: 15 }),
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {
                if (data !== "End") {
                    this.setState({ messages: this.state.messages.reverse() });
                    this.setState({ messages: this.state.messages.concat(data) });
                    this.setState({ LoadItems: this.state.LoadItems + 15 });
                    this.setState({ messages: this.state.messages.reverse() });
                } else {
                    this.setState({ EvrethingIsLoaded: true });
                }
            }.bind(this));
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {

            if (id != "") {
                ajaxReq("/loginCheck/", { UsrId: id,
                    UsrPass: getCookieMd5Pass() }, function (userData) {
                    if (userData != '0') {
                        this.setState({ username: userData.NBID });
                    } else {
                        this.setState({ NotAuth: true });
                    }
                }.bind(this));
            } else {
                this.setState({ NotAuth: true });
            }
            this.scrollToDown();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {}
    }, {
        key: 'scrollToDown',
        value: function scrollToDown() {
            var el = this.refs.DisplayMessages;

            if (el.scrollHeight - 850 < el.scrollTop || this.state.firstTime) {
                el.scrollTop = el.scrollHeight;
                setTimeout(function () {
                    this.setState({ firstTime: false });
                }.bind(this), 1000);
            } else {
                this.setState({ NewMessage: true });
            }
        }
    }, {
        key: 'scrollImidiatly',
        value: function scrollImidiatly() {
            var el = this.refs.DisplayMessages;
            el.scrollTop = el.scrollHeight;
            this.setState({ NewMessage: false });
        }
    }, {
        key: 'Scroll',
        value: function Scroll() {
            var el = this.refs.DisplayMessages;

            if (el.scrollTop + 800 > el.scrollHeight) {
                this.setState({ NewMessage: false });
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({ LoadItems: 15 });
        }
    }, {
        key: 'Desc',
        value: function Desc() {
            if (this.state.DescStyle.opacity === '1') {
                this.setState({ DescStyle: {
                        opacity: '0',
                        marginTop: '-10px',
                        transition: '0.2s'

                    } });
            } else {
                this.setState({ DescStyle: {
                        opacity: '1',
                        marginTop: '13px'

                    } });
            }
        }
    }, {
        key: 'KeyPressArea',
        value: function KeyPressArea(event) {
            if (event.keyCode == 13) {
                this.sendMessage(event);
                return false; // Just a workaround for old browsers
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var divStyle = void 0;
            if (!this.state.ChatData.PhotoURL) {
                divStyle = {

                    backgroundImage: 'url(../images/fav.png)'
                };
            } else {
                divStyle = {

                    backgroundImage: 'url(' + this.state.ChatData.PhotoURL + ')'
                };
            }

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_Header2.default, null),
                _react2.default.createElement(
                    'div',
                    { className: 'content ChatContnent', style: divStyle },
                    _react2.default.createElement(
                        'div',
                        { className: 'ChatHeader' },
                        _react2.default.createElement(
                            'div',
                            { className: 'ShareInviteToChat', title: '\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F' },
                            _react2.default.createElement('i', { className: 'fa fa-user-plus' })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'NameOfChatAndDesc' },
                            _react2.default.createElement(
                                'span',
                                null,
                                this.state.ChatData.Name
                            ),
                            _react2.default.createElement('br', null),
                            this.state.ChatData.Description && _react2.default.createElement(
                                'div',
                                { className: 'DescButton', onClick: this.Desc },
                                '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 ',
                                _react2.default.createElement('i', { className: 'fa fa-arrow-circle-down' })
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'ChatDesc' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'ChatDescIn', style: this.state.DescStyle },
                                    this.state.ChatData.Description
                                )
                            )
                        ),
                        this.state.ChatData === "Private" && _react2.default.createElement(
                            'div',
                            { className: 'TypeOfPrivacy' },
                            _react2.default.createElement('i', { className: 'fa fa-lock', title: '\u0427\u0430\u0442 \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0439.' })
                        ),
                        this.state.ChatData.Private === 0 && _react2.default.createElement(
                            'div',
                            { className: 'TypeOfPrivacy fixgreen' },
                            _react2.default.createElement('i', { className: 'fa fa-unlock', title: '\u0427\u0430\u0442 \u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0439.' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'BackgroundInfo' },
                        _react2.default.createElement(
                            'div',
                            { className: 'DisplayMessages', id: 'DisplayMessages', ref: 'DisplayMessages', onScroll: this.Scroll },
                            !this.state.EvrethingIsLoaded && _react2.default.createElement(
                                'div',
                                { className: 'LoadMore', onClick: this.LoadMore },
                                ' \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0435\u0449\u0435'
                            ),
                            this.state.messages.map(function (message) {
                                var divStylePhotoUsr = {
                                    backgroundImage: 'url(' + _this2.state.ChatData.PhotoURL + ')'

                                };
                                return _react2.default.createElement(
                                    'div',
                                    { className: 'MessagesBlockMain' },
                                    _react2.default.createElement(
                                        _reactRouter.Link,
                                        { to: '/User/' + message.Author.Id, className: 'LeftSidePhotos', title: message.Author.Name + " " + message.Author.Fam },
                                        _react2.default.createElement('img', { src: message.Author.Photo, className: 'UsrPhotoOnChat', alt: message.Author.Name }),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'PhotoLabel' },
                                            message.Author.Name
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'SelfMessage' },
                                        message.Message
                                    ),
                                    ' '
                                );
                            }),
                            this.state.NewMessage && _react2.default.createElement(
                                'div',
                                { className: 'ScrollDown', onClick: this.scrollImidiatly },
                                ' \u041D\u043E\u0432\u044B\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F'
                            )
                        ),
                        !this.state.NotAuth && _react2.default.createElement(
                            'div',
                            { className: 'BottomMenu' },
                            _react2.default.createElement(
                                'div',
                                { className: 'ChatMessageBottomBarSend' },
                                _react2.default.createElement('textarea', { value: this.state.Message, onChange: function onChange(ev) {
                                        return _this2.setState({ Message: ev.target.value });
                                    }, id: 'Message', onKeyDown: this.KeyPressArea, placeholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435...' }),
                                _react2.default.createElement(
                                    'div',
                                    { onClick: this.sendMessage, className: 'sendMessageButton' },
                                    _react2.default.createElement('i', { className: 'fa fa-american-sign-language-interpreting' })
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ChatsPage;
}(_react2.default.Component);

exports.default = ChatsPage;
;

/***/ }),

/***/ 277:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _footer = __webpack_require__(48);

var _footer2 = _interopRequireDefault(_footer);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _CreateChatContent = __webpack_require__(589);

var _CreateChatContent2 = _interopRequireDefault(_CreateChatContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateChat = function (_React$Component) {
    _inherits(CreateChat, _React$Component);

    function CreateChat(props) {
        _classCallCheck(this, CreateChat);

        var _this = _possibleConstructorReturn(this, (CreateChat.__proto__ || Object.getPrototypeOf(CreateChat)).call(this, props));

        _this.state = {
            Loading: true,
            UserDataId: 0
        };
        _this.load = _this.load.bind(_this);
        return _this;
    }

    _createClass(CreateChat, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            checkCookie(this.load);
        }
    }, {
        key: 'load',
        value: function load(test) {
            if (test != "") {
                this.setState({ Loading: false, UserDataId: id });
            } else {
                window.location.replace("/");
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'MainPage' },
                _react2.default.createElement(_Header2.default, null),
                _react2.default.createElement(_CreateChatContent2.default, { NBID: this.state.UserDataId })
            );
        }
    }]);

    return CreateChat;
}(_react2.default.Component);

exports.default = CreateChat;
;

/***/ }),

/***/ 278:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _footer = __webpack_require__(48);

var _footer2 = _interopRequireDefault(_footer);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _CreateEventContent = __webpack_require__(590);

var _CreateEventContent2 = _interopRequireDefault(_CreateEventContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateEvent = function (_React$Component) {
    _inherits(CreateEvent, _React$Component);

    function CreateEvent(props) {
        _classCallCheck(this, CreateEvent);

        var _this = _possibleConstructorReturn(this, (CreateEvent.__proto__ || Object.getPrototypeOf(CreateEvent)).call(this, props));

        _this.state = {
            Loading: true,
            UserDataId: 0
        };
        _this.load = _this.load.bind(_this);
        return _this;
    }

    _createClass(CreateEvent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            checkCookie(this.load);
        }
    }, {
        key: 'load',
        value: function load(test) {
            if (test != "") {
                this.setState({ Loading: false, UserDataId: id });
            } else {
                window.location.replace("/");
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'MainPage' },
                _react2.default.createElement(_Header2.default, null),
                _react2.default.createElement(_CreateEventContent2.default, { NBID: this.state.UserDataId })
            );
        }
    }]);

    return CreateEvent;
}(_react2.default.Component);

exports.default = CreateEvent;
;

/***/ }),

/***/ 279:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactMetaTags = __webpack_require__(53);

var _reactMetaTags2 = _interopRequireDefault(_reactMetaTags);

var _footer = __webpack_require__(48);

var _footer2 = _interopRequireDefault(_footer);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _EventContent = __webpack_require__(591);

var _EventContent2 = _interopRequireDefault(_EventContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventPage = function (_React$Component) {
    _inherits(EventPage, _React$Component);

    function EventPage(props) {
        _classCallCheck(this, EventPage);

        var _this = _possibleConstructorReturn(this, (EventPage.__proto__ || Object.getPrototypeOf(EventPage)).call(this, props));

        _this.state = {
            Loading: true,
            EventData: {}

        };

        return _this;
    }

    _createClass(EventPage, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            fetch('/EventData/' + this.props.params.id).then(function (response) {
                return response.json();
            }).then(function (EventData) {
                if (EventData === true) {
                    window.location.replace("/");
                } else _this2.setState({ EventData: EventData }); // all the attributes of the bug are top level state items
                _this2.setState({ Loading: false });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.Loading == true) {
                return _react2.default.createElement(
                    'div',
                    null,
                    '...'
                );
            } else {
                var metaTitle = 'NightBrowser-' + this.state.EventData.Name;

                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        _reactMetaTags2.default,
                        null,
                        _react2.default.createElement(_reactMetaTags.ReactTitle, { title: metaTitle }),
                        _react2.default.createElement('meta', { name: 'description', content: this.state.EventData.Description }),
                        _react2.default.createElement('meta', { property: 'og:title', content: metaTitle }),
                        _react2.default.createElement('meta', { property: 'og:image', content: 'images/fav.png' })
                    ),
                    _react2.default.createElement(_Header2.default, null),
                    _react2.default.createElement(_EventContent2.default, { EventData: this.state.EventData })
                );
            }
        }
    }]);

    return EventPage;
}(_react2.default.Component);

exports.default = EventPage;
;

/***/ }),

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _footer = __webpack_require__(48);

var _footer2 = _interopRequireDefault(_footer);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _Content = __webpack_require__(587);

var _Content2 = _interopRequireDefault(_Content);

var _Preview = __webpack_require__(597);

var _Preview2 = _interopRequireDefault(_Preview);

var _reactMetaTags = __webpack_require__(53);

var _reactMetaTags2 = _interopRequireDefault(_reactMetaTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainPage = function (_React$Component) {
    _inherits(MainPage, _React$Component);

    function MainPage(props) {
        _classCallCheck(this, MainPage);

        var _this = _possibleConstructorReturn(this, (MainPage.__proto__ || Object.getPrototypeOf(MainPage)).call(this, props));

        _this.state = {
            FTON: false
        };
        _this.onStart = _this.onStart.bind(_this);
        return _this;
    }

    _createClass(MainPage, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            //this.setState({FTON: checkFTON()});
        }
    }, {
        key: 'onStart',
        value: function onStart() {
            /*  createCookie("FirstTimeOrNot", "1", 300);
              this.setState({FTON: false});*/

        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { id: 'MainPage' },
                _react2.default.createElement(
                    _reactMetaTags2.default,
                    null,
                    _react2.default.createElement(
                        'title',
                        null,
                        'NightBrowser'
                    ),
                    _react2.default.createElement('meta', { name: 'description', content: '\u0421\u0430\u0439\u0442 \u0434\u043B\u044F \u043F\u043E\u0438\u0441\u043A\u0430 \u043D\u043E\u0432\u044B\u0445 \u0434\u0440\u0443\u0437\u0435\u0439 \u0438 \u0441\u043E\u0431\u044B\u0442\u0438\u0439' }),
                    _react2.default.createElement('meta', { property: 'og:title', content: 'NightBrowser' }),
                    _react2.default.createElement('meta', { property: 'og:image', content: 'images/fav.png' })
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_Header2.default, null),
                    _react2.default.createElement(_Content2.default, null),
                    _react2.default.createElement(_footer2.default, null)
                )
            );
        }
    }]);

    return MainPage;
}(_react2.default.Component);

exports.default = MainPage;
;

/***/ }),

/***/ 281:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _footer = __webpack_require__(48);

var _footer2 = _interopRequireDefault(_footer);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _ContentSearchPage = __webpack_require__(588);

var _ContentSearchPage2 = _interopRequireDefault(_ContentSearchPage);

var _reactMetaTags = __webpack_require__(53);

var _reactMetaTags2 = _interopRequireDefault(_reactMetaTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchPage = function (_React$Component) {
    _inherits(SearchPage, _React$Component);

    function SearchPage(props) {
        _classCallCheck(this, SearchPage);

        return _possibleConstructorReturn(this, (SearchPage.__proto__ || Object.getPrototypeOf(SearchPage)).call(this, props));
    }

    _createClass(SearchPage, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _reactMetaTags2.default,
                    null,
                    _react2.default.createElement(_reactMetaTags.ReactTitle, { title: '\u041F\u043E\u0438\u0441\u043A \u0441\u043E\u0431\u044B\u0442\u0438\u0439 NightBrowser' }),
                    _react2.default.createElement('meta', { name: 'description', content: '\u041F\u043E\u0438\u0441\u043A \u0441\u043E\u0431\u044B\u0442\u0438\u0439 \u043F\u043E \u0437\u0430\u0434\u0430\u043D\u044B\u043C \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430\u043C ' }),
                    _react2.default.createElement('meta', { property: 'og:title', content: '\u041F\u043E\u0438\u0441\u043A \u0441\u043E\u0431\u044B\u0442\u0438\u0439 NightBrowser' }),
                    _react2.default.createElement('meta', { property: 'og:image', content: 'images/fav.png' })
                ),
                _react2.default.createElement(_Header2.default, null),
                _react2.default.createElement(_ContentSearchPage2.default, null)
            );
        }
    }]);

    return SearchPage;
}(_react2.default.Component);

exports.default = SearchPage;
;

/***/ }),

/***/ 282:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _footer = __webpack_require__(48);

var _footer2 = _interopRequireDefault(_footer);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _Profile = __webpack_require__(598);

var _Profile2 = _interopRequireDefault(_Profile);

var _reactRouter = __webpack_require__(15);

var _reactMetaTags = __webpack_require__(53);

var _reactMetaTags2 = _interopRequireDefault(_reactMetaTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserProfile = function (_React$Component) {
    _inherits(UserProfile, _React$Component);

    function UserProfile(props) {
        _classCallCheck(this, UserProfile);

        var _this = _possibleConstructorReturn(this, (UserProfile.__proto__ || Object.getPrototypeOf(UserProfile)).call(this, props));

        _this.state = {
            Loading: true,
            UserData: {},
            prevId: ''

        };
        fetch('/UserData/' + _this.props.params.id).then(function (response) {
            return response.json();
        }).then(function (UserData) {
            if (UserData === true) {
                window.location.replace("/");
            } else _this.setState({ UserData: UserData }); // all the attributes of the bug are top level state items
            _this.setState({ Loading: false });
        });
        return _this;
    }

    _createClass(UserProfile, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            fetch('/UserData/' + nextProps.params.id).then(function (response) {
                return response.json();
            }).then(function (UserData) {
                if (UserData === true) {
                    window.location.replace("/");
                } else {
                    _this2.setState({ UserData: UserData }); // all the attributes of the bug are top level state items
                    console.log(_this2.state.UserData);
                }
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(props) {}
    }, {
        key: 'render',
        value: function render() {

            var metaTitle = this.state.UserData.UsrFirstName + ' ' + this.state.UserData.UsrLastName + ' NightBrowser';
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _reactMetaTags2.default,
                    null,
                    _react2.default.createElement(_reactMetaTags.ReactTitle, { title: metaTitle }),
                    _react2.default.createElement('meta', { name: 'description', content: this.state.UserData.UsrDesc }),
                    _react2.default.createElement('meta', { property: 'og:title', content: metaTitle }),
                    _react2.default.createElement('meta', { property: 'og:image', content: this.state.UserData.UsrPhotoBig })
                ),
                _react2.default.createElement(_Header2.default, null),
                _react2.default.createElement(_Profile2.default, { UserData: this.state.UserData })
            );
        }
    }]);

    return UserProfile;
}(_react2.default.Component);

exports.default = UserProfile;
;

/***/ }),

/***/ 283:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(16);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = __webpack_require__(15);

var _footer = __webpack_require__(48);

var _footer2 = _interopRequireDefault(_footer);

var _Header = __webpack_require__(34);

var _Header2 = _interopRequireDefault(_Header);

var _ProfileContentEdit = __webpack_require__(599);

var _ProfileContentEdit2 = _interopRequireDefault(_ProfileContentEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loading = function Loading() {
    return _react2.default.createElement(
        'div',
        { className: 'loadingState' },
        '        ',
        _react2.default.createElement(
            'div',
            { className: 'sk-folding-cube' },
            _react2.default.createElement('div', { className: 'sk-cube1 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube2 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube4 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube3 sk-cube' })
        ),
        _react2.default.createElement(
            'div',
            { className: 'loadinglabel' },
            '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E...'
        )
    );
};

var UserProfileEdit = function (_React$Component) {
    _inherits(UserProfileEdit, _React$Component);

    function UserProfileEdit(props) {
        _classCallCheck(this, UserProfileEdit);

        var _this = _possibleConstructorReturn(this, (UserProfileEdit.__proto__ || Object.getPrototypeOf(UserProfileEdit)).call(this, props));

        _this.state = {
            Loading: true,
            UserData: {}

        };

        _this.componentWillMount = _this.componentWillMount.bind(_this);
        _this.load = _this.load.bind(_this);
        return _this;
    }

    _createClass(UserProfileEdit, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            checkCookie(this.load);
        }
    }, {
        key: 'load',
        value: function load(test) {
            var _this2 = this;

            if (test != "") {
                fetch('/UserData/' + this.props.params.id + '/edit').then(function (response) {
                    return response.json();
                }).then(function (UserData) {

                    _this2.setState({ UserData: UserData });
                    id = getCookie("UserId");
                    if (id != _this2.state.UserData.NBID) {
                        window.location.replace("/");
                    } else {
                        _this2.setState({ Loading: false });
                    }
                });
            } else {
                window.location.replace("/");
            }
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.Loading == true) {
                return _react2.default.createElement(Loading, null);
            } else {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_Header2.default, null),
                    _react2.default.createElement(_ProfileContentEdit2.default, { UserData: this.state.UserData })
                );
            }
        }
    }]);

    return UserProfileEdit;
}(_react2.default.Component);

exports.default = UserProfileEdit;
;

/***/ }),

/***/ 284:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = after;

function after(count, callback, err_cb) {
    var bail = false;
    err_cb = err_cb || noop;
    proxy.count = count;

    return count === 0 ? callback() : proxy;

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times');
        }
        --proxy.count;

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true;
            callback(err);
            // future error callbacks will go to error handler
            callback = err_cb;
        } else if (proxy.count === 0 && !bail) {
            callback(null, result);
        }
    }
}

function noop() {}

/***/ }),

/***/ 285:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function (arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) {
    return arraybuffer.slice(start, end);
  }

  if (start < 0) {
    start += bytes;
  }
  if (end < 0) {
    end += bytes;
  }
  if (end > bytes) {
    end = bytes;
  }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

/***/ }),

/***/ 287:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function () {
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand = Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function () {
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function (min) {
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function (max) {
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function (jitter) {
  this.jitter = jitter;
};

/***/ }),

/***/ 288:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function () {
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function (arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
        i,
        len = bytes.length,
        base64 = "";

    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
      base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
      base64 += chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode = function (base64) {
    var bufferLength = base64.length * 0.75,
        len = base64.length,
        i,
        p = 0,
        encoded1,
        encoded2,
        encoded3,
        encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }

    return arraybuffer;
  };
})();

/***/ }),

/***/ 289:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = function () {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch (e) {
    return false;
  }
}();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && function () {
  try {
    var b = new Blob([new Uint8Array([1, 2])]);
    return b.size === 2;
  } catch (e) {
    return false;
  }
}();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return options.type ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = function () {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
}();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 306:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + (typeof encodedURI === 'undefined' ? 'undefined' : _typeof(encodedURI)) + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

/***/ }),

/***/ 325:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(326);

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = __webpack_require__(50);

/***/ }),

/***/ 326:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Module dependencies.
 */

var transports = __webpack_require__(162);
var Emitter = __webpack_require__(49);
var debug = __webpack_require__(70)('engine.io-client:socket');
var index = __webpack_require__(176);
var parser = __webpack_require__(50);
var parseuri = __webpack_require__(193);
var parseqs = __webpack_require__(76);

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket(uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === (typeof uri === 'undefined' ? 'undefined' : _typeof(uri))) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure : global.location && 'https:' === location.protocol;

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname || (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port ? location.port : this.secure ? 443 : 80);
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.transportOptions = opts.transportOptions || {};
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? opts.perMessageDeflate || {} : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // other options for Node.js client
  var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = __webpack_require__(101);
Socket.transports = __webpack_require__(162);
Socket.parser = __webpack_require__(50);

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // per-transport options
  var options = this.transportOptions[name] || {};

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    query: query,
    socket: this,
    agent: options.agent || this.agent,
    hostname: options.hostname || this.hostname,
    port: options.port || this.port,
    secure: options.secure || this.secure,
    path: options.path || this.path,
    forceJSONP: options.forceJSONP || this.forceJSONP,
    jsonp: options.jsonp || this.jsonp,
    forceBase64: options.forceBase64 || this.forceBase64,
    enablesXDR: options.enablesXDR || this.enablesXDR,
    timestampRequests: options.timestampRequests || this.timestampRequests,
    timestampParam: options.timestampParam || this.timestampParam,
    policyPort: options.policyPort || this.policyPort,
    pfx: options.pfx || this.pfx,
    key: options.key || this.key,
    passphrase: options.passphrase || this.passphrase,
    cert: options.cert || this.cert,
    ca: options.ca || this.ca,
    ciphers: options.ciphers || this.ciphers,
    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: options.extraHeaders || this.extraHeaders,
    forceNode: options.forceNode || this.forceNode,
    localAddress: options.localAddress || this.localAddress,
    requestTimeout: options.requestTimeout || this.requestTimeout,
    protocols: options.protocols || void 0
  });

  return transport;
};

function clone(obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport) {
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport.on('drain', function () {
    self.onDrain();
  }).on('packet', function (packet) {
    self.onPacket(packet);
  }).on('error', function (e) {
    self.onError(e);
  }).on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen() {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport() {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  // Handle any error that happens while probing
  function onerror(err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose() {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose() {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade(to) {
    if (transport && to.name !== transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup() {
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(JSON.parse(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || self.pingInterval + self.pingTimeout);
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write = Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close() {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose() {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade() {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Module requirements.
 */

var Polling = __webpack_require__(163);
var inherit = __webpack_require__(69);

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty() {}

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling(opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete() {
    initIframe();
    fn();
  }

  function initIframe() {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Module requirements.
 */

var XMLHttpRequest = __webpack_require__(102);
var Polling = __webpack_require__(163);
var Emitter = __webpack_require__(49);
var inherit = __webpack_require__(69);
var debug = __webpack_require__(70)('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty() {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR(opts) {
  Polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;
  this.extraHeaders = opts.extraHeaders;

  if (global.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname !== global.location.hostname || port !== opts.port;
    this.xs = opts.secure !== isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request(opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    if (this.supportsBinary) {
      xhr.responseType = 'arraybuffer';
    }

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          try {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (contentType !== 'application/octet-stream') {
              xhr.responseType = 'text';
            }
          } catch (e) {}
        }
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      if (this.xhr.responseType === 'arraybuffer') {
        data = this.xhr.response || this.xhr.responseText;
      } else {
        data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
      }
    } else {
      data = this.xhr.responseText;
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (global.document) {
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler() {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Module dependencies.
 */

var Transport = __webpack_require__(101);
var parser = __webpack_require__(50);
var parseqs = __webpack_require__(76);
var inherit = __webpack_require__(69);
var yeast = __webpack_require__(271);
var debug = __webpack_require__(70)('engine.io-client:websocket');
var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
var NodeWebSocket;
if (typeof window === 'undefined') {
  try {
    NodeWebSocket = __webpack_require__(625);
  } catch (e) {}
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocket = BrowserWebSocket;
if (!WebSocket && typeof window === 'undefined') {
  WebSocket = NodeWebSocket;
}

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS(opts) {
  var forceBase64 = opts && opts.forceBase64;
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  this.protocols = opts.protocols;
  if (!this.usingBrowserWebSocket) {
    WebSocket = NodeWebSocket;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws = this.usingBrowserWebSocket ? protocols ? new WebSocket(uri, protocols) : new WebSocket(uri) : new WebSocket(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      parser.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? global.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done() {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && ('wss' === schema && Number(this.port) !== 443 || 'ws' === schema && Number(this.port) !== 80)) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(331);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0,
      i;

  for (i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy() {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys(obj) {
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

/***/ }),

/***/ 333:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! https://mths.be/utf8js v2.1.2 by @mathias */
;(function (root) {

	// Detect free variables `exports`
	var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports;

	// Detect free variable `module`
	var freeModule = ( false ? 'undefined' : _typeof(module)) == 'object' && module && module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint, strict) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			if (strict) {
				throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() + ' is not a scalar value');
			}
			return false;
		}
		return true;
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(codePoint >> shift & 0x3F | 0x80);
	}

	function encodeCodePoint(codePoint, strict) {
		if ((codePoint & 0xFFFFFF80) == 0) {
			// 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) {
			// 2-byte sequence
			symbol = stringFromCharCode(codePoint >> 6 & 0x1F | 0xC0);
		} else if ((codePoint & 0xFFFF0000) == 0) {
			// 3-byte sequence
			if (!checkScalarValue(codePoint, strict)) {
				codePoint = 0xFFFD;
			}
			symbol = stringFromCharCode(codePoint >> 12 & 0x0F | 0xE0);
			symbol += createByte(codePoint, 6);
		} else if ((codePoint & 0xFFE00000) == 0) {
			// 4-byte sequence
			symbol = stringFromCharCode(codePoint >> 18 & 0x07 | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode(codePoint & 0x3F | 0x80);
		return symbol;
	}

	function utf8encode(string, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;

		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint, strict);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol(strict) {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			byte2 = readContinuationByte();
			codePoint = (byte1 & 0x1F) << 6 | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = (byte1 & 0x0F) << 12 | byte2 << 6 | byte3;
			if (codePoint >= 0x0800) {
				return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = (byte1 & 0x07) << 0x12 | byte2 << 0x0C | byte3 << 0x06 | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;

		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol(strict)) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.1.2',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if ("function" == 'function' && _typeof(__webpack_require__(96)) == 'object' && __webpack_require__(96)) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return utf8;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) {
			// in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.utf8 = utf8;
	}
})(undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(585)(module), __webpack_require__(22)))

/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SearchResult = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

var _headerMenu = __webpack_require__(623);

var _headerMenu2 = _interopRequireDefault(_headerMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_React$Component) {
    _inherits(Header, _React$Component);

    function Header(props) {
        _classCallCheck(this, Header);

        var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

        _this.state = {
            AfterLogin: false,
            UserData: {},
            Searchvalue: '',
            FindResults: [],
            SearchPanel: false,
            intervalId: '',
            UsrCity: '',
            MobileMenu: false,
            CurWeather: { lang_ru: [{ value: "1" }],
                weatherIconUrl: [{ value: "1" }]
            },
            BeforeLogin: true,
            Login: false,
            regEmail: '',
            regPass: '',
            LoginForm: true,
            RegestrationForm: false,
            loading: true
        };
        _this.LoggedIn = _this.LoggedIn.bind(_this);
        _this.OpenSearch = _this.OpenSearch.bind(_this);
        _this.CloseSearch = _this.CloseSearch.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.SetCity = _this.SetCity.bind(_this);
        _this.SetWeather = _this.SetWeather.bind(_this);
        _this.openMenuMobile = _this.openMenuMobile.bind(_this);
        _this.DisplayFindResults = _this.DisplayFindResults.bind(_this);

        _this.UserDataReceive = _this.UserDataReceive.bind(_this);
        _this.UserDataReceiveC = _this.UserDataReceiveC.bind(_this);
        _this.openLogin = _this.openLogin.bind(_this);
        _this.Regestration = _this.Regestration.bind(_this);
        _this.SuccesRegestration = _this.SuccesRegestration.bind(_this);
        _this.openRegestration = _this.openRegestration.bind(_this);
        _this.closeRegestration = _this.closeRegestration.bind(_this);
        _this.LoginVK = _this.LoginVK.bind(_this);
        _this.Login = _this.Login.bind(_this);
        _this.SuccesLogin = _this.SuccesLogin.bind(_this);

        return _this;
    }

    _createClass(Header, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {

            checkCookie(this.LoggedIn);
            checkCity(this.SetCity);
            //checkWeather(this.SetWeather)
            this.Coockie();
            this.CoockieVk();
        }
    }, {
        key: 'SetWeather',
        value: function SetWeather(Weather) {
            this.setState({ CurWeather: Weather });
        }
    }, {
        key: 'SetCity',
        value: function SetCity(City) {
            this.setState({ UsrCity: City });
        }
    }, {
        key: 'LoggedIn',
        value: function LoggedIn(UserData) {
            if (UserData != "") {
                this.setState({ AfterLogin: true });
                this.setState({ UserData: UserData });

                this.forceUpdate();
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.forceUpdate();
        }
    }, {
        key: 'ClearCoockie',
        value: function (_ClearCoockie) {
            function ClearCoockie() {
                return _ClearCoockie.apply(this, arguments);
            }

            ClearCoockie.toString = function () {
                return _ClearCoockie.toString();
            };

            return ClearCoockie;
        }(function () {
            ClearCoockie();
        })
    }, {
        key: 'OpenSearch',
        value: function OpenSearch() {}
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            this.setState({ Searchvalue: event.target.value });
            this.setState({ SearchPanel: true });
            if (event.target.value != '') {
                FindUsers(event.target.value, this.DisplayFindResults);
            }
        }
    }, {
        key: 'DisplayFindResults',
        value: function DisplayFindResults(Results) {
            this.setState({ FindResults: Results });
        }
    }, {
        key: 'CloseSearch',
        value: function CloseSearch() {
            this.setState({ SearchPanel: false });
        }
    }, {
        key: 'openMenuMobile',
        value: function openMenuMobile() {
            console.log(this.state.UserData);
            this.setState({ SearchPanel: false });
            this.setState({ MobileMenu: !this.state.MobileMenu });
            if (this.state.MobileMenu) {
                $("#buttonMenuMain").removeClass("ShtorkaMobileMenuButtonDowned");
                $("#carretsignMenu").removeClass("carretsignMenu");
                $("#shtorkaMobileMenu").removeClass("ShtorkaMobileMenuShowDowned");
            } else {
                $("#shtorkaMobileMenu").addClass("ShtorkaMobileMenuShowDowned");
                $("#buttonMenuMain").addClass("ShtorkaMobileMenuButtonDowned");
                $("#carretsignMenu").addClass("carretsignMenu");
            }
        }
    }, {
        key: 'Coockie',
        value: function Coockie() {
            checkCookie(this.SuccesLogin);
        }
    }, {
        key: 'Login',
        value: function Login() {
            logUsr(document.getElementById("regEmail").value, document.getElementById("regPass").value, this.state.UsrCity, this.SuccesLogin);
        }
    }, {
        key: 'SuccesLogin',
        value: function SuccesLogin(UserDataLogin) {
            if (UserDataLogin != "") {
                this.setState({ UserData: UserDataLogin });
                this.setState({ BeforeLogin: false, AfterLogin: true, Login: false });
            }
        }
    }, {
        key: 'Regestration',
        value: function Regestration() {
            regUsr(document.getElementById("regEmail").value, document.getElementById("regPass").value, this.state.UsrCity, this.SuccesRegestration);
        }
    }, {
        key: 'SuccesRegestration',
        value: function SuccesRegestration(NBID) {
            _reactRouter.browserHistory.push('/User/' + NBID + '/edit');
        }
    }, {
        key: 'openLogin',
        value: function openLogin() {
            this.setState({ Login: true, BeforeLogin: false });
        }
    }, {
        key: 'openRegestration',
        value: function openRegestration() {
            this.setState({ LoginForm: false, RegestrationForm: true });
        }
    }, {
        key: 'closeRegestration',
        value: function closeRegestration() {
            this.setState({ LoginForm: true, RegestrationForm: false });
        }
    }, {
        key: 'CoockieVk',
        value: function CoockieVk() {
            checkCookie(this.UserDataReceiveC);
        }
    }, {
        key: 'UserDataReceiveC',
        value: function UserDataReceiveC(UserDataVk) {
            if (UserDataVk != "") {
                this.setState({ UserData: UserDataVk });
                this.setState({ BeforeLogin: false, AfterLogin: true, Login: false });
            }
        }
    }, {
        key: 'LoginVK',
        value: function LoginVK() {
            loginVK(this.state.UsrCity, this.UserDataReceive);
        }
    }, {
        key: 'UserDataReceive',
        value: function UserDataReceive(UserDataVk) {
            console.log(UserDataVk);
            if (UserDataVk === true) {
                this.setState({ Login: false });
            } else {
                this.setState({ UserData: UserDataVk });
                this.setState({ BeforeLogin: false, AfterLogin: true, Login: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.UserData.UsrPhotoBig) {
                var divStyle = {
                    backgroundImage: 'url(' + this.state.UserData.UsrPhotoBig + ')'
                };
            } else {
                var divStyle = {
                    backgroundImage: 'url(/images/LogoProfile.jpg)'
                };
            }
            var divStyle1 = {
                backgroundImage: 'url(' + this.state.CurWeather.weatherIconUrl[0].value + ')'
            };
            var divStyleNotAFt = {
                backgroundImage: 'url(/images/_.png)'
            };
            var divStyleNotAFt1 = {
                backgroundImage: 'url(/images/DR1lvHoU8AAqu-E.jpg)'
            };
            var divStyleNotAFt2 = {
                backgroundImage: 'url(/images/131589.jpg)'
            };
            return _react2.default.createElement(
                'div',
                { className: 'Header', id: 'Header' },
                _react2.default.createElement(
                    'div',
                    { id: 'shtorkaMobileMenu', className: 'ShtorkaMobileMenu' },
                    _react2.default.createElement(
                        'div',
                        { className: 'SearchPanelinMenu' },
                        _react2.default.createElement('input', { type: 'text', value: this.state.Searchvalue, onChange: this.handleChange, className: 'SearchInputInMenu' }),
                        ' ',
                        _react2.default.createElement('div', { className: 'DvigLup' }),
                        ' ',
                        _react2.default.createElement('i', { className: 'fa fa-search fa-1x ', onClick: this.handleChange, 'aria-hidden': 'true' }),
                        this.state.SearchPanel && _react2.default.createElement(
                            'i',
                            { className: 'EventsPrimaryBlockOnMainPageAlertClose CloseSearch', onClick: this.CloseSearch },
                            '\u0445'
                        ),
                        ' ',
                        _react2.default.createElement('br', null)
                    ),
                    this.state.AfterLogin && _react2.default.createElement(
                        'div',
                        { className: 'ProfileAuthorizitedInMenu' },
                        _react2.default.createElement(
                            'div',
                            { className: 'ProfileAuthorizitedInMenuLeftItems' },
                            _react2.default.createElement(
                                'div',
                                { className: 'ProfileAuthorizitedInMenuLeftItemsName' },
                                this.state.UserData.UsrFirstName
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'ProfileAuthorizitedInMenuLeftItemsAvatarBlock' },
                                _react2.default.createElement('div', { className: 'ProfileAuthorizitedInMenuLeftItemsAvatarBlockAvatar', style: divStyle }),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevel' },
                                    this.state.UserData.Level
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevelLabel' },
                                    '\u0423\u0440\u043E\u0432\u0435\u043D\u044C'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'ProfileAuthorizitedInMenuRightItems' },
                            _react2.default.createElement(
                                'div',
                                { className: 'ProfileAuthorizitedInMenuRightItemsCity' },
                                '\u0412\u0430\u0448 \u0413\u043E\u0440\u043E\u0434: ',
                                _react2.default.createElement(
                                    'div',
                                    { className: 'ProfileAuthorizitedInMenuRightItemsCityName' },
                                    this.state.UsrCity
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'ProfileAuthorizitedInMenuRightItemsMissedNoth' },
                                _react2.default.createElement(
                                    'p',
                                    null,
                                    '\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043D\u044B\u0435:'
                                ),
                                '\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F - ',
                                _react2.default.createElement(
                                    'span',
                                    { className: 'IconOfMissingAlerts1' },
                                    this.state.UserData.countofUnreaded
                                ),
                                _react2.default.createElement('br', null),
                                '\u0417\u0430\u0432.\u0432 \u0434\u0440\u0443\u0437\u044C\u044F - ',
                                _react2.default.createElement(
                                    'span',
                                    { className: 'IconOfMissingAlerts1' },
                                    this.state.UserData.IncomingFriendReqest
                                ),
                                _react2.default.createElement('br', null),
                                '\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0439 - ',
                                _react2.default.createElement(
                                    'span',
                                    { className: 'IconOfMissingAlerts1' },
                                    '4'
                                )
                            ),
                            _react2.default.createElement(
                                _reactRouter.Link,
                                { to: '/User/' + this.state.UserData.NBID, onClick: this.openMenuMobile, className: 'ProfileAuthorizitedInMenuRightItemsOpenProfile' },
                                '\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C'
                            )
                        )
                    ),
                    !this.state.AfterLogin && _react2.default.createElement(
                        'div',
                        { className: 'ProfileNotAuthorizitedInMenu' },
                        _react2.default.createElement(
                            'div',
                            { className: 'Login', id: 'Login' },
                            _react2.default.createElement(
                                'p',
                                { className: 'AutoLabel' },
                                '\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F'
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'LoginPresentation' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'LoginPresentationPhotoBlock' },
                                    _react2.default.createElement('div', { className: 'LoginPresentationPhotoBlockLeft', style: divStyleNotAFt1 }),
                                    _react2.default.createElement('div', { className: 'LoginPresentationPhotoBlockRight', style: divStyleNotAFt2 }),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'LoginPresentationPhotoBlockCenter' },
                                        _react2.default.createElement('div', { className: 'ProfileAuthorizitedInMenuLeftItemsAvatarBlockAvatar PhotoBlockFix', style: divStyleNotAFt }),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevel lvlFix' },
                                            '0'
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevelLabel lblFix' },
                                            '\u0423\u0440\u043E\u0432\u0435\u043D\u044C'
                                        )
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'LoginPresentationLabel' },
                                    '\u041F\u043E\u0432\u0435\u0434\u0443\u0439 \u043E \u0441\u0435\u0431\u0435!;) \u0422\u0432\u043E\u0438 \u0434\u0440\u0443\u0437\u044C\u044F \u0443\u0436\u0435 \u0441 \u043D\u0430\u043C\u0438!!!'
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'LoginForm' },
                                '\u041B\u043E\u0433\u0438\u043D :',
                                _react2.default.createElement('input', { type: 'text', className: 'LoginEmail1', size: '50', id: 'regEmail', onChange: this.EmailEnter }),
                                _react2.default.createElement('br', null),
                                '\u041F\u0430\u0440\u043E\u043B\u044C :',
                                _react2.default.createElement('input', { type: 'password', className: 'LoginEmail', size: '50', id: 'regPass', onChange: this.PassEnter }),
                                _react2.default.createElement('br', null)
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'MenubutttonFix' },
                                _react2.default.createElement(
                                    'button',
                                    { type: 'submit', className: 'LoginBtn1', onClick: this.Regestration },
                                    '\u0417\u0430\u0440\u0435\u0433\u0435\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F'
                                ),
                                _react2.default.createElement(
                                    'button',
                                    { type: 'submit', className: 'LoginBtn', onClick: this.Login },
                                    '\u0412\u043E\u0439\u0442\u0438'
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'LoginButtonsBlock' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'LoginButtons', title: '\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u0412\u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0435' },
                                    _react2.default.createElement('i', { className: 'fab fa-vk', onClick: this.LoginVK, 'aria-hidden': 'true' })
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'DisplayInline' },
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/SearchEvent', className: 'MenuItemsEvents' },
                            _react2.default.createElement(
                                'p',
                                { className: 'SbgInside' },
                                _react2.default.createElement('i', { className: 'fa fa-list fa-3x', 'aria-hidden': 'true' }),
                                _react2.default.createElement('div', { className: 'CrugRamka' })
                            ),
                            _react2.default.createElement(
                                'span',
                                { className: 'LabelMenu' },
                                '\u0421\u043E\u0431\u044B\u0442\u0438\u044F'
                            )
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/Chats', className: 'MenuItemsEvents' },
                            _react2.default.createElement(
                                'p',
                                { className: 'SbgInside' },
                                _react2.default.createElement('i', { className: 'fa fa-list fa-3x', 'aria-hidden': 'true' }),
                                _react2.default.createElement('div', { className: 'CrugRamka' })
                            ),
                            _react2.default.createElement(
                                'span',
                                { className: 'LabelMenu' },
                                '\u0427\u0430\u0442\u044B'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'DisplayInline' },
                        this.state.AfterLogin && _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/CreateEvent', className: 'MenuItemsCreateEvent' },
                            _react2.default.createElement(
                                'p',
                                null,
                                _react2.default.createElement(
                                    'span',
                                    { className: 'LabelMenu1' },
                                    '\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u043E\u0431\u044B\u0442\u0438\u0435'
                                )
                            ),
                            _react2.default.createElement(
                                'p',
                                { className: 'SbgInside1' },
                                _react2.default.createElement('i', { className: 'fa fa-bullhorn fa-3x', 'aria-hidden': 'true' }),
                                _react2.default.createElement('div', { className: 'CrugRamka' })
                            )
                        ),
                        this.state.AfterLogin && _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/CreateChat', className: 'MenuItemsCreateChat' },
                            _react2.default.createElement(
                                'p',
                                null,
                                _react2.default.createElement(
                                    'span',
                                    { className: 'LabelMenu1' },
                                    '\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0447\u0430\u0442'
                                )
                            ),
                            _react2.default.createElement(
                                'p',
                                { className: 'SbgInside1' },
                                _react2.default.createElement('i', { className: 'fa fa-comments fa-3x', 'aria-hidden': 'true' }),
                                _react2.default.createElement('div', { className: 'CrugRamka' })
                            )
                        )
                    ),
                    this.state.AfterLogin && _react2.default.createElement(
                        'a',
                        { onClick: this.ClearCoockie, className: 'MenuItemsExit' },
                        _react2.default.createElement(
                            'p',
                            null,
                            _react2.default.createElement('i', { className: 'fa fa-sign-out-alt fa-3x', 'aria-hidden': 'true' }),
                            '\u0412\u044B\u0439\u0442\u0438'
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'ShtorkaMobileMenuButton', id: 'buttonMenuMain', onClick: this.openMenuMobile },
                    _react2.default.createElement(
                        'div',
                        { className: 'buttonIconMobileMenuButton' },
                        _react2.default.createElement('i', { className: 'fa fa-caret-down fa-2x', id: 'carretsignMenu', 'aria-hidden': 'true' })
                    )
                ),
                this.state.SearchPanel && _react2.default.createElement(
                    'div',
                    { className: 'SearchPanel' },
                    _react2.default.createElement(SearchResult, { Results: this.state.FindResults })
                ),
                _react2.default.createElement(
                    _reactRouter.Link,
                    { to: '/', className: 'LogoVneshn' },
                    _react2.default.createElement(
                        'span',
                        { className: 'LogoVnut' },
                        'NB'
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'LogoVnutN' },
                        ' '
                    )
                )
            );
        }
    }]);

    return Header;
}(_react2.default.Component);

exports.default = Header;
;

var SearchResult = exports.SearchResult = function (_React$Component2) {
    _inherits(SearchResult, _React$Component2);

    function SearchResult() {
        _classCallCheck(this, SearchResult);

        return _possibleConstructorReturn(this, (SearchResult.__proto__ || Object.getPrototypeOf(SearchResult)).apply(this, arguments));
    }

    _createClass(SearchResult, [{
        key: 'render',
        value: function render() {
            var FindResultsComponents = void 0;
            var FindResultsComponentsEvent = void 0;
            if (this.props.Results[0]) {
                FindResultsComponents = this.props.Results[0].map(function (UserFind) {
                    if (!UserFind.UsrPhotoBig) {
                        UserFind.UsrPhotoBig = '../images/LogoProfile.jpg';
                    }
                    var divStyle = {
                        backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + UserFind.UsrPhotoBig + ')'

                    };
                    return _react2.default.createElement(
                        _reactRouter.Link,
                        { to: '/User/' + UserFind.NBID, onClick: this.props.openMenuMobile },
                        _react2.default.createElement(
                            'div',
                            { className: 'FindResultsUserBlockMain', key: UserFind.NBID },
                            _react2.default.createElement('div', { className: 'searchresultuserpic1', style: divStyle }),
                            _react2.default.createElement(
                                'div',
                                {
                                    className: 'FindResultsUserFirstNameMain' },
                                UserFind.UsrFirstName,
                                ' ',
                                UserFind.UsrLastName
                            )
                        )
                    );
                }.bind(this));
            }

            if (this.props.Results[1]) FindResultsComponentsEvent = this.props.Results[1].map(function (Event) {
                if (!Event.PhotoURL) {
                    Event.PhotoURL = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Event.PhotoURL + ')'

                };
                return _react2.default.createElement(
                    _reactRouter.Link,
                    { to: '/Event/' + Event.EventId, onClick: this.props.openMenuMobile },
                    _react2.default.createElement(
                        'div',
                        { className: 'FindResultsUserBlockMain', key: Event.EventId },
                        _react2.default.createElement('div', { className: 'searchresultuserpic1', style: divStyle }),
                        _react2.default.createElement(
                            'div',
                            { className: 'FindResultsUserFirstNameMain' },
                            Event.Name,
                            '\xA0',
                            _react2.default.createElement('br', null),
                            Event.Category
                        )
                    )
                );
            }.bind(this));
            return _react2.default.createElement(
                'div',
                { className: 'Searchres' },
                '\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 ',
                _react2.default.createElement('br', null),
                FindResultsComponents,
                ' '
            );
        }
    }]);

    return SearchResult;
}(_react2.default.Component);

;

/***/ }),

/***/ 348:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),

/***/ 349:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

/***/ }),

/***/ 394:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var strictUriEncode = __webpack_require__(395);
var decodeComponent = __webpack_require__(306);

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [encode(key, options), '[', index, ']'].join('') : [encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('');
			};
		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, options) : [encode(key, options), '[]=', encode(value, options)].join('');
			};
		default:
			return function (key, value) {
				return value === null ? encode(key, options) : [encode(key, options), '=', encode(value, options)].join('');
			};
	}
}

function parserForArrayFormat(options) {
	var result = void 0;

	switch (options.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};
		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

function extract(input) {
	var queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}
	return input.slice(queryStart + 1);
}

function parse(input, options) {
	options = _extends({ arrayFormat: 'none' }, options);

	var formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	var ret = Object.create(null);

	if (typeof input !== 'string') {
		return ret;
	}

	input = input.trim().replace(/^[?#&]/, '');

	if (!input) {
		return ret;
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = input.split('&')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var param = _step.value;

			var _param$replace$split = param.replace(/\+/g, ' ').split('='),
			    _param$replace$split2 = _slicedToArray(_param$replace$split, 2),
			    key = _param$replace$split2[0],
			    value = _param$replace$split2[1];

			// Missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters


			value = value === undefined ? null : decodeComponent(value);

			formatter(decodeComponent(key), value, ret);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return Object.keys(ret).sort().reduce(function (result, key) {
		var value = ret[key];
		if (Boolean(value) && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = function (obj, options) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	options = _extends(defaults, options);

	if (options.sort === false) {
		options.sort = function () {};
	}

	var formatter = encoderForArrayFormat(options);

	return obj ? Object.keys(obj).sort(options.sort).map(function (key) {
		var value = obj[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			var result = [];

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = value.slice()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var value2 = _step2.value;

					if (value2 === undefined) {
						continue;
					}

					result.push(formatter(key, value2, result.length));
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return result.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

exports.parseUrl = function (input, options) {
	return {
		url: input.split('?')[0] || '',
		query: parse(extract(input), options)
	};
};

/***/ }),

/***/ 395:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (x) {
    return '%' + x.charCodeAt(0).toString(16).toUpperCase();
  });
};

/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _react = __webpack_require__(0);

var _propTypes = __webpack_require__(123);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/** context class which passes extract fuunction to MetaTags Component **/
var MetaTagsContext = function (_Component) {
  _inherits(MetaTagsContext, _Component);

  function MetaTagsContext() {
    _classCallCheck(this, MetaTagsContext);

    return _possibleConstructorReturn(this, (MetaTagsContext.__proto__ || Object.getPrototypeOf(MetaTagsContext)).apply(this, arguments));
  }

  _createClass(MetaTagsContext, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { extract: this.props.extract };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }]);

  return MetaTagsContext;
}(_react.Component);

MetaTagsContext.childContextTypes = {
  extract: _propTypes2.default.func
};
exports.default = MetaTagsContext;

/***/ }),

/***/ 463:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(123);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _meta_tags = __webpack_require__(214);

var _meta_tags2 = _interopRequireDefault(_meta_tags);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ReactTitle = function (_Component) {
  _inherits(ReactTitle, _Component);

  function ReactTitle() {
    _classCallCheck(this, ReactTitle);

    return _possibleConstructorReturn(this, (ReactTitle.__proto__ || Object.getPrototypeOf(ReactTitle)).apply(this, arguments));
  }

  _createClass(ReactTitle, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_meta_tags2.default, null, _react2.default.createElement('title', null, this.props.title));
    }
  }]);

  return ReactTitle;
}(_react.Component);

ReactTitle.propTypes = {
  title: _propTypes2.default.string
};
exports.default = ReactTitle;

/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

exports.extractMetaAndTitle = extractMetaAndTitle;
exports.removeDuplicateMetas = removeDuplicateMetas;
exports.getDuplicateTitle = getDuplicateTitle;
exports.getDuplicateMeta = getDuplicateMeta;
exports.appendChild = appendChild;
exports.removeChild = removeChild;
exports.getDomAsString = getDomAsString;
var metaRegex = /<meta[^<>]*?=(['"].*?['"]|[^<>]*?)*?\/?>/g;
var titleRegex = /<title[^<>]*?>(.*?)<\/title>/g;
var attributesRegex = /(\S*?)=("(.*?)"|'(.*?)'|([^<>\s]*))/g;

/**
  Note:
  1. In server side we will add meta tags and title at last after fitering
  2. In client we will match and replace meta tagString
  3. For now we will not support link and other tags properly, they can be added but we will not check for uniqueness and will not decide placement
**/

function getAttributes(tagString) {
  var attr = {};
  if (!tagString) return attr;
  var match = attributesRegex.exec(tagString);
  while (match !== null) {
    attr[match[1]] = match[3] || match[4] || match[5];
    match = attributesRegex.exec(tagString);
  }

  return attr;
}

function filterOutMetaWithId(metas) {
  metas = Array.from(metas || []);
  return metas.filter(function (meta) {
    return !meta.id;
  });
}

function extractMetaAndTitle(domString) {
  var title = void 0;
  var metas = [];

  //extract title, only take the last title, remove title from the string
  domString = domString.replace(titleRegex, function (titleStr) {
    title = titleStr;
    return '';
  });

  //extract metas
  domString = domString.replace(metaRegex, function (_tagString) {
    metas.push(_extends({}, getAttributes(_tagString), { _tagString: _tagString }));
    return '';
  });

  return {
    title: title,
    metas: metas,
    rest: domString
  };
}

function removeDuplicateMetas(metas) {
  var metaAddedProperties = {};
  var metaAddedNames = {};
  var metaAddedIds = {};

  var filteredMetas = [];
  for (var i = metas.length - 1; i >= 0; i--) {
    var meta = metas[i];
    var id = meta.id,
        property = meta.property,
        name = meta.name;

    var addMeta = false;

    //if id is defined dont check any thing else
    if (id) {
      addMeta = !metaAddedIds[id];

      // if property key or name key is defined and its different add that,
      // But they should have different id
    } else if (property || name) {
      var existing = metaAddedProperties[property] || metaAddedNames[name];
      addMeta = !existing || existing.id; //if existing have id and the current doesn't then keep it
    }

    if (id) metaAddedIds[id] = meta;
    if (property) metaAddedProperties[property] = meta;
    if (name) metaAddedNames[name] = meta;

    if (addMeta) {
      filteredMetas.push(meta);
    }
  }

  return filteredMetas;
}

function getDuplicateTitle() {
  return document.head.querySelector('title');
}

function getDuplicateMeta(meta) {
  var head = document.head;
  var id = meta.id,
      property = meta.property,
      name = meta.name;

  if (id) {
    return id && head.querySelector('#' + id);
  } else if (name) {
    return filterOutMetaWithId(head.querySelectorAll('[name = "' + name + '"]'));
  } else if (property) {
    return filterOutMetaWithId(head.querySelectorAll('[property = "' + property + '"]'));
  }

  return null;
}

//function to append childrens on a parent
function appendChild(parent, childrens) {

  if (childrens.length === undefined) childrens = [childrens];

  var docFrag = document.createDocumentFragment();

  //we used for loop instead of forEach because childrens can be array like object
  for (var i = 0, ln = childrens.length; i < ln; i++) {
    docFrag.appendChild(childrens[i]);
  }

  parent.appendChild(docFrag);
}

function removeChild(parent, childrens) {
  if (childrens.length === undefined) childrens = [childrens];
  for (var i = 0, ln = childrens.length; i < ln; i++) {
    parent.removeChild(childrens[i]);
  }
}

//get dom as string format
function getDomAsString(dom) {
  var temp = document.createElement('div');
  temp.appendChild(dom);
  return temp.innerHTML;
}

/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(_extends({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/***/ }),

/***/ 466:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (process.env.NODE_ENV !== 'production') {
  var invariant = __webpack_require__(122);
  var warning = __webpack_require__(215);
  var ReactPropTypesSecret = __webpack_require__(124);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, _typeof(typeSpecs[typeSpecName]));
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error === 'undefined' ? 'undefined' : _typeof(error));
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 467:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(121);
var invariant = __webpack_require__(122);
var ReactPropTypesSecret = __webpack_require__(124);

module.exports = function () {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/***/ }),

/***/ 468:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var emptyFunction = __webpack_require__(121);
var invariant = __webpack_require__(122);
var warning = __webpack_require__(215);
var assign = __webpack_require__(465);

var ReactPropTypesSecret = __webpack_require__(124);
var checkPropTypes = __webpack_require__(466);

module.exports = function (isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (!manualPropTypeCallCache[cacheKey] &&
          // Avoid spamming the console because they are often not actionable except for lib authors
          manualPropTypeWarningCount < 3) {
            warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(false, 'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received %s at index %s.', getPostfixForTypeWarning(checker), i);
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Footer = function (_React$Component) {
    _inherits(Footer, _React$Component);

    function Footer(props) {
        _classCallCheck(this, Footer);

        return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).call(this, props));
    }

    _createClass(Footer, [{
        key: "componentDidMount",
        value: function componentDidMount() {}
    }, {
        key: "render",
        value: function render() {

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement("div", { className: "footerBefore" }),
                _react2.default.createElement(
                    "div",
                    { className: "footer" },
                    _react2.default.createElement(
                        "div",
                        { className: "footercontent" },
                        _react2.default.createElement(
                            "div",
                            { className: "footercenter" },
                            _react2.default.createElement(
                                "div",
                                { className: "footermenu" },
                                _react2.default.createElement(
                                    "a",
                                    { href: "" },
                                    "\u0420\u0435\u043A\u043B\u0430\u043C\u043E\u0434\u0430\u0442\u0435\u043B\u044F\u043C"
                                ),
                                _react2.default.createElement(
                                    "a",
                                    { href: "" },
                                    "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B"
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "copyright" },
                                "NightBrowser \xA9 2017"
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Footer;
}(_react2.default.Component);

exports.default = Footer;
;

/***/ }),

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function (event, fn) {
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function (event) {
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1),
      callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function (event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function (event) {
  return !!this.listeners(event).length;
};

/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Module dependencies.
 */

var keys = __webpack_require__(332);
var hasBinary = __webpack_require__(170);
var sliceBuffer = __webpack_require__(285);
var after = __webpack_require__(284);
var utf8 = __webpack_require__(333);

var base64encoder;
if (global && global.ArrayBuffer) {
  base64encoder = __webpack_require__(288);
}

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
  open: 0 // non-ws
  , close: 1 // non-ws
  , ping: 2,
  pong: 3,
  message: 4,
  upgrade: 5,
  noop: 6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = __webpack_require__(289);

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if (typeof utf8encode === 'function') {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = packet.data === undefined ? undefined : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
  }

  return callback('' + encoded);
};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i + 1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function () {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function (packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof global.Blob) {
    var fr = new FileReader();
    fr.onload = function () {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }
  // String data
  if (typeof data === 'string') {
    if (data.charAt(0) === 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data, { strict: false });
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function (msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!base64encoder) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function (message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function (err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function eachWithIndex(i, el, cb) {
    each(el, function (error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data !== 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data === '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = '',
      n,
      msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (chr !== ':') {
      length += chr;
      continue;
    }

    if (length === '' || length != (n = Number(length))) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    msg = data.substr(i + 1, n);

    if (length != msg.length) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    if (msg.length) {
      packet = exports.decodePacket(msg, binaryType, false);

      if (err.type === packet.type && err.data === packet.data) {
        // parser error in individual packet - ignoring payload
        return callback(err, 0, 1);
      }

      var ret = callback(packet, i + n, l);
      if (false === ret) return;
    }

    // advance cursor
    i += n;
    length = '';
  }

  if (length !== '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }
};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function (packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function (data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function (err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function (acc, p) {
      var len;
      if (typeof p === 'string') {
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function (p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) {
        // not true binary
        resultArray[bufferIndex++] = 0;
      } else {
        // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function (packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function (encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = encoded instanceof ArrayBuffer ? encoded.byteLength : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function (err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1;; i++) {
      if (tailArray[i] === 255) break;

      // 310 = char length of Number.MAX_VALUE
      if (msgLength.length > 310) {
        return callback(err, 0, 1);
      }

      msgLength += tailArray[i];
    }

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function (buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactTitle = exports.MetaTagsContext = exports.MetaTags = undefined;

var _meta_tags_context = __webpack_require__(462);

var _meta_tags_context2 = _interopRequireDefault(_meta_tags_context);

var _meta_tags = __webpack_require__(214);

var _meta_tags2 = _interopRequireDefault(_meta_tags);

var _react_title = __webpack_require__(463);

var _react_title2 = _interopRequireDefault(_react_title);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = _meta_tags2.default;
exports.MetaTags = _meta_tags2.default;
exports.MetaTagsContext = _meta_tags_context2.default;
exports.ReactTitle = _react_title2.default;

/***/ }),

/***/ 572:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strictUriEncode = __webpack_require__(270);

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str) {
	if (typeof str !== 'string') {
		return {};
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return {};
	}

	return str.split('&').reduce(function (ret, param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		key = decodeURIComponent(key);

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		if (!ret.hasOwnProperty(key)) {
			ret[key] = val;
		} else if (Array.isArray(ret[key])) {
			ret[key].push(val);
		} else {
			ret[key] = [ret[key], val];
		}

		return ret;
	}, {});
};

exports.stringify = function (obj) {
	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (Array.isArray(val)) {
			return val.sort().map(function (val2) {
				return strictUriEncode(key) + '=' + strictUriEncode(val2);
			}).join('&');
		}

		return strictUriEncode(key) + '=' + strictUriEncode(val);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

/***/ }),

/***/ 573:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var qs = __webpack_require__(572);
var replaceState;
var pushState;

if (typeof window !== 'undefined') {
  replaceState = window && window.history && window.history.replaceState;
  pushState = window && window.history && window.history.pushState;
}

if (!replaceState) {
  module.exports = function () {};
} else {
  module.exports = function (newQuery, options) {
    options || (options = {});
    var isEmpty = !newQuery;
    var isString = !isEmpty && typeof newQuery === 'string';
    // whether to clear existing, any time a string is
    // already given we'll just set that as new query
    var clear = options.clear || isString;
    // history function to use
    var historyFunc = options.pushState ? pushState : replaceState;
    // the new query object, (we start with existing if not `clear:true`)
    var queryObj = clear ? {} : qs.parse(window.location.search);
    var newString;

    if (!isEmpty && !isString) {
      for (var key in newQuery) {
        var value = newQuery[key];
        // delete new falsy values, except number 0
        if (!value && value !== 0) {
          delete queryObj[key];
        } else {
          queryObj[key] = newQuery[key];
        }
      }
      newString = qs.stringify(queryObj);
    } else {
      newString = newQuery || '';
    }

    // only add the `?` if we've got something
    if (newString.length && newString.charAt(0) !== '?') {
      newString = '?' + newString;
    }

    historyFunc.call(window.history, options.state || window.history.state, '', window.location.pathname + (newString || ''));
  };
}

/***/ }),

/***/ 574:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Module dependencies.
 */

var parseuri = __webpack_require__(193);
var debug = __webpack_require__(94)('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url(uri, loc) {
  var obj = uri;

  // default to window.location
  loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' === typeof uri) {
    if ('/' === uri.charAt(0)) {
      if ('/' === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' !== typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : ':' + obj.port);

  return obj;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 575:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(576);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0,
      i;

  for (i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

/***/ }),

/***/ 576:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

/***/ }),

/***/ 577:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = __webpack_require__(269);
var isBuf = __webpack_require__(268);
var toString = Object.prototype.toString;
var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function (packet) {
  var buffers = [];
  var packetData = packet.data;
  var pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return { packet: pack, buffers: buffers };
};

function _deconstructPacket(data, buffers) {
  if (!data) return data;

  if (isBuf(data)) {
    var placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (isArray(data)) {
    var newData = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && !(data instanceof Date)) {
    var newData = {};
    for (var key in data) {
      newData[key] = _deconstructPacket(data[key], buffers);
    }
    return newData;
  }
  return data;
}

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function (packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = undefined; // no longer useful
  return packet;
};

function _reconstructPacket(data, buffers) {
  if (!data) return data;

  if (data && data._placeholder) {
    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
  } else if (isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    for (var key in data) {
      data[key] = _reconstructPacket(data[key], buffers);
    }
  }

  return data;
}

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function (data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if (withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function () {
        // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        } else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if (! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) {
      // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !isBuf(obj)) {
      // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),

/***/ 578:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(579);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 579:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(580);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0,
      i;

  for (i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy() {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

/***/ }),

/***/ 580:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

/***/ }),

/***/ 581:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),

/***/ 582:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = toArray;

function toArray(list, index) {
    var array = [];

    index = index || 0;

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i];
    }

    return array;
}

/***/ }),

/***/ 585:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),

/***/ 586:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(16);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = __webpack_require__(15);

var _MainPage = __webpack_require__(280);

var _MainPage2 = _interopRequireDefault(_MainPage);

var _CreateEvent = __webpack_require__(278);

var _CreateEvent2 = _interopRequireDefault(_CreateEvent);

var _CreateChat = __webpack_require__(277);

var _CreateChat2 = _interopRequireDefault(_CreateChat);

var _UserProfile = __webpack_require__(282);

var _UserProfile2 = _interopRequireDefault(_UserProfile);

var _EventPage = __webpack_require__(279);

var _EventPage2 = _interopRequireDefault(_EventPage);

var _UserProfileEdit = __webpack_require__(283);

var _UserProfileEdit2 = _interopRequireDefault(_UserProfileEdit);

var _SearchEvents = __webpack_require__(281);

var _SearchEvents2 = _interopRequireDefault(_SearchEvents);

var _ChatsPage = __webpack_require__(276);

var _ChatsPage2 = _interopRequireDefault(_ChatsPage);

var _Chats = __webpack_require__(275);

var _Chats2 = _interopRequireDefault(_Chats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NoMatch = function NoMatch() {
    return _react2.default.createElement(
        'h2',
        null,
        'No match to the route'
    );
};
var NoSuchRoute = function NoSuchRoute() {
    return _react2.default.createElement(
        'h2',
        null,
        '\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E'
    );
};
_reactDom2.default.render(_react2.default.createElement(
    _reactRouter.Router,
    { history: _reactRouter.browserHistory },
    _react2.default.createElement(_reactRouter.Route, { exact: true, path: '/', component: _MainPage2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/404', component: NoSuchRoute }),
    _react2.default.createElement(_reactRouter.Route, { path: '/User/:id', component: _UserProfile2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/Event/:id', component: _EventPage2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/User/:id/edit', component: _UserProfileEdit2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/CreateEvent', component: _CreateEvent2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/CreateChat', component: _CreateChat2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/SearchEvent', component: _SearchEvents2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/Chats', component: _Chats2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '/Chats/:id', component: _ChatsPage2.default }),
    _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch }),
    _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch })
), document.getElementById('main'));

/***/ }),

/***/ 587:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _BarAndModules = __webpack_require__(272);

var _BarAndModules2 = _interopRequireDefault(_BarAndModules);

var _EventsBlockOnMainPage = __webpack_require__(593);

var _EventsBlockOnMainPage2 = _interopRequireDefault(_EventsBlockOnMainPage);

var _KudagoBlock = __webpack_require__(595);

var _KudagoBlock2 = _interopRequireDefault(_KudagoBlock);

var _reactRouter = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Content = function (_React$Component) {
    _inherits(Content, _React$Component);

    function Content(props) {
        _classCallCheck(this, Content);

        var _this = _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).call(this, props));

        _this.state = {
            Loading: true
        };

        return _this;
    }

    _createClass(Content, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { className: 'content' },
                _react2.default.createElement(_EventsBlockOnMainPage2.default, null),
                _react2.default.createElement('div', { id: 'BarAndModules' })
            );
        }
    }]);

    return Content;
}(_react2.default.Component);

exports.default = Content;
;

/***/ }),

/***/ 588:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SearchResult = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

var _reactBootstrap = __webpack_require__(57);

var _SearchPageContnent = __webpack_require__(621);

var _SearchPageContnent2 = _interopRequireDefault(_SearchPageContnent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Content = function (_React$Component) {
    _inherits(Content, _React$Component);

    function Content(props) {
        _classCallCheck(this, Content);

        var _this = _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).call(this, props));

        _this.state = {
            loading: true,
            Events: [],
            EventsonMap: [],
            SearchEvents: [],
            myMap: {},
            OpenedStyle: {},
            Opened: false

        };
        _this.Map = _this.Map.bind(_this);
        _this.componentDidMount = _this.componentDidMount.bind(_this);
        _this.Search = _this.Search.bind(_this);
        _this.ClearFields = _this.ClearFields.bind(_this);
        _this.getData = _this.getData.bind(_this);
        _this.OpenFilters = _this.OpenFilters.bind(_this);
        return _this;
    }

    _createClass(Content, [{
        key: 'componentWillMount',
        value: function componentWillMount() {

            this.getData();
        }
    }, {
        key: 'getData',
        value: function getData() {
            $.when($.ajax({
                url: "/GetEventDataForSearch/",
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {
                this.setState({ Events: data });
                if (this.state.EventsonMap.length == 0) {
                    this.setState({ EventsonMap: data });
                }
            }.bind(this));
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            ymaps.ready(this.Map);
        }
    }, {
        key: 'Search',
        value: function Search() {
            var $range = $("#example_id");
            var value = $range.prop("value").split(";");
            console.log(value[0]);
            if (value[0] == "") {
                value[0] = "0";
                value[1] = "100";
            }
            for (var i = 0; i < this.state.Events.length; i++) {
                if (document.getElementById("selectCat").value == this.state.Events[i].Category || document.getElementById("selectCat").value == "0") {
                    //console.log(this.state.Events[i])
                    // console.log(this.state.Events[i].Category)
                    if (this.state.Events[i].date[0] == document.getElementById("date").value || this.state.Events[i].date[0] <= document.getElementById("date").value && this.state.Events[i].date[1] >= document.getElementById("date").value || document.getElementById("date").value == "") {
                        // console.log(this.state.Events[i])
                        // console.log(this.state.Events[i].date)

                        if (this.state.Events[i].Sex == $('input[name=Sex]:checked').val() || $('input[name=Sex]:checked').val() == "Любой" || this.state.Events[i].Sex == "Любой") {
                            //console.log(this.state.Events[i])
                            //console.log(this.state.Events[i].Sex)
                            var age = (this.state.Events[i].AgeRange + '').split(";");
                            console.log(age);
                            console.log(value);
                            console.log(parseFloat(age[0]) <= value[0] && parseFloat(age[1]) >= value[1]);
                            if (parseFloat(age[0]).between(value[0], value[1]) || parseFloat(age[1]).between(value[0], value[1]) || parseFloat(age[0]) <= value[0] && parseFloat(age[1]) >= value[1] || age[0] == 0 || value[0] == 0 && value[1] == 100) {

                                console.log("succsess");
                            } else {
                                delete this.state.Events[i];
                            }
                        } else {
                            delete this.state.Events[i];
                        }
                    } else {
                        delete this.state.Events[i];
                    }
                } else {
                    delete this.state.Events[i];
                }
            }

            this.state.myMap.geoObjects.removeAll();
            var myClusterer = new ymaps.Clusterer();
            this.setState({ EventsonMap: this.state.Events });
            this.state.Events.map(function (Event) {
                var myPlacemark = new ymaps.Placemark(Event.Location.split(','), {
                    // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                    balloonContentHeader: Event.Name,
                    balloonContentBody: "Категория: " + Event.Category + "<br/><Link to={'/Event/" + Event.EventId + "'} class='stupiahref'> Открыть</Link>",
                    hintContent: Event.Name
                });

                myClusterer.add(myPlacemark);
            }.bind(this));

            this.state.myMap.geoObjects.add(myClusterer);

            this.getData();
        }
    }, {
        key: 'Map',
        value: function Map() {

            this.state.myMap = new ymaps.Map("map", {
                center: [59.93863, 30.31413],
                zoom: 9
            }, {
                balloonMaxWidth: 200,
                searchControlProvider: 'yandex#search'
            });
            var myClusterer = new ymaps.Clusterer();

            this.state.EventsonMap.map(function (Event) {
                var myPlacemark = new ymaps.Placemark(Event.Location.split(','), {
                    // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                    balloonContentHeader: Event.Name,
                    balloonContentBody: "Категория: " + Event.Category + "<br/><Link to={'/Event/" + Event.EventId + "'} class='stupiahref'> Открыть</Link>",
                    hintContent: Event.Name
                });

                myClusterer.add(myPlacemark);
            }.bind(this));
            this.state.myMap.geoObjects.add(myClusterer);
            this.setState({ loading: false });
        }
    }, {
        key: 'ClearFields',
        value: function ClearFields() {
            document.getElementById("selectCat").value = "0";
            document.getElementById("date").value = "";
            document.getElementById("yes-button").checked = true;
            var slider = $("#example_id").data("ionRangeSlider");
            slider.reset();
            this.state.myMap.geoObjects.removeAll();
            var myClusterer = new ymaps.Clusterer();
            this.setState({ EventsonMap: this.state.Events });
            this.state.Events.map(function (Event) {
                var myPlacemark = new ymaps.Placemark(Event.Location.split(','), {
                    // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                    balloonContentHeader: Event.Name,
                    balloonContentBody: "Категория: " + Event.Category + "<br/><Link to={'/Event/" + Event.EventId + "'} class='stupiahref'> Открыть</Link>",
                    hintContent: Event.Name
                });

                myClusterer.add(myPlacemark);
            }.bind(this));
            this.state.myMap.geoObjects.add(myClusterer);
        }
    }, {
        key: 'OpenFilters',
        value: function OpenFilters() {
            if (!this.state.Opened) {
                var OpenedStyles = {
                    width: '100%', height: '100%', borderRadius: '20px', cursor: 'unset', backgroundColor: "rgba(24, 23, 23,0.8)"
                };
                this.setState({
                    Opened: true, OpenedStyle: OpenedStyles
                }, function () {
                    $("#example_id").ionRangeSlider({
                        hide_min_max: true,
                        keyboard: true,
                        min: 0,
                        max: 100,
                        from: 0,
                        to: 100,
                        type: 'double',
                        step: 1,
                        grid: true
                    });
                    console.log($("#example_id"));
                });
            } else {
                var _OpenedStyles = {};
                this.setState({ Opened: false, OpenedStyle: _OpenedStyles });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'contentSearchPage' },
                _react2.default.createElement(
                    'div',
                    { className: 'allfilters' },
                    _react2.default.createElement(
                        'div',
                        { className: 'EventsLabelSP' },
                        '\u0421\u043F\u0438\u0441\u043E\u043A \u0441\u043E\u0431\u044B\u0442\u0438\u0439'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'mapfilter' },
                        _react2.default.createElement('div', { id: 'map' }),
                        _react2.default.createElement(
                            'div',
                            { className: 'FiltersAndSearchOpen', style: this.state.OpenedStyle },
                            !this.state.Opened && _react2.default.createElement(
                                'div',
                                { className: 'FiltersAndSearchOpenText', onClick: this.OpenFilters },
                                _react2.default.createElement('i', { className: 'fas fa-filter fa-border fa-lg', 'data-fa-transform': 'shrink-4' }),
                                '  \u041F\u043E\u0438\u0441\u043A \u0438 \u0444\u0438\u043B\u044C\u0442\u0440\u044B'
                            ),
                            this.state.Opened && _react2.default.createElement(
                                'div',
                                null,
                                ' ',
                                _react2.default.createElement(
                                    'div',
                                    { className: 'FiltersAndSearchOpenText', onClick: this.OpenFilters },
                                    _react2.default.createElement('i', { className: 'fas fa-times fa-lg ' }),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'CloseLabel' },
                                        '  \u041D\u0430\u0437\u0430\u0434 \u043A \u043A\u0430\u0440\u0442\u0435'
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'filters' },
                                    _react2.default.createElement(
                                        _reactBootstrap.FormGroup,
                                        null,
                                        _react2.default.createElement(
                                            _reactBootstrap.ControlLabel,
                                            null,
                                            '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F'
                                        ),
                                        _react2.default.createElement(
                                            _reactBootstrap.FormControl,
                                            { componentClass: 'select', placeholder: 'select', name: 'SelectedCategory', onChange: this.Search, required: true, id: 'selectCat' },
                                            _react2.default.createElement(
                                                'option',
                                                { value: '0', className: 'lubaya' },
                                                '\u041B\u044E\u0431\u0430\u044F'
                                            ),
                                            _react2.default.createElement(
                                                'option',
                                                { value: '\u041F\u0440\u043E\u0433\u0443\u043B\u043A\u0430' },
                                                '\u041F\u0440\u043E\u0433\u0443\u043B\u043A\u0430'
                                            ),
                                            _react2.default.createElement(
                                                'option',
                                                { value: '\u041A\u0443\u043B\u044C\u0442\u0443\u0440\u043D\u043E\u0435' },
                                                '\u041A\u0443\u043B\u044C\u0442\u0443\u0440\u043D\u043E\u0435'
                                            ),
                                            _react2.default.createElement(
                                                'option',
                                                { value: '\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0434\u044B\u0445' },
                                                '\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0434\u044B\u0445'
                                            ),
                                            _react2.default.createElement(
                                                'option',
                                                { value: '\u041A\u0430\u0444\u0435' },
                                                '\u041A\u0430\u0444\u0435'
                                            ),
                                            _react2.default.createElement(
                                                'option',
                                                { value: '\u041D\u043E\u0447\u043D\u043E\u0439 \u043A\u043B\u0443\u0431' },
                                                '\u041D\u043E\u0447\u043D\u043E\u0439 \u043A\u043B\u0443\u0431'
                                            ),
                                            _react2.default.createElement(
                                                'option',
                                                { value: '\u041F\u043E\u0441\u0438\u0434\u0435\u043B\u043A\u0438' },
                                                '\u041F\u043E\u0441\u0438\u0434\u0435\u043B\u043A\u0438'
                                            )
                                        )
                                    ),
                                    _react2.default.createElement(
                                        _reactBootstrap.FormGroup,
                                        { className: 'formgroupinline' },
                                        _react2.default.createElement(
                                            _reactBootstrap.ControlLabel,
                                            null,
                                            ' \u0414\u0435\u043D\u044C '
                                        ),
                                        _react2.default.createElement(_reactBootstrap.FormControl, { type: 'date', id: 'date', name: 'date', onChange: this.Search, min: curDate() })
                                    ),
                                    _react2.default.createElement(
                                        _reactBootstrap.FormGroup,
                                        null,
                                        _react2.default.createElement(
                                            _reactBootstrap.ControlLabel,
                                            null,
                                            ' \u041F\u043E\u043B '
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'button-wrap' },
                                            _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'yes-button', defaultChecked: 'checked', onChange: this.Search, value: '\u041B\u044E\u0431\u043E\u0439' }),
                                            _react2.default.createElement(
                                                'label',
                                                { className: 'button-label', htmlFor: 'yes-button' },
                                                _react2.default.createElement(
                                                    'h1',
                                                    null,
                                                    '\u043B\u044E\u0431\u043E\u0439'
                                                )
                                            ),
                                            _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'no-button', onChange: this.Search, value: '\u041C\u0443\u0436\u0441\u043A\u043E\u0439' }),
                                            _react2.default.createElement(
                                                'label',
                                                { className: 'button-label', htmlFor: 'no-button' },
                                                _react2.default.createElement(
                                                    'h1',
                                                    null,
                                                    '\u043C\u0443\u0436\u0441\u043A\u043E\u0439'
                                                )
                                            ),
                                            _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'maybe-button', onChange: this.Search, value: '\u0416\u0435\u043D\u0441\u043A\u0438\u0439' }),
                                            _react2.default.createElement(
                                                'label',
                                                { className: 'button-label', htmlFor: 'maybe-button' },
                                                _react2.default.createElement(
                                                    'h1',
                                                    null,
                                                    '\u0436\u0435\u043D\u0441\u043A\u0438\u0439'
                                                )
                                            )
                                        )
                                    ),
                                    _react2.default.createElement(
                                        _reactBootstrap.FormGroup,
                                        { className: 'formgroupinline justyfied' },
                                        _react2.default.createElement(
                                            _reactBootstrap.ControlLabel,
                                            null,
                                            ' \u0412\u043E\u0437\u0440\u0430\u0441\u0442 '
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'rangeslider' },
                                            _react2.default.createElement('input', { type: 'text', id: 'example_id', name: 'example_name', onChange: this.Search, value: '' })
                                        )
                                    ),
                                    _react2.default.createElement(
                                        _reactBootstrap.Button,
                                        { className: 'formcaption', onClick: this.ClearFields, name: 'submit' },
                                        '\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B'
                                    ),
                                    _react2.default.createElement(
                                        _reactBootstrap.Button,
                                        { className: 'formcaption1', onClick: this.Search, name: 'submit' },
                                        '\u041D\u0430\u0439\u0442\u0438'
                                    )
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'searcheventresult' },
                    _react2.default.createElement(SearchResult, { Results: this.state.EventsonMap, myMap: this.state.myMap, MapGeo: this.state.MapGeo })
                )
            );
        }
    }]);

    return Content;
}(_react2.default.Component);

exports.default = Content;
;

var SearchResult = exports.SearchResult = function (_React$Component2) {
    _inherits(SearchResult, _React$Component2);

    function SearchResult(props) {
        _classCallCheck(this, SearchResult);

        return _possibleConstructorReturn(this, (SearchResult.__proto__ || Object.getPrototypeOf(SearchResult)).call(this, props));
    }

    _createClass(SearchResult, [{
        key: 'render',
        value: function render() {
            var i = 0;

            var FindResultsComponents = this.props.Results.map(function (Event) {

                if (!Event.PhotoURL) {
                    Event.PhotoURL = '../images/m1000x1000.jpg';
                }
                var divStyle = {
                    background: 'url(' + Event.PhotoURL + ') no-repeat center',
                    backgroundSize: '100% auto'
                };
                var age = (Event.AgeRange + '').split(";");
                return _react2.default.createElement(
                    _reactRouter.Link,
                    { to: '/Event/' + Event.EventId },
                    _react2.default.createElement(
                        'div',
                        { className: 'eventinresult' },
                        _react2.default.createElement('div', { className: 'eventimg', style: divStyle }),
                        _react2.default.createElement(
                            'div',
                            { className: 'eventdescbysearch' },
                            _react2.default.createElement(
                                'div',
                                { className: 'flexcont' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'eventleft' },
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'EventGreenText' },
                                        ' ',
                                        Event.Name,
                                        ' '
                                    ),
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'EventGreenTextDate' },
                                        Event.date[0],
                                        Event.date[1] && _react2.default.createElement(
                                            'span',
                                            null,
                                            ' \u0434\u043E ',
                                            Event.date[1]
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'EventGreenTextPar' },
                                        ' ',
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'GreenT' },
                                            Event.PeopleCount
                                        ),
                                        ' \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432'
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'eventright' },
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'eventrightCreator' },
                                        '\u0421\u043E\u0437\u0434\u0430\u0442\u0435\u043B\u044C: ',
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'GreenT' },
                                            ' ',
                                            Event.CreatorNameF,
                                            ' ',
                                            Event.CreatorNameS
                                        )
                                    ),
                                    age[0] != 0 && _react2.default.createElement(
                                        'p',
                                        { className: 'eventrightCreator' },
                                        '\u0412\u043E\u0437\u0440\u0430\u0441\u0442 : ',
                                        _react2.default.createElement(
                                            'span',
                                            { className: 'GreenT' },
                                            age[0],
                                            ' - ',
                                            age[1]
                                        )
                                    ),
                                    Event.Sex && _react2.default.createElement(
                                        'p',
                                        { className: 'eventrightCreator' },
                                        ' ',
                                        Event.Sex,
                                        '  \u043F\u043E\u043B'
                                    )
                                )
                            )
                        )
                    )
                );
            }.bind(this));
            return _react2.default.createElement(
                'div',
                null,
                FindResultsComponents
            );
        }
    }]);

    return SearchResult;
}(_react2.default.Component);

;

/***/ }),

/***/ 589:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _CreateChatContent = __webpack_require__(615);

var _CreateChatContent2 = _interopRequireDefault(_CreateChatContent);

var _reactBootstrap = __webpack_require__(57);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateChatContent = function (_React$Component) {
    _inherits(CreateChatContent, _React$Component);

    function CreateChatContent(props) {
        _classCallCheck(this, CreateChatContent);

        var _this = _possibleConstructorReturn(this, (CreateChatContent.__proto__ || Object.getPrototypeOf(CreateChatContent)).call(this, props));

        _this.state = {
            DateType: false,
            PeopleCount: true,
            ageany: true,
            coordiantes: [59.93863, 30.31413]
        };

        return _this;
    }

    _createClass(CreateChatContent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'changePhotoUrl',
        value: function changePhotoUrl(event) {
            $('#blah').attr('src', event.target.value);
        }
    }, {
        key: 'changePhotoFile',
        value: function changePhotoFile(event) {
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#blah').attr('src', e.target.result);
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { className: 'content' },
                _react2.default.createElement(
                    'div',
                    { className: 'CreateChatContent' },
                    _react2.default.createElement(
                        'p',
                        { className: 'fontfix2' },
                        ' \u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0447\u0430\u0442\u0430'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'CreateChatContentLeft' },
                        _react2.default.createElement(
                            'form',
                            { action: '/SendChat', method: 'POST', encType: 'multipart/form-data' },
                            _react2.default.createElement('input', { type: 'hidden', id: 'NBID', name: 'NBID', value: this.props.NBID }),
                            _react2.default.createElement(
                                _reactBootstrap.FormGroup,
                                { className: 'CreateChatFormName' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'CreateChatFormCaption ' },
                                    '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0447\u0430\u0442\u0430:'
                                ),
                                _react2.default.createElement(
                                    _reactBootstrap.InputGroup,
                                    { className: 'FlexFixx' },
                                    _react2.default.createElement(_reactBootstrap.FormControl, { type: 'text', name: 'ChatName', className: 'FontFix' })
                                )
                            ),
                            _react2.default.createElement(
                                _reactBootstrap.FormGroup,
                                { controlId: 'formControlsTextarea', className: 'CreateChatFormName' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'CreateChatFormCaption ' },
                                    '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:'
                                ),
                                _react2.default.createElement(
                                    _reactBootstrap.InputGroup,
                                    { className: 'FlexFixx FixMarg' },
                                    _react2.default.createElement(_reactBootstrap.FormControl, { componentClass: 'textarea', placeholder: '\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0447\u0430\u0442', name: 'ChatDescription', className: 'ChatDescription' })
                                )
                            ),
                            _react2.default.createElement(
                                _reactBootstrap.FormGroup,
                                { controlId: 'formControls', className: 'CreateChatFormName CenterContentFix' },
                                _react2.default.createElement(
                                    _reactBootstrap.InputGroup,
                                    null,
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'CreateChateventimgprewblock' },
                                        '\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0447\u0430\u0442\u0430',
                                        _react2.default.createElement('img', { id: 'blah', src: '/images/200.png', alt: 'your image' })
                                    ),
                                    _react2.default.createElement(
                                        'label',
                                        { htmlFor: 'imgInp', className: 'custom-photo-upload' },
                                        _react2.default.createElement('i', { className: 'fa fa-cloud-upload-alt' }),
                                        ' \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435'
                                    ),
                                    _react2.default.createElement('input', { id: 'imgInp', type: 'file', name: 'ChatPhoto', onChange: this.changePhotoFile }),
                                    _react2.default.createElement(_reactBootstrap.FormControl, { type: 'url', className: 'FontFix', placeholder: '\u0418\u043B\u0438 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 url \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F (\u041E\u0441\u0442\u0430\u0432\u0442\u044C\u0435 \u043F\u0443\u0441\u0442\u044B\u043C \u0435\u0441\u043B\u0438 \u0432\u044B \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0438 \u0441\u0432\u043E\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435)', name: 'PhotoURL', onChange: this.changePhotoUrl })
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'centerblock' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'formgroupinline' },
                                    _react2.default.createElement(
                                        _reactBootstrap.ControlLabel,
                                        { className: 'CreateChatFormCaption' },
                                        ' \u041F\u0440\u0438\u0432\u0430\u0442\u043D\u044B\u0439 \u0447\u0430\u0442'
                                    ),
                                    _react2.default.createElement('input', { id: 'cb4', className: 'tgl tgl-flat', type: 'checkbox', onChange: this.PeopleCountChange, name: 'PrivatetCheckBox', value: '1' }),
                                    _react2.default.createElement('label', { className: 'tgl-btn', htmlFor: 'cb4' })
                                ),
                                _react2.default.createElement(
                                    _reactBootstrap.Button,
                                    { className: 'FontFix CreateButton CenterContentFix', type: 'submit', name: 'submit' },
                                    '\u0421\u043E\u0437\u0434\u0430\u0442\u044C'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return CreateChatContent;
}(_react2.default.Component);

exports.default = CreateChatContent;
;

function FieldGroup(_ref) {
    var id = _ref.id,
        label = _ref.label,
        help = _ref.help,
        props = _ref.props;

    return _react2.default.createElement(
        _reactBootstrap.FormGroup,
        { controlId: id },
        _react2.default.createElement(
            _reactBootstrap.ControlLabel,
            null,
            label
        ),
        _react2.default.createElement(_reactBootstrap.FormControl, {
            type: 'text',
            value: 'text',
            placeholder: 'Enter text'
        }),
        help && _react2.default.createElement(
            _reactBootstrap.HelpBlock,
            null,
            help
        )
    );
}

/***/ }),

/***/ 590:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _CreateEventContent = __webpack_require__(624);

var _CreateEventContent2 = _interopRequireDefault(_CreateEventContent);

var _reactBootstrap = __webpack_require__(57);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateEventContent = function (_React$Component) {
    _inherits(CreateEventContent, _React$Component);

    function CreateEventContent(props) {
        _classCallCheck(this, CreateEventContent);

        var _this = _possibleConstructorReturn(this, (CreateEventContent.__proto__ || Object.getPrototypeOf(CreateEventContent)).call(this, props));

        _this.state = {
            DateType: false,
            PeopleCount: true,
            ageany: true,
            coordiantes: [59.93863, 30.31413]
        };
        _this.DateChange = _this.DateChange.bind(_this);
        _this.PeopleCountChange = _this.PeopleCountChange.bind(_this);
        _this.ageChange = _this.ageChange.bind(_this);
        _this.Map = _this.Map.bind(_this);
        return _this;
    }

    _createClass(CreateEventContent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            ymaps.ready(this.Map);

            $("#input-4").fileinput({ showCaption: false, showUpload: false });

            $("#example_id").ionRangeSlider({
                hide_min_max: true,
                keyboard: true,
                min: 0,
                max: 100,
                from: 16,
                to: 99,
                type: 'double',
                step: 1,
                grid: true
            });
        }
    }, {
        key: 'changePhotoUrl',
        value: function changePhotoUrl(event) {

            $('#blah').attr('src', event.target.value);
        }
    }, {
        key: 'changePhotoFile',
        value: function changePhotoFile(event) {
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah').attr('src', e.target.result);
                };

                reader.readAsDataURL(event.target.files[0]);
            }
        }
    }, {
        key: 'DateChange',
        value: function DateChange(event) {
            if (event.target.checked) {
                this.setState({ DateType: true });
            } else {
                this.setState({ DateType: false });
            }
        }
    }, {
        key: 'PeopleCountChange',
        value: function PeopleCountChange(event) {

            if (event.target.checked) {

                this.setState({ PeopleCount: false });
            } else {
                this.setState({ PeopleCount: true });
            }
        }
    }, {
        key: 'ageChange',
        value: function ageChange(event) {
            if (event.target.checked) {
                this.setState({ ageany: false });
            } else {
                this.setState({ ageany: true });
            }
        }
    }, {
        key: 'Map',
        value: function Map() {
            var myMap = void 0;
            myMap = new ymaps.Map("map", {
                center: [59.93863, 30.31413],
                zoom: 11
            }, {
                balloonMaxWidth: 200,
                searchControlProvider: 'yandex#search'
            });

            // Обработка события, возникающего при щелчке
            // левой кнопкой мыши в любой точке карты.
            // При возникновении такого события откроем балун.
            myMap.events.add('click', function (e) {
                if (!myMap.balloon.isOpen()) {
                    var coords = e.get('coords');
                    var names = [];

                    ymaps.geocode(coords).then(function (res) {

                        // Переберём все найденные результаты и
                        // запишем имена найденный объектов в массив names.
                        res.geoObjects.each(function (obj) {
                            names.push(obj.properties.get('name'));
                        });
                        myMap.balloon.open(coords, {
                            contentHeader: names[0],
                            contentBody: '<p>Ваше Место!</p>' + '<p>Здесь будет событие</p>'
                        });
                        // Добавим на карту метку в точку, по координатам
                        // которой запрашивали обратное геокодирование.
                    });

                    this.setState({ coordiantes: coords });
                } else {
                    myMap.balloon.close();
                }
            }.bind(this));

            myMap.events.add('contextmenu', function (e) {
                myMap.hint.open(e.get('coords'), 'Кто-то щелкнул правой кнопкой');
            });

            // Скрываем хинт при открытии балуна.
            myMap.events.add('balloonopen', function (e) {
                myMap.hint.close();
            });

            // Обработка события, возникающего при щелчке
            // правой кнопки мыши в любой точке карты.
            // При возникновении такого события покажем всплывающую подсказку
            // в точке щелчка.
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { className: 'content' },
                _react2.default.createElement(
                    'div',
                    { className: 'CreateEventForm' },
                    _react2.default.createElement(
                        'p',
                        { className: 'formcaption' },
                        ' \u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0432\u0430\u0448\u0435\u0433\u043E \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F'
                    ),
                    _react2.default.createElement(
                        'form',
                        { action: '/SendEvent', method: 'POST', encType: 'multipart/form-data' },
                        _react2.default.createElement('input', { type: 'hidden', id: 'NBID', name: 'NBID', value: this.props.NBID }),
                        _react2.default.createElement(
                            'div',
                            { className: 'formgroupinline justyfied' },
                            _react2.default.createElement(
                                _reactBootstrap.FormGroup,
                                { controlId: 'formControls', className: 'shortfieldgroup' },
                                _react2.default.createElement(
                                    _reactBootstrap.ControlLabel,
                                    null,
                                    '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435*'
                                ),
                                _react2.default.createElement(_reactBootstrap.FormControl, { type: 'text', name: 'NameofEvent', required: true,
                                    placeholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435' }),
                                _react2.default.createElement(
                                    _reactBootstrap.HelpBlock,
                                    null,
                                    '\u041A\u0440\u0430\u0442\u043A\u043E \u043E\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u0443\u0442\u044C \u0441\u043E\u0431\u044B\u0442\u0438\u044F'
                                )
                            ),
                            _react2.default.createElement(
                                _reactBootstrap.FormGroup,
                                { className: 'shortfieldgroup', controlId: 'formControlsSelect' },
                                _react2.default.createElement(
                                    _reactBootstrap.ControlLabel,
                                    null,
                                    '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F*'
                                ),
                                _react2.default.createElement(
                                    _reactBootstrap.FormControl,
                                    { componentClass: 'select', placeholder: 'select', className: 'FixHeigToSelect', name: 'SelectedCategory', required: true },
                                    _react2.default.createElement(
                                        'option',
                                        { value: '\u041F\u0440\u043E\u0433\u0443\u043B\u043A\u0430' },
                                        '\u041F\u0440\u043E\u0433\u0443\u043B\u043A\u0430'
                                    ),
                                    _react2.default.createElement(
                                        'option',
                                        { value: '\u041A\u0443\u043B\u044C\u0442\u0443\u0440\u043D\u043E\u0435' },
                                        '\u041A\u0443\u043B\u044C\u0442\u0443\u0440\u043D\u043E\u0435'
                                    ),
                                    _react2.default.createElement(
                                        'option',
                                        { value: '\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0434\u044B\u0445' },
                                        '\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u043E\u0442\u0434\u044B\u0445'
                                    ),
                                    _react2.default.createElement(
                                        'option',
                                        { value: '\u041A\u0430\u0444\u0435' },
                                        '\u041A\u0430\u0444\u0435'
                                    ),
                                    _react2.default.createElement(
                                        'option',
                                        { value: '\u041D\u043E\u0447\u043D\u043E\u0439 \u043A\u043B\u0443\u0431' },
                                        '\u041D\u043E\u0447\u043D\u043E\u0439 \u043A\u043B\u0443\u0431'
                                    ),
                                    _react2.default.createElement(
                                        'option',
                                        { value: '\u041F\u043E\u0441\u0438\u0434\u0435\u043B\u043A\u0438' },
                                        '\u041F\u043E\u0441\u0438\u0434\u0435\u043B\u043A\u0438'
                                    )
                                ),
                                _react2.default.createElement(
                                    _reactBootstrap.HelpBlock,
                                    null,
                                    '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0443 \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'formgroupinline1' },
                            _react2.default.createElement(
                                _reactBootstrap.FormGroup,
                                { controlId: 'formControlsTextarea', className: 'shortfieldgroup' },
                                _react2.default.createElement(
                                    _reactBootstrap.ControlLabel,
                                    null,
                                    '\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438'
                                ),
                                _react2.default.createElement(_reactBootstrap.FormControl, { componentClass: 'textarea', placeholder: '\u041E\u043F\u0438\u0448\u0438\u0442\u0435 \u0434\u0435\u0442\u0430\u043B\u0438 \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F', name: 'EventDescription' }),
                                _react2.default.createElement(
                                    _reactBootstrap.HelpBlock,
                                    null,
                                    '\u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438\u0442\u0435 \u0432\u0441\u0435 \u043E \u0447\u0435\u043C \u0434\u043E\u043B\u0436\u0435\u043D \u0437\u043D\u0430\u0442\u044C \u0442\u043E\u0442, \u043A\u043E\u0433\u043E \u0432\u044B \u0438\u0449\u0435\u0442\u0435'
                                )
                            ),
                            _react2.default.createElement(
                                _reactBootstrap.FormGroup,
                                { controlId: 'formControls', className: 'shortfieldgroup EventFromTime' },
                                _react2.default.createElement(
                                    _reactBootstrap.ControlLabel,
                                    null,
                                    ' \u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 '
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'eventimgprewblock' },
                                    _react2.default.createElement('img', { id: 'blah', src: '/images/200.jpg', alt: 'your image' })
                                ),
                                _react2.default.createElement(
                                    'label',
                                    { htmlFor: 'imgInp', className: 'custom-file-upload' },
                                    _react2.default.createElement('i', { className: 'fa fa-cloud-upload' }),
                                    ' \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435'
                                ),
                                _react2.default.createElement('input', { id: 'imgInp', type: 'file', name: 'EventPhoto', onChange: this.changePhotoFile }),
                                _react2.default.createElement(_reactBootstrap.FormControl, { type: 'url', placeholder: '\u0418\u043B\u0438 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 url \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F (\u041E\u0441\u0442\u0430\u0432\u0442\u044C\u0435 \u043F\u0443\u0441\u0442\u044B\u043C \u0435\u0441\u043B\u0438 \u0432\u044B \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0438 \u0441\u0432\u043E\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435)', name: 'EventURL', onChange: this.changePhotoUrl }),
                                _react2.default.createElement(
                                    _reactBootstrap.HelpBlock,
                                    null,
                                    '\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u043E \u0442\u0435\u043C\u0435'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            _reactBootstrap.FormGroup,
                            { controlId: 'formControls' },
                            _react2.default.createElement(
                                _reactBootstrap.ControlLabel,
                                null,
                                ' \u041C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 '
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'mapFormBOss' },
                                _react2.default.createElement('div', { id: 'map' })
                            ),
                            _react2.default.createElement('input', { type: 'hidden', name: 'MapLocation', value: this.state.coordiantes }),
                            _react2.default.createElement(
                                _reactBootstrap.HelpBlock,
                                null,
                                '\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u0441\u043E\u0431\u044B\u0442\u0438\u044F'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'formgroupinline' },
                            _react2.default.createElement(
                                'div',
                                { className: 'shortfieldgroup ' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'formgroupinline' },
                                    _react2.default.createElement(
                                        _reactBootstrap.ControlLabel,
                                        null,
                                        ' \u0414\u0430\u0442\u0430 '
                                    ),
                                    _react2.default.createElement('input', { id: 'cb3', className: 'tgl tgl-flat', type: 'checkbox', onChange: this.DateChange }),
                                    _react2.default.createElement('label', { className: 'tgl-btn', htmlFor: 'cb3' }),
                                    _react2.default.createElement(
                                        _reactBootstrap.ControlLabel,
                                        null,
                                        ' \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043D\u0435\u0439 '
                                    )
                                ),
                                !this.state.DateType && _react2.default.createElement(
                                    _reactBootstrap.FormGroup,
                                    { className: 'formgroupinline', controlId: 'formControls' },
                                    _react2.default.createElement(_reactBootstrap.FormControl, { type: 'date', name: 'SoloDate', min: curDate(), defaultValue: curDate(), required: true })
                                ),
                                this.state.DateType && _react2.default.createElement(
                                    _reactBootstrap.FormGroup,
                                    { className: 'formgroupinline', controlId: 'formControls' },
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        'C'
                                    ),
                                    _react2.default.createElement(_reactBootstrap.FormControl, { type: 'date', name: 'CoupleDateStart', min: curDate(), defaultValue: curDate(), required: true }),
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        '\u043F\u043E'
                                    ),
                                    _react2.default.createElement(_reactBootstrap.FormControl, { type: 'date', name: 'CoupleDateEnd', min: curDate(), required: true })
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'EventFromTime' },
                                _react2.default.createElement(
                                    _reactBootstrap.ControlLabel,
                                    null,
                                    ' \u0412\u0440\u0435\u043C\u044F '
                                ),
                                _react2.default.createElement(
                                    _reactBootstrap.FormGroup,
                                    { className: 'formgroupinline', controlId: 'formControls' },
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        'c'
                                    ),
                                    _react2.default.createElement(_reactBootstrap.FormControl, { type: 'time', name: 'CoupleTimeStart', defaultValue: '12:00', required: true }),
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        '\u0434\u043E'
                                    ),
                                    _react2.default.createElement(_reactBootstrap.FormControl, { type: 'time', name: 'CoupleTimeEnd' })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'formgroupinline' },
                            _react2.default.createElement(
                                'div',
                                { className: 'shortfieldgroup ' },
                                _react2.default.createElement(
                                    _reactBootstrap.ControlLabel,
                                    null,
                                    ' \u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432'
                                ),
                                _react2.default.createElement(
                                    _reactBootstrap.FormGroup,
                                    { className: 'formgroupinline', controlId: 'formControls' },
                                    _react2.default.createElement(
                                        _reactBootstrap.ControlLabel,
                                        null,
                                        ' \u043D\u0435\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u043E '
                                    ),
                                    _react2.default.createElement('input', { id: 'cb4', className: 'tgl tgl-flat', type: 'checkbox', onChange: this.PeopleCountChange, name: 'PeopleCountCheckBox', value: '1' }),
                                    _react2.default.createElement('label', { className: 'tgl-btn', htmlFor: 'cb4' }),
                                    !this.state.PeopleCount && _react2.default.createElement(_reactBootstrap.FormControl, { type: 'number', name: 'PeopleCount' }),
                                    ' ',
                                    this.state.PeopleCount && _react2.default.createElement(_reactBootstrap.FormControl, { type: 'number', disabled: true })
                                )
                            ),
                            _react2.default.createElement(
                                _reactBootstrap.FormGroup,
                                { controlId: 'formControls', className: 'EventFromTime' },
                                _react2.default.createElement(
                                    _reactBootstrap.ControlLabel,
                                    null,
                                    ' \u041F\u043E\u043B '
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'button-wrap' },
                                    _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'yes-button', defaultChecked: 'checked', value: '\u041B\u044E\u0431\u043E\u0439' }),
                                    _react2.default.createElement(
                                        'label',
                                        { className: 'button-label', htmlFor: 'yes-button' },
                                        _react2.default.createElement(
                                            'h1',
                                            null,
                                            '\u043B\u044E\u0431\u043E\u0439'
                                        )
                                    ),
                                    _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'no-button', value: '\u041C\u0443\u0436\u0441\u043A\u043E\u0439' }),
                                    _react2.default.createElement(
                                        'label',
                                        { className: 'button-label', htmlFor: 'no-button' },
                                        _react2.default.createElement(
                                            'h1',
                                            null,
                                            '\u043C\u0443\u0436\u0441\u043A\u043E\u0439'
                                        )
                                    ),
                                    _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'maybe-button', value: '\u0416\u0435\u043D\u0441\u043A\u0438\u0439' }),
                                    _react2.default.createElement(
                                        'label',
                                        { className: 'button-label', htmlFor: 'maybe-button' },
                                        _react2.default.createElement(
                                            'h1',
                                            null,
                                            '\u0436\u0435\u043D\u0441\u043A\u0438\u0439'
                                        )
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            _reactBootstrap.FormGroup,
                            { className: 'formgroupinline justyfied', controlId: 'formControls' },
                            _react2.default.createElement(
                                _reactBootstrap.ControlLabel,
                                null,
                                ' \u0412\u043E\u0437\u0440\u0430\u0441\u0442 \u043B\u044E\u0431\u043E\u0439'
                            ),
                            _react2.default.createElement('input', { id: 'cb5', className: 'tgl tgl-flat', type: 'checkbox', onChange: this.ageChange, name: 'AgeType', value: '1' }),
                            _react2.default.createElement('label', { className: 'tgl-btn', htmlFor: 'cb5' }),
                            _react2.default.createElement(
                                'div',
                                { className: 'rangeslider' },
                                this.state.ageany && _react2.default.createElement('div', { className: 'agerangeslidercover' }),
                                _react2.default.createElement('input', { type: 'text', id: 'example_id', name: 'example_name', value: '' })
                            )
                        ),
                        _react2.default.createElement(
                            _reactBootstrap.FormGroup,
                            { className: 'shortfieldgroup ', controlId: 'formControls' },
                            _react2.default.createElement(
                                _reactBootstrap.ControlLabel,
                                null,
                                ' \u0421\u0441\u044B\u043B\u043A\u0430 '
                            ),
                            _react2.default.createElement(_reactBootstrap.FormControl, { type: 'url', name: 'URLtoEvent' }),
                            _react2.default.createElement(
                                _reactBootstrap.HelpBlock,
                                null,
                                '\u0415\u0441\u043B\u0438 \u0435\u0441\u0442\u044C, \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u043D\u0430 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u044F'
                            )
                        ),
                        _react2.default.createElement(
                            _reactBootstrap.Button,
                            { className: 'formcaption', type: 'submit', name: 'submit' },
                            '\u0421\u043E\u0437\u0434\u0430\u0442\u044C'
                        )
                    )
                )
            );
        }
    }]);

    return CreateEventContent;
}(_react2.default.Component);

exports.default = CreateEventContent;
;

function FieldGroup(_ref) {
    var id = _ref.id,
        label = _ref.label,
        help = _ref.help,
        props = _ref.props;

    return _react2.default.createElement(
        _reactBootstrap.FormGroup,
        { controlId: id },
        _react2.default.createElement(
            _reactBootstrap.ControlLabel,
            null,
            label
        ),
        _react2.default.createElement(_reactBootstrap.FormControl, {
            type: 'text',
            value: 'text',
            placeholder: 'Enter text'
        }),
        help && _react2.default.createElement(
            _reactBootstrap.HelpBlock,
            null,
            help
        )
    );
}

/***/ }),

/***/ 591:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SearchResult = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _EventContent = __webpack_require__(616);

var _EventContent2 = _interopRequireDefault(_EventContent);

var _reactRouter = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Content = function (_React$Component) {
    _inherits(Content, _React$Component);

    function Content(props) {
        _classCallCheck(this, Content);

        var _this = _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).call(this, props));

        _this.state = {
            UserData: {},
            EventData: {},
            EventPlace: "",
            PeoplesData: [],
            ShowInfo: true,
            Zayavka: false,
            FindResults: [],
            Going: false,
            NotAuth: true,
            EventEnded: false,
            CreatorOfEvent: false,
            showchatmodule: false,
            Searchvalue: ""
        };
        _this.componentWillMount = _this.componentWillMount.bind(_this);
        _this.componentDidMount = _this.componentDidMount.bind(_this);
        _this.Map = _this.Map.bind(_this);
        _this.OpenListPeoples = _this.OpenListPeoples.bind(_this);
        _this.openchat = _this.openchat.bind(_this);
        _this.SendRequestToEvent = _this.SendRequestToEvent.bind(_this);
        _this.SendDeclRequestToEvent = _this.SendDeclRequestToEvent.bind(_this);
        _this.IsAuth = _this.IsAuth.bind(_this);
        _this.CloseListPeoples = _this.CloseListPeoples.bind(_this);
        _this.DeleteFriend = _this.DeleteFriend.bind(_this);
        _this.AcceptFriend = _this.AcceptFriend.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(Content, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            this.setState({ EventData: this.props.EventData });
            var arrayvar = this.state.PeoplesData.slice();
            var lenghtfrd = this.props.EventData.Peoples.length;
            var EventDataHere = this.props.EventData;

            var _loop = function _loop(i) {
                $.when($.ajax({
                    url: "/GetUser/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: EventDataHere.Peoples[i].NBID }),
                    dataType: 'json'
                })).then(function (data, textStatus, jqXHR) {
                    data.Status = EventDataHere.Peoples[i].Status;
                    arrayvar.push(data);
                    if (lenghtfrd == arrayvar.length) {
                        this.setState({ PeoplesData: arrayvar });
                    }
                }.bind(_this2));
            };

            for (var i = 0; i < lenghtfrd; i++) {
                _loop(i);
            }checkCookieforEvent(this.IsAuth);
            if (this.props.EventData.SoloDate && texttodate(this.props.EventData.SoloDate) < texttodate(curDate()) || this.props.EventData.CoupleDateEnd && texttodate(this.props.EventData.CoupleDateEnd) < texttodate(curDate())) {
                this.setState({ Zayavka: false, NotAuth: false, Going: false, EventEnded: true });
            }
        }
    }, {
        key: 'IsAuth',
        value: function IsAuth(cookies) {
            if (cookies != "") {

                if (cookies.NBID == parseInt(this.state.EventData.CreatorId)) {
                    this.setState({ CreatorOfEvent: true });
                }
                this.setState({ NotAuth: false, UserData: cookies });
                if (cookies.UserEvents) for (var i = 0; i < cookies.UserEvents.length; i++) {

                    if (cookies.UserEvents[i].EventID == this.props.EventData.EventId) {
                        if (cookies.UserEvents[i].Status == "1") {
                            if (!this.state.EventEnded) this.setState({ Going: true });
                        }
                        if (cookies.UserEvents[i].Status == "2") {
                            this.setState({ Zayavka: true });
                        }
                    }
                }
                if (!this.state.Going && !this.state.Zayavka && !this.state.EventEnded) {
                    this.setState({ NotAuth: true });
                }
            } else {

                this.setState({ NotAuth: false });
            }
        }
    }, {
        key: 'OpenListPeoples',
        value: function OpenListPeoples() {
            this.setState({ ShowInfo: false });
        }
    }, {
        key: 'CloseListPeoples',
        value: function CloseListPeoples() {
            this.setState({ ShowInfo: true });
        }
    }, {
        key: 'openchat',
        value: function openchat() {
            this.setState({ showchatmodule: true });
            $(function () {
                $('#modalResizable').draggable().resizable();
            });
        }
    }, {
        key: 'SendRequestToEvent',
        value: function SendRequestToEvent() {
            var requstToEvent = {
                EventId: this.state.EventData.EventId,
                UserId: this.state.UserData.NBID
            };
            ajaxReq("/SendRequestToEvent/", { requstToEvent: requstToEvent }, function () {});
            this.setState({ Zayavka: true, NotAuth: false });
        }
    }, {
        key: 'SendDeclRequestToEvent',
        value: function SendDeclRequestToEvent() {
            var requstToEvent = {
                EventId: this.state.EventData.EventId,
                UserId: this.state.UserData.NBID
            };
            ajaxReq("/SendDeclRequestToEvent/", { requstToEvent: requstToEvent }, function (result) {});
            this.setState({ Zayavka: false, NotAuth: true, Going: false });
        }
    }, {
        key: 'AcceptFriend',
        value: function AcceptFriend(key) {
            var requstToEvent = {
                EventId: this.state.EventData.EventId,
                UserId: key.NBID
            };
            var TempFDBIG = [];
            var tempFD = {};
            ajaxReq("/AcceptToEvent/", { requstToEvent: requstToEvent }, function (result) {});
            for (var i = 0; i < this.state.PeoplesData.length; i++) {
                tempFD = this.state.PeoplesData[i];
                if (this.state.PeoplesData[i].NBID == key.NBID) {
                    tempFD.Status = "1";
                    TempFDBIG.push(tempFD);
                } else {
                    TempFDBIG.push(tempFD);
                }
            }
            this.setState({ PeoplesData: TempFDBIG });
        }
    }, {
        key: 'DeleteFriend',
        value: function DeleteFriend(key) {
            var requstToEvent = {
                EventId: this.state.EventData.EventId,
                UserId: key.NBID
            };
            var TempFDBIG = [];
            var tempFD = {};
            ajaxReq("/DeclineToEvent/", { requstToEvent: requstToEvent }, function (result) {});
            for (var i = 0; i < this.state.PeoplesData.length; i++) {
                tempFD = this.state.PeoplesData[i];
                if (this.state.PeoplesData[i].NBID == key.NBID) {
                    tempFD.Status = "0";
                    TempFDBIG.push(tempFD);
                } else {
                    TempFDBIG.push(tempFD);
                }
            }
            this.setState({ PeoplesData: TempFDBIG });
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            this.setState({ Searchvalue: event.target.value });

            if (event.target.value != '') {
                var Search = event.target.value.split(/\s* \s*/);
                var FirstWord = Search[0];
                var SecondWord = Search[1];
                var find = [];
                if (!SecondWord) {
                    for (var i = 0; i < this.state.PeoplesData.length; i++) {
                        if (this.state.PeoplesData[i].UsrFirstName.toLowerCase().indexOf(FirstWord.toLowerCase()) >= 0 || this.state.PeoplesData[i].UsrLastName.toLowerCase().indexOf(FirstWord.toLowerCase()) >= 0) find.push(this.state.PeoplesData[i]);
                    }
                } else {
                    for (var _i = 0; _i < this.state.PeoplesData.length; _i++) {
                        if (this.state.PeoplesData[_i].UsrFirstName.toLowerCase().indexOf(FirstWord.toLowerCase()) >= 0 || this.state.PeoplesData[_i].UsrLastName.toLowerCase().indexOf(SecondWord.toLowerCase()) >= 0) find.push(this.state.PeoplesData[_i]);
                    }
                }
                if (find.length > 0) {
                    this.setState({ FindResults: find });
                }
            } else {
                this.setState({ FindResults: [] });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            ymaps.ready(this.Map);
        }
    }, {
        key: 'Map',
        value: function Map() {
            var myMap = void 0;
            var coords = this.state.EventData.Location.split(',');

            myMap = new ymaps.Map("map", {
                center: coords,
                zoom: 15
            }, {
                balloonMaxWidth: 200,
                searchControlProvider: 'yandex#search'
            });
            var names = [];
            ymaps.geocode(coords).then(function (res) {

                // Переберём все найденные результаты и
                // запишем имена найденный объектов в массив names.
                res.geoObjects.each(function (obj) {
                    names.push(obj.properties.get('name'));
                });
                this.setState({ EventPlace: names[0] });
                myMap.balloon.open(coords, {
                    contentHeader: names[0],
                    contentBody: '<p>Здесь будет событие</p>'
                });

                // Добавим на карту метку в точку, по координатам
                // которой запрашивали обратное геокодирование.
            }.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var countGoing = 0;
            var PeoplesGoind = this.state.PeoplesData.map(function (People) {
                if (!People.UsrPhotoBig) {
                    People.UsrPhotoBig = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + People.UsrPhotoBig + ')'

                };
                if (People.Status == 1) {
                    countGoing++;
                    if (this.state.ShowInfo) {
                        if (countGoing < 6) {
                            return _react2.default.createElement(
                                'div',
                                { className: 'memberblock', key: People.NBID, style: divStyle },
                                _react2.default.createElement('div', { className: 'friendtop' }),
                                _react2.default.createElement(
                                    _reactRouter.Link,
                                    { to: '/User/' + People.NBID },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'friendbottom' },
                                        _react2.default.createElement(
                                            'p',
                                            { className: 'FriendBottomBlockUserNames' },
                                            People.UsrFirstName,
                                            ' ',
                                            People.UsrLastName
                                        )
                                    )
                                )
                            );
                        }
                    } else {

                        return _react2.default.createElement(
                            'div',
                            { className: 'memberblock', key: People.NBID, style: divStyle },
                            _react2.default.createElement('div', { className: 'friendtop' }),
                            _react2.default.createElement(
                                _reactRouter.Link,
                                { to: '/User/' + People.NBID },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'friendbottom' },
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'FriendBottomBlockUserNames' },
                                        People.UsrFirstName,
                                        ' ',
                                        People.UsrLastName
                                    )
                                )
                            )
                        );
                    }
                }
            }.bind(this));

            var IncomingInvites = this.state.PeoplesData.map(function (People) {
                var _this3 = this;

                if (!People.UsrPhotoBig) {
                    People.UsrPhotoBig = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + People.UsrPhotoBig + ')'

                };
                if (People.Status == 2) {
                    return _react2.default.createElement(
                        'div',
                        { className: 'memberblock', key: People.NBID, style: divStyle },
                        _react2.default.createElement(
                            'div',
                            { className: 'friendtop' },
                            _react2.default.createElement('i', { className: 'fa fa-plus fa-border', onClick: function onClick() {
                                    return _this3.AcceptFriend(People);
                                } }),
                            _react2.default.createElement('i', { className: 'fa fa-minus fa-border', onClick: function onClick() {
                                    return _this3.DeleteFriend(People);
                                } })
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/User/' + People.NBID },
                            _react2.default.createElement(
                                'div',
                                { className: 'friendbottom' },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'FriendBottomBlockUserNames' },
                                    People.UsrFirstName,
                                    ' ',
                                    People.UsrLastName
                                )
                            )
                        )
                    );
                }
            }.bind(this));
            var divstyle = { display: 'block' };
            var divstyle4 = void 0;
            if (this.state.EventData.PhotoURL) {
                divstyle4 = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.75),rgba(29, 44, 70, 0.75)), url("' + this.state.EventData.PhotoURL + '")'
                };
            }
            var divStyleForOgUrl = {
                backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)))'
            };
            if (this.state.EventData.ogData) {
                var urltophoto = void 0;
                if (this.state.EventData.ogData.ogImage.url[0] == '/') {
                    urltophoto = 'http://' + this.state.EventData.URLtoEvent.replace(/(?:(?:https?|file|ftp)?:?\/\/([^\/\s]+)|([^\/]+\.(?:ru|com|net|org|biz|info|рф)))[^\s]*/ig, '$1$2') + this.state.EventData.ogData.ogImage.url;
                } else {
                    urltophoto = this.state.EventData.ogData.ogImage.url;
                }
                divStyleForOgUrl = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + urltophoto + ')'
                };
            }
            var divStyleUserPhotoBG = {};
            if (this.state.PeoplesData[0]) {

                if (!this.state.PeoplesData[0].UsrPhotoBig) {
                    var photo = '../images/LogoProfile.jpg';
                    divStyleUserPhotoBG = {
                        backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + photo + ')'

                    };
                } else {
                    var _photo = this.state.PeoplesData[0].UsrPhotoBig;
                    divStyleUserPhotoBG = {
                        backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + _photo + ')'

                    };
                }
            }

            return _react2.default.createElement(
                'div',
                { className: 'CreateEventContentBg', style: divstyle },
                _react2.default.createElement(
                    'div',
                    { className: 'content ' },
                    _react2.default.createElement(
                        'div',
                        { className: 'HeadBlockEventContent' },
                        _react2.default.createElement('div', { className: 'MenuButtonBlockEventContent' }),
                        _react2.default.createElement(
                            'div',
                            { className: 'HeadInformationBlockEventContent', style: divstyle4 },
                            _react2.default.createElement(
                                'div',
                                { className: 'EventPagecaptionandtime' },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'EventPageeventcaption' },
                                    this.state.EventData.Name
                                ),
                                _react2.default.createElement(
                                    'p',
                                    { className: 'EventPagedatetime' },
                                    this.state.EventData.SoloDate,
                                    ' ',
                                    this.state.EventData.CoupleTimeStart,
                                    ' ',
                                    (this.state.EventData.CoupleDateEnd || this.state.EventData.CoupleTimeEnd) && _react2.default.createElement(
                                        'span',
                                        null,
                                        '-'
                                    ),
                                    ' ',
                                    this.state.EventData.CoupleDateEnd,
                                    ' ',
                                    this.state.EventData.CoupleTimeEnd
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'EventPageeventreq', name: 'submit' },
                                this.state.EventEnded && _react2.default.createElement(
                                    'div',
                                    { className: 'EventPageRedLabel' },
                                    '\u0421\u043E\u0431\u044B\u0442\u0438\u0435 \u0437\u0430\u043A\u043E\u043D\u0447\u0438\u043B\u043E\u0441\u044C'
                                ),
                                this.state.NotAuth && _react2.default.createElement(
                                    'div',
                                    { className: 'EventPageGreenLabel', onClick: this.SendRequestToEvent },
                                    '\u041F\u0440\u0438\u0441\u043E\u0435\u0434\u0435\u043D\u0438\u0442\u044C\u0441\u044F'
                                ),
                                this.state.Zayavka && _react2.default.createElement(
                                    'div',
                                    { className: 'EventPageOrangeLabel', onClick: this.SendDeclRequestToEvent },
                                    '\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0417\u0430\u044F\u0432\u043A\u0443'
                                ),
                                this.state.Going && _react2.default.createElement(
                                    'div',
                                    null,
                                    ' ',
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'EventPageGreenLabel' },
                                        _react2.default.createElement('i', { className: 'fas fa-bullhorn fa-lg' }),
                                        ' '
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'EventPageRedLabel', onClick: this.SendDeclRequestToEvent },
                                        _react2.default.createElement('i', { className: 'fa fa-ban fa-lg' }),
                                        ' '
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'confines' },
                                this.state.EventData.AgeRange && _react2.default.createElement(
                                    'div',
                                    null,
                                    this.state.EventData.AgeRange != 0 && _react2.default.createElement(
                                        'p',
                                        { className: 'agec' },
                                        _react2.default.createElement(
                                            'span',
                                            null,
                                            this.state.EventData.AgeRange.split(";")[0],
                                            '-',
                                            this.state.EventData.AgeRange.split(";")[1],
                                            ' \u043B\u0435\u0442'
                                        )
                                    )
                                ),
                                ' ',
                                _react2.default.createElement(
                                    'p',
                                    { className: 'gender' },
                                    this.state.EventData.Sex == "Мужской" && _react2.default.createElement('i', { className: 'fa fa-mars' }),
                                    this.state.EventData.Sex == "Женский" && _react2.default.createElement('i', { className: 'fa fa-venus' })
                                ),
                                _react2.default.createElement('p', null)
                            )
                        )
                    ),
                    this.state.ShowInfo && _react2.default.createElement(
                        'div',
                        { className: 'eventbottom' },
                        _react2.default.createElement(
                            'div',
                            { className: 'EventBLeftCol' },
                            _react2.default.createElement(
                                'div',
                                { className: 'EventBLeftColAuthor' },
                                this.state.PeoplesData[0] && _react2.default.createElement(
                                    'div',
                                    null,
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'EventBLeftColAuthorLabel' },
                                        '\u0410\u0432\u0442\u043E\u0440 \u0441\u043E\u0431\u044B\u0442\u0438\u044F'
                                    ),
                                    _react2.default.createElement('div', { className: 'divStyleUserPhotoBG', style: divStyleUserPhotoBG }),
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'EventBLeftColAuthorLabelName' },
                                        this.state.PeoplesData[0].UsrFirstName,
                                        ' ',
                                        this.state.PeoplesData[0].UsrLastName
                                    ),
                                    _react2.default.createElement(
                                        _reactRouter.Link,
                                        { to: '/User/' + this.state.PeoplesData[0].NBID },
                                        '  ',
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'EventBLeftColAuthorOpenButton' },
                                            '\u041F\u0440\u043E\u0444\u0438\u043B\u044C'
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'EventBLeftColListButton' },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'EventBLeftColListButtonLabel' },
                                    '\u0421\u043F\u0438\u0441\u043E\u043A \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432: ',
                                    this.state.PeoplesData.length
                                ),
                                _react2.default.createElement('i', { className: 'fas fa-list fa-border fa-lg EventBLeftColListButtonListIcon' })
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'EventBRightCol' },
                            _react2.default.createElement(
                                'div',
                                { className: 'EventBRightColLastRed' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'EventBRightColLastReddroppgin' },
                                    ' 02.08.19'
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'EventBRightColLastRedTrig' },
                                    '\u0414\u0430\u0442\u0430 \u043B\u0430\u0441\u0442 \u0440\u0435\u043B'
                                )
                            ),
                            _react2.default.createElement(
                                'p',
                                { className: 'eventdesc' },
                                this.state.EventData.Description
                            )
                        )
                    ),
                    this.state.showchatmodule && _react2.default.createElement(
                        'div',
                        { id: 'modalResizable' },
                        _react2.default.createElement(
                            'div',
                            { className: 'closesms' },
                            'X'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'eventbottom' },
                        _react2.default.createElement(
                            'p',
                            { className: 'geocaption' },
                            _react2.default.createElement('i', { className: 'fa fa-map-o', 'aria-hidden': 'true' }),
                            ' ',
                            this.state.EventPlace
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'mapFormBOss' },
                            _react2.default.createElement('div', { id: 'map' })
                        )
                    )
                )
            );
        }
    }]);

    return Content;
}(_react2.default.Component);

exports.default = Content;
;

var SearchResult = exports.SearchResult = function (_React$Component2) {
    _inherits(SearchResult, _React$Component2);

    function SearchResult() {
        _classCallCheck(this, SearchResult);

        return _possibleConstructorReturn(this, (SearchResult.__proto__ || Object.getPrototypeOf(SearchResult)).apply(this, arguments));
    }

    _createClass(SearchResult, [{
        key: 'render',
        value: function render() {
            var FindResultsComponents = this.props.Results.map(function (UserFind) {
                if (!UserFind.UsrPhotoBig) {
                    UserFind.UsrPhotoBig = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + UserFind.UsrPhotoBig + ')'

                };
                if (UserFind.Status == 1) {
                    return _react2.default.createElement(
                        'div',
                        { className: 'memberblock', key: UserFind.NBID, style: divStyle },
                        _react2.default.createElement('div', { className: 'friendtop' }),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/User/' + UserFind.NBID },
                            _react2.default.createElement(
                                'div',
                                { className: 'friendbottom' },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'FriendBottomBlockUserNames' },
                                    UserFind.UsrFirstName,
                                    ' ',
                                    UserFind.UsrLastName
                                )
                            )
                        )
                    );
                }
            });
            return _react2.default.createElement(
                'div',
                null,
                FindResultsComponents
            );
        }
    }]);

    return SearchResult;
}(_react2.default.Component);

;

/***/ }),

/***/ 592:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventTab = function (_React$Component) {
    _inherits(EventTab, _React$Component);

    function EventTab(props) {
        _classCallCheck(this, EventTab);

        var _this = _possibleConstructorReturn(this, (EventTab.__proto__ || Object.getPrototypeOf(EventTab)).call(this, props));

        _this.state = {
            EventsData: [],
            UserData: {}
        };
        _this.componentWillMount = _this.componentWillMount.bind(_this);
        _this.LoadDataFrD = _this.LoadDataFrD.bind(_this);

        return _this;
    }

    _createClass(EventTab, [{
        key: 'componentWillMount',
        value: function componentWillMount() {

            this.LoadDataFrD();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            this.setState({ UserData: nextProps.UserData, EventsData: [] });
            if (nextProps.UserData.UserEvents) {
                (function () {
                    var arrayvar = _this2.state.EventsData.slice();
                    var lenghtfrd = nextProps.UserData.UserEvents.length;
                    var UserDataHere = nextProps.UserData;

                    var _loop = function _loop(i) {
                        $.when($.ajax({
                            url: "/GetEventData/",
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ id: UserDataHere.UserEvents[i].EventID }),
                            dataType: 'json'
                        })).then(function (data, textStatus, jqXHR) {
                            data.Status = UserDataHere.UserEvents[i].Status;
                            arrayvar.push(data);
                            if (lenghtfrd == arrayvar.length) {
                                this.setState({ EventsData: arrayvar });
                            }
                        }.bind(_this2));
                    };

                    for (var i = 0; i < lenghtfrd; i++) {
                        _loop(i);
                    }
                })();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'LoadDataFrD',
        value: function LoadDataFrD() {
            var _this3 = this;

            this.setState({ UserData: this.props.UserData });

            if (this.props.UserData.UserEvents) {
                (function () {

                    var arrayvar = _this3.state.EventsData.slice();
                    var lenghtfrd = _this3.props.UserData.UserEvents.length;
                    var UserDataHere = _this3.props.UserData;

                    var _loop2 = function _loop2(i) {
                        $.when($.ajax({
                            url: "/GetEventData/",
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ id: UserDataHere.UserEvents[i].EventID }),
                            dataType: 'json'
                        })).then(function (data, textStatus, jqXHR) {
                            data.Status = UserDataHere.UserEvents[i].Status;
                            arrayvar.push(data);
                            if (lenghtfrd == arrayvar.length) {
                                this.setState({ EventsData: arrayvar });
                            }
                        }.bind(_this3));
                    };

                    for (var i = 0; i < lenghtfrd; i++) {
                        _loop2(i);
                    }
                })();
            }
        }
    }, {
        key: 'LoadCarusuel',
        value: function LoadCarusuel() {}
    }, {
        key: 'render',
        value: function render() {

            var Events = this.state.EventsData.filter(function (Event) {
                var now = moment();
                if (Event.Status == 1 && (Event.SoloDate && now.isAfter(moment(Event.SoloDate, 'DD MMM YYYY').locale('ru').format("YYYY-MM-DD")) || Event.CoupleDateEnd && now.isAfter(moment(Event.CoupleDateEnd, 'DD MMM YYYY').locale('ru').format("YYYY-MM-DD")))) {
                    return true;
                } else return false;
            }.bind(this));
            var Events1 = this.state.EventsData.filter(function (Event) {
                var now = moment();
                if (Event.Status == 1 && (Event.SoloDate && now.isAfter(moment(Event.SoloDate, 'DD MMM YYYY').locale('ru').format("YYYY-MM-DD")) || Event.CoupleDateEnd && now.isAfter(moment(Event.CoupleDateEnd, 'DD MMM YYYY').locale('ru').format("YYYY-MM-DD")))) {
                    return false;
                } else return true;
            }.bind(this));
            var ActiveEvent = Events.map(function (Event) {
                if (!Event.PhotoURL) {
                    Event.PhotoURL = '../images/LogoProfile.jpg';
                }
                if (!Event.CreatorPhoto) {
                    Event.CreatorPhoto = '../images/LogoProfile.jpg';
                }
                var divStyle1 = {
                    backgroundImage: 'url(' + Event.CreatorPhoto + ')'
                };
                var countGoing = 0;
                for (var i = 0; i < Event.Peoples.length; i++) {
                    if (Event.Peoples[i].Status == 1) {
                        countGoing++;
                    }
                }
                var divStyle = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Event.PhotoURL + ')'
                };

                return _react2.default.createElement(
                    _reactRouter.Link,
                    { to: '/Event/' + Event.EventId },
                    _react2.default.createElement(
                        'div',
                        { className: 'eventblock', key: Event.EventId, style: divStyle },
                        _react2.default.createElement(
                            'p',
                            { className: 'eventblocktoptext' },
                            Event.Name
                        ),
                        _react2.default.createElement(
                            'p',
                            { className: 'eventblockdate' },
                            Event.SoloDate,
                            ' ',
                            Event.CoupleDateStart
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'eventblockbottom' },
                            _react2.default.createElement(
                                'p',
                                { className: 'eventblockcreator' },
                                ' ',
                                countGoing,
                                ' ',
                                Event.PeopleCount != 0 && _react2.default.createElement(
                                    'span',
                                    null,
                                    '/',
                                    Event.PeopleCount
                                ),
                                ' \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 '
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'eventblockcreator' },
                                ' ',
                                _react2.default.createElement('div', { className: 'userpic userpic_xs', style: divStyle1 }),
                                '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0443\u0435\u0442: ',
                                Event.CreatorNameF
                            )
                        )
                    )
                );
            }.bind(this));

            var OldEvents = Events1.map(function (Event) {
                if (!Event.PhotoURL) {
                    Event.PhotoURL = '../images/LogoProfile.jpg';
                }
                if (!Event.CreatorPhoto) {
                    Event.CreatorPhoto = '../images/LogoProfile.jpg';
                }
                var divStyle1 = {
                    backgroundImage: 'url(' + Event.CreatorPhoto + ')'
                };

                var divStyle = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Event.PhotoURL + ')'
                };
                var countGoing = 0;
                for (var i = 0; i < Event.Peoples.length; i++) {
                    if (Event.Peoples[i].Status == 1) {
                        countGoing++;
                    }
                }
                return _react2.default.createElement(
                    'div',
                    { className: 'eventblock', key: Event.EventId, style: divStyle },
                    _react2.default.createElement(
                        'div',
                        { className: 'eventblocktop' },
                        _react2.default.createElement(
                            'div',
                            { className: 'eventblocktoptext' },
                            _react2.default.createElement(
                                _reactRouter.Link,
                                { to: '/Event/' + Event.EventId },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'evenblockttitle' },
                                    Event.Name
                                )
                            ),
                            _react2.default.createElement(
                                'p',
                                { className: 'eventblockdate' },
                                Event.SoloDate,
                                ' ',
                                Event.CoupleDateStart,
                                ' ',
                                Event.CoupleTimeStart
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'eventblockbottom' },
                        _react2.default.createElement(
                            'p',
                            { className: 'eventblockcreator' },
                            ' ',
                            countGoing,
                            ' ',
                            Event.PeopleCount != 0 && _react2.default.createElement(
                                'span',
                                null,
                                '/',
                                Event.PeopleCount
                            ),
                            ' \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 '
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'eventblockcreator' },
                            ' ',
                            _react2.default.createElement('div', { className: 'userpic userpic_xs', style: divStyle1 }),
                            '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0443\u0435\u0442: ',
                            Event.CreatorNameF
                        )
                    )
                );
            }.bind(this));

            if (ActiveEvent != 0 && ActiveEvent.length == this.state.EventsData.length) ///добавить длинну потом
                {
                    setTimeout(function () {

                        $('.blocksarea').slick({
                            dots: true,
                            infinite: false,
                            speed: 300,
                            slidesToShow: 4,
                            variableWidth: true,
                            slidesToScroll: 4,

                            responsive: [{
                                breakpoint: 1520,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                    infinite: true,
                                    dots: true
                                }
                            }, {
                                breakpoint: 950,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            }, {
                                breakpoint: 614,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                                // You can unslick at a given breakpoint now by adding:
                                // settings: "unslick"
                                // instead of a settings object
                            }]

                        });
                    }, 10);
                }
            var showOldEvents = false;
            if (OldEvents) {
                showOldEvents = true;
            } else {
                showOldEvents = false;
            }
            console.log(showOldEvents);
            var showEvents = false;
            if (ActiveEvent) {
                showEvents = true;
            } else {
                showEvents = false;
            }

            return _react2.default.createElement(
                'div',
                { className: 'eventsprew' },
                showEvents && _react2.default.createElement(
                    'section',
                    { className: 'blocksarea' },
                    ActiveEvent
                ),
                showOldEvents && _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'p',
                        { className: 'singletab' },
                        '\u041F\u0440\u043E\u0448\u0435\u0434\u0448\u0438\u0435'
                    ),
                    _react2.default.createElement('hr', { className: 'fullhr' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'oldevents' },
                        OldEvents
                    )
                )
            );
        }
    }]);

    return EventTab;
}(_react2.default.Component);

exports.default = EventTab;
;

/***/ }),

/***/ 593:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

var _EventsBlockOnMainPage = __webpack_require__(274);

var _EventsBlockOnMainPage2 = _interopRequireDefault(_EventsBlockOnMainPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isResizeble = false;
var timingg;

var EventsBlockOnMainPage = function (_React$Component) {
    _inherits(EventsBlockOnMainPage, _React$Component);

    function EventsBlockOnMainPage(props) {
        _classCallCheck(this, EventsBlockOnMainPage);

        var _this = _possibleConstructorReturn(this, (EventsBlockOnMainPage.__proto__ || Object.getPrototypeOf(EventsBlockOnMainPage)).call(this, props));

        _this.state = {
            EventReceived: [],
            ButtonActive: { color: '#161515',
                backgroundColor: "#f7f0f0" },
            ButtonDisactivated: { color: '#f7f0f0',
                backgroundColor: "#161515" },
            ButtonState: true,
            ClosedAlert: localStorage.getItem('RegisterAlert'),
            GetClosetEvent: {},
            TimerCouldown: "Ближайших событий нет",
            LoadItems: 6,
            Items: [],
            EvrethingIsLoaded: false
        };

        _this.ChangeClick = _this.ChangeClick.bind(_this);

        _this.CloseAlert = _this.CloseAlert.bind(_this);
        _this.LoadMore = _this.LoadMore.bind(_this);
        _this.LoadMore();
        return _this;
    }

    _createClass(EventsBlockOnMainPage, [{
        key: 'LoadMore',
        value: function LoadMore() {
            $.when($.ajax({
                url: "/GetChats/",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ Items: this.state.LoadItems, CountOfLoad: 6 }),
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {
                if (data !== "End") {
                    this.setState({ Items: this.state.Items.concat(data) });
                    this.setState({ LoadItems: this.state.LoadItems + 6 });
                } else {
                    this.setState({ EvrethingIsLoaded: true });
                }
            }.bind(this));
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            $.when($.ajax({
                url: "/GetEventEasy/",
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {

                this.setState({ EventReceived: data });
            }.bind(this));

            $.when($.ajax({
                url: "/GetClosetEvent/",
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {
                this.setState({ GetClosetEvent: data });
                var eventTime = moment(data.date[0])._d;
                var currentTime = moment()._d;
                var TimeStart = data.Time.slice(0, 2);
                var MinuteStart = data.Time.slice(3, 5);
                var diffTime = eventTime - currentTime - 10800000 + (TimeStart * 3600000 + MinuteStart * 60000);
                var duration = moment.duration(diffTime, 'milliseconds');
                var interval = 1000;
                timingg = setInterval(function () {
                    duration = moment.duration(duration - interval, 'milliseconds');
                    this.setState({ TimerCouldown: duration.days() + " д. " + duration.hours() + " ч. " + duration.minutes() + " м. " + duration.seconds() + " с." });
                }.bind(this), interval);
            }.bind(this));
        }
    }, {
        key: 'ChangeClick',
        value: function ChangeClick() {
            this.setState({ ButtonState: !this.state.ButtonState });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(timingg);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {

            setTimeout(function () {
                $('.EventsPrimaryBlockOnMainPageContent').flickity({
                    // options
                    accessibility: true,
                    cellAlign: 'left',
                    contain: true,
                    autoPlay: 2500,
                    wrapAround: true
                });
            }, 1000); // время в мс
        }
    }, {
        key: 'CloseAlert',
        value: function CloseAlert() {
            localStorage.setItem('RegisterAlert', 'false');
            this.setState({ ClosedAlert: localStorage.getItem('RegisterAlert') });
        }
    }, {
        key: 'render',
        value: function render() {
            {

                var ResultsComponents = this.state.EventReceived.map(function (Event) {
                    if (!Event.PhotoURL) {
                        Event.PhotoURL = '../images/fav.png';
                    }

                    var divStyle = {
                        float: "left",
                        backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.65),rgba(29, 44, 70, 0.65)),url(' + Event.PhotoURL + ')'

                    };
                    var divStyle1 = {
                        float: "left",
                        backgroundImage: 'url(' + Event.CreatorPhoto + ')'

                    };

                    return _react2.default.createElement(
                        'div',
                        { className: 'EventsPrimaryBlockOnMainPageContentBlock' },
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/Event/' + Event.EventId, key: Event.EventId },
                            _react2.default.createElement(
                                'div',
                                { style: divStyle, className: 'EventsPrimaryBlockOnMainPageContentBlockphoto' },
                                ' ',
                                _react2.default.createElement(
                                    'p',
                                    { style: divStyle1, className: 'EventsPrimaryBlockOnMainPageContentBlockCreatorPhotoTitle' },
                                    ' '
                                ),
                                _react2.default.createElement('br', null),
                                _react2.default.createElement('br', null),
                                ' ',
                                _react2.default.createElement(
                                    'p',
                                    { className: 'EventsPrimaryBlockOnMainPageContentBlockObyavNameTitle' },
                                    Event.Name
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'EventsPrimaryBlockOnMainPageContentBlockText' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'EventsPrimaryBlockOnMainPageContentBlockTextCat' },
                                    ' ',
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        Event.Category,
                                        ' '
                                    )
                                ),
                                _react2.default.createElement(
                                    'p',
                                    { className: 'EventsPrimaryBlockOnMainPageContentBlockTextDate' },
                                    Event.date[0],
                                    Event.date[1] && _react2.default.createElement(
                                        'span',
                                        null,
                                        ' - ',
                                        Event.date[1]
                                    )
                                ),
                                _react2.default.createElement('p', { className: '', dangerouslySetInnerHTML: { __html: Event.Desc } })
                            )
                        )
                    );
                }.bind(this));
                var ResultsComponentsChats = this.state.Items.map(function (Chat) {
                    if (!Chat.PhotoURL) {
                        Chat.PhotoURL = '../images/fav.png';
                    }

                    var divStyle = {
                        float: "left",
                        backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.65),rgba(29, 44, 70, 0.65)),url(' + Chat.PhotoURL + ')'

                    };
                    var divStyle1 = {
                        float: "left"

                    };
                    return _react2.default.createElement(
                        'div',
                        { className: 'ChatBlockOnMainPage', id: Chat.ChatsId },
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/Chats/' + Chat.ChatsId, style: divStyle, className: 'ChatBlockOnHover', id: Chat.ChatsId },
                            '\u041E\u0442\u043A\u0440\u044B\u0442\u044C'
                        ),
                        _react2.default.createElement(
                            'div',
                            { key: Chat.ChatsId },
                            _react2.default.createElement(
                                'div',
                                { style: divStyle, className: 'ChatsPrimaryBlockOnMainPageContentBlockphoto' },
                                ' ',
                                _react2.default.createElement(
                                    'p',
                                    { style: divStyle1, className: 'ChatsPopularityOnChatsPage' },
                                    ' ',
                                    Chat.Private == "0" && Chat.Popularity,
                                    ' ',
                                    Chat.Private == "1" && _react2.default.createElement('i', { className: 'fa fa-lock', 'aria-hidden': 'true' }),
                                    ' '
                                ),
                                _react2.default.createElement('br', null),
                                _react2.default.createElement('br', null),
                                ' ',
                                _react2.default.createElement(
                                    'p',
                                    { className: 'ChatsPrimaryBlockOnMainPageContentBlockObyavNameTitle' },
                                    Chat.Name
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'ChatsPrimaryBlockOnMainPageContentBlockText' },
                                _react2.default.createElement('p', { className: '', dangerouslySetInnerHTML: { __html: Chat.Description } })
                            )
                        )
                    );
                }.bind(this));

                return _react2.default.createElement(
                    'div',
                    { className: 'EventsPrimaryBlockOnMainPage' },
                    !this.state.ClosedAlert && _react2.default.createElement(
                        'div',
                        { className: 'EventsPrimaryBlockOnMainPageAlert' },
                        '\u0412\u044B \u043D\u0435 \u0437\u0430\u0440\u0435\u0433\u0435\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B;( \u0414\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A\u043E \u0432\u0441\u0435\u043C\u0443 \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u0443 \u0437\u0430\u0440\u0435\u0433\u0435\u0441\u0442\u0440\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C \u0432 \u043C\u0435\u043D\u044E.',
                        _react2.default.createElement(
                            'i',
                            { className: 'EventsPrimaryBlockOnMainPageAlertClose', onClick: this.CloseAlert },
                            'X'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'ChatsBlockLabel' },
                        '\u0421\u043E\u0431\u044B\u0442\u0438\u044F'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'EventsPrimaryBlockOnMainPagelabel' },
                        _react2.default.createElement(
                            'b',
                            null,
                            '\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441\u043E\u0431\u044B\u0442\u0438\u0439 '
                        ),
                        '| 33 \u0437\u0430 \u044D\u0442\u0443 \u043D\u0435\u0434\u0435\u043B\u044E'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'EventsPrimaryBlockOnMainPageContent' },
                        ResultsComponents
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'EventsPrimaryBlockOnMainPageContentButtons' },
                        _react2.default.createElement(
                            'div',
                            { className: 'EventsPrimaryBlockOnMainPageContentButtonsBlock' },
                            _react2.default.createElement(
                                'div',
                                { className: 'EventsPrimaryBlockOnMainPageContentButtonsBlockNew', style: _extends({}, !this.state.ButtonState && this.state.ButtonActive, this.state.ButtonState && this.state.ButtonDisactivated), onClick: this.ChangeClick },
                                '\u041D\u043E\u0432\u043E\u0435'
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'EventsPrimaryBlockOnMainPageContentButtonsBlockPop', style: _extends({}, this.state.ButtonState && this.state.ButtonActive, !this.state.ButtonState && this.state.ButtonDisactivated), onClick: this.ChangeClick },
                                '\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0435'
                            )
                        )
                    ),
                    this.state.TimerCouldown != "Ближайших событий нет" && _react2.default.createElement(
                        'div',
                        { className: 'EventsPrimaryBlockOnMainPageTimeNext' },
                        _react2.default.createElement(
                            'div',
                            null,
                            '\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u0435 \u0447\u0435\u0440\u0435\u0437: ',
                            _react2.default.createElement(
                                'span',
                                { className: 'EventsPrimaryBlockOnMainPageTimeColor' },
                                this.state.TimerCouldown,
                                ' '
                            ),
                            ' ',
                            _react2.default.createElement(
                                _reactRouter.Link,
                                { to: '/Event/' + this.state.GetClosetEvent.EventId },
                                _react2.default.createElement(
                                    'i',
                                    { className: 'EventsPrimaryBlockOnMainPageViewNearest' },
                                    '\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C'
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsBlockLabel' },
                            '\u0427\u0430\u0442\u044B \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 '
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsBlockSwitcher' },
                            ' \u041D\u043E\u0432\u044B\u0435 ',
                            _react2.default.createElement('input', { id: 'cb4', className: 'tgl1 tgl-flat1', type: 'checkbox', onChange: this.ChatSort }),
                            _react2.default.createElement('label', { className: 'tgl-btn1', htmlFor: 'cb4' }),
                            '\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsBlockMain' },
                            ResultsComponentsChats
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'ChatsBlockLabel widthFix' },
                            !this.state.EvrethingIsLoaded && _react2.default.createElement(
                                'div',
                                { type: 'button', className: 'EventsPrimaryBlockOnMainPageViewNearest ', onClick: this.LoadMore },
                                '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0435\u0449\u0435'
                            ),
                            this.state.EvrethingIsLoaded && _react2.default.createElement(
                                'div',
                                { className: 'EventsPrimaryBlockOnMainPageViewNearest', onClick: this.LoadMore },
                                '\u0412\u0441\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E'
                            )
                        )
                    )
                );
            }
        }
    }]);

    return EventsBlockOnMainPage;
}(_react2.default.Component);

exports.default = EventsBlockOnMainPage;
;

/***/ }),

/***/ 594:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

var _FriendsTab = __webpack_require__(617);

var _FriendsTab2 = _interopRequireDefault(_FriendsTab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FriendsList = function (_React$Component) {
    _inherits(FriendsList, _React$Component);

    function FriendsList(props) {
        _classCallCheck(this, FriendsList);

        var _this = _possibleConstructorReturn(this, (FriendsList.__proto__ || Object.getPrototypeOf(FriendsList)).call(this, props));

        _this.state = {
            FriendsData: [],
            UserData: {}
        };
        _this.AcceptFriend = _this.AcceptFriend.bind(_this);
        _this.componentWillMount = _this.componentWillMount.bind(_this);
        _this.LoadDataFrD = _this.LoadDataFrD.bind(_this);

        return _this;
    }

    _createClass(FriendsList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {

            this.setState({ UserData: this.props.UserData });
            console.log(this.props.UserData.FriendList);
            this.LoadDataFrD();
        }
    }, {
        key: 'LoadDataFrD',
        value: function LoadDataFrD() {
            var _this2 = this;

            if (this.props.UserData.FriendList) {
                (function () {
                    var arrayvar = _this2.state.FriendsData.slice();
                    var lenghtfrd = _this2.props.UserData.FriendList.length;
                    var UserDataHere = _this2.state.UserData;

                    var _loop = function _loop(i) {
                        $.when($.ajax({
                            url: "/GetUser/",
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ id: _this2.props.UserData.FriendList[i].FriendNBID }),
                            dataType: 'json'
                        })).then(function (data, textStatus, jqXHR) {
                            data.Status = this.props.UserData.FriendList[i].Status;
                            data.FriendsSince = this.props.UserData.FriendList[i].FriendsSince;

                            arrayvar.push(data);
                            //console.log(arrayvar)
                            //console.log(lenghtfrd)
                            if (lenghtfrd == arrayvar.length) {
                                this.setState({ FriendsData: arrayvar });
                            }
                        }.bind(_this2));
                    };

                    for (var i = 0; i < lenghtfrd; i++) {
                        _loop(i);
                    }
                })();
            }
        }
    }, {
        key: 'AcceptFriend',
        value: function AcceptFriend(key) {
            id = getCookie("UserId");
            var time = curDateandTime();
            var TempFDBIG = [];
            var tempFD = {};
            ajaxReq("/AcceptFriendRequest/", { Userid: id, FriendID: key.NBID, FriendsSince: time }, function (result) {
                if (result) {
                    for (var i = 0; i < this.state.FriendsData.length; i++) {

                        tempFD = this.state.FriendsData[i];
                        if (this.state.FriendsData[i].NBID == key.NBID) {
                            tempFD.Status = "0";
                            TempFDBIG.push(tempFD);
                        } else {
                            TempFDBIG.push(tempFD);
                        }
                    }
                    this.setState({ FriendsData: TempFDBIG });
                }
            }.bind(this));
        }
    }, {
        key: 'DeleteFriend',
        value: function DeleteFriend(key) {
            //alertR
            id = getCookie("UserId");
            var TempFDBIG = [];
            var tempFD = {};
            ajaxReq("/DeleteFriend/", { Userid: id, FriendID: key.NBID }, function (result) {
                if (result) {
                    for (var i = 0; i < this.state.FriendsData.length; i++) {

                        if (this.state.FriendsData[i].NBID == key.NBID) {
                            tempFD = this.state.FriendsData[i];

                            tempFD.Status = "2";
                        } else {
                            tempFD = this.state.FriendsData[i];
                            TempFDBIG.push(tempFD);
                        }
                    }
                    this.setState({ FriendsData: TempFDBIG });
                }
            }.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var countZayav = 0;
            console.log(this.state.FriendsData);
            var FriendComponentsIncoming = this.state.FriendsData.map(function (Friend) {
                var _this3 = this;

                if (!Friend.UsrPhotoBig) {
                    Friend.UsrPhotoBig = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Friend.UsrPhotoBig + ')'

                };
                if (Friend.Status == 1) {
                    countZayav++;
                    return _react2.default.createElement(
                        'div',
                        { className: 'friendblock', key: Friend.NBID, style: divStyle },
                        _react2.default.createElement(
                            'div',
                            { className: 'friendtop' },
                            _react2.default.createElement(
                                'div',
                                { className: 'leftPlusAdd' },
                                ' ',
                                _react2.default.createElement('i', { className: 'far fa-plus-square', onClick: function onClick() {
                                        return _this3.AcceptFriend(Friend);
                                    } })
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'rightMinusRemove' },
                                ' ',
                                _react2.default.createElement('i', { className: 'far fa-minus-square', onClick: function onClick() {
                                        return _this3.DeleteFriend(Friend);
                                    } })
                            )
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/User/' + Friend.NBID },
                            _react2.default.createElement(
                                'div',
                                { className: 'friendbottom' },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'FriendBottomBlockUserNames' },
                                    Friend.UsrFirstName,
                                    ' ',
                                    Friend.UsrLastName
                                ),
                                _react2.default.createElement(
                                    'p',
                                    { className: 'FriendBottomBlockUserInfo' },
                                    _react2.default.createElement('i', { className: 'fa fa-map-marker', 'aria-hidden': 'true' }),
                                    ' ',
                                    Friend.UsrCity
                                )
                            )
                        ),
                        '  '
                    );
                }
            }.bind(this));

            var FriendComponents = this.state.FriendsData.map(function (Friend) {
                var _this4 = this;

                if (!Friend.UsrPhotoBig) {
                    Friend.UsrPhotoBig = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'linear-gradient(rgba(29, 44, 70, 0.2),rgba(29, 44, 70, 0.5)),url(' + Friend.UsrPhotoBig + ')'
                };

                if (Friend.Status == 0) {

                    return _react2.default.createElement(
                        'div',
                        { className: 'friendblock', key: Friend.NBID, style: divStyle },
                        _react2.default.createElement(
                            'div',
                            { className: 'friendtop' },
                            this.props.DisplayMessageTab && _react2.default.createElement('i', { className: 'far fa-minus-square', onClick: function onClick() {
                                    return _this4.DeleteFriend(Friend);
                                } })
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/User/' + Friend.NBID },
                            _react2.default.createElement(
                                'div',
                                { className: 'friendbottom' },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'FriendBottomBlockUserNames' },
                                    Friend.UsrFirstName,
                                    ' ',
                                    Friend.UsrLastName
                                ),
                                _react2.default.createElement(
                                    'p',
                                    { className: 'FriendBottomBlockUserInfo' },
                                    _react2.default.createElement('i', { className: 'fa fa-map-marker', 'aria-hidden': 'true' }),
                                    ' ',
                                    Friend.UsrCity
                                )
                            )
                        )
                    );
                }
            }.bind(this));
            var showIncoming = void 0;
            if (countZayav > 0) {
                showIncoming = true;
            } else {
                showIncoming = false;
            }
            var FriendStyle = void 0;
            if (!this.props.DisplayMessageTab || !showIncoming) {
                FriendStyle = "FriendArea1";
            } else {
                FriendStyle = "FriendArea";
            }
            return _react2.default.createElement(
                'div',
                { className: 'friends' },
                _react2.default.createElement(
                    'div',
                    { className: FriendStyle },
                    FriendComponents
                ),
                this.props.DisplayMessageTab && showIncoming && _react2.default.createElement(
                    'div',
                    { className: 'FriendIncomingArea' },
                    _react2.default.createElement(
                        'div',
                        { className: 'friendrequestscaption' },
                        ' '
                    ),
                    FriendComponentsIncoming
                )
            );
        }
    }]);

    return FriendsList;
}(_react2.default.Component);

exports.default = FriendsList;
;

/***/ }),

/***/ 595:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KudagoBlock = function (_React$Component) {
    _inherits(KudagoBlock, _React$Component);

    function KudagoBlock(props) {
        _classCallCheck(this, KudagoBlock);

        var _this = _possibleConstructorReturn(this, (KudagoBlock.__proto__ || Object.getPrototypeOf(KudagoBlock)).call(this, props));

        _this.state = {
            events: [],
            loading: true
        };
        return _this;
    }

    _createClass(KudagoBlock, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            $.when($.ajax({
                url: "/GetKudagoData/",
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {

                this.setState({ events: data, loading: false });
            }.bind(this));
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {

            if (this.state.loading) {
                return _react2.default.createElement(
                    'div',
                    { className: 'loadingState' },
                    '        ',
                    _react2.default.createElement(
                        'div',
                        { className: 'sk-folding-cube' },
                        _react2.default.createElement('div', { className: 'sk-cube1 sk-cube' }),
                        _react2.default.createElement('div', { className: 'sk-cube2 sk-cube' }),
                        _react2.default.createElement('div', { className: 'sk-cube4 sk-cube' }),
                        _react2.default.createElement('div', { className: 'sk-cube3 sk-cube' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'loadinglabel' },
                        '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E...'
                    )
                );
            } else {
                var FindResultsComponents = this.state.events.results.map(function (EventK) {
                    if (EventK.event.daterange == null) {
                        EventK.event.daterange = false;
                    }
                    console.log(EventK.event);
                    if (EventK.event.first_image.source.link == null) {
                        EventK.event.first_image.source.link = '';
                    }
                    return _react2.default.createElement(
                        'a',
                        { href: EventK.event.first_image.source.link },
                        _react2.default.createElement(
                            'div',
                            { className: 'KudaGoEvent', key: EventK.event.id },
                            _react2.default.createElement('hr', null),
                            _react2.default.createElement(
                                'div',
                                { className: 'KudaGoEventPhotocont' },
                                ' ',
                                _react2.default.createElement('img', { className: 'KudaGoEventPhoto', src: EventK.event.first_image.image })
                            ),
                            _react2.default.createElement(
                                'h1',
                                { className: 'KudaGoEventTitle' },
                                EventK.event.title
                            ),
                            (EventK.event.daterange.start_time || EventK.event.daterange) && _react2.default.createElement(
                                'div',
                                null,
                                '\u0412\u0440\u0435\u043C\u044F \u043D\u0430\u0447\u0430\u043B\u0430 ',
                                EventK.event.daterange.start_time,
                                ' '
                            ),
                            _react2.default.createElement('br', null),
                            _react2.default.createElement('div', { className: 'KudaGoEventDesc', dangerouslySetInnerHTML: { __html: EventK.event.description } })
                        )
                    );
                }.bind(this));
                return _react2.default.createElement(
                    'div',
                    null,
                    FindResultsComponents
                );
            }
        }
    }]);

    return KudagoBlock;
}(_react2.default.Component);

exports.default = KudagoBlock;
;

/***/ }),

/***/ 596:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessagesContent = exports.LastMessages = exports.SearchResult = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Messages = __webpack_require__(618);

var _Messages2 = _interopRequireDefault(_Messages);

var _socket = __webpack_require__(264);

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loading = function Loading() {
    return _react2.default.createElement(
        'div',
        { className: 'loadingState' },
        '        ',
        _react2.default.createElement(
            'div',
            { className: 'sk-folding-cube' },
            _react2.default.createElement('div', { className: 'sk-cube1 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube2 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube4 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube3 sk-cube' })
        ),
        _react2.default.createElement(
            'div',
            { className: 'loadinglabel' },
            '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E...'
        )
    );
};

var Messages = function (_React$Component) {
    _inherits(Messages, _React$Component);

    function Messages(props) {
        _classCallCheck(this, Messages);

        var _this = _possibleConstructorReturn(this, (Messages.__proto__ || Object.getPrototypeOf(Messages)).call(this, props));

        _this.state = {
            Loading: true,
            ShowSearch: false,
            ShowDialogs: false,
            MessageValue: "",
            Searchvalue: '',
            FindResults: [],
            FriendList: [],
            LastMessages: [],
            UserDialogGoal: {},
            UserData: {},
            updatemessage: false,
            currentDialog: "",
            messages: [],
            LoadItems: 15,
            EvrethingIsLoaded: false
        };
        _this.loaddata = _this.loaddata.bind(_this);
        _this.ShowSearch = _this.ShowSearch.bind(_this);
        _this.CloseSearch = _this.CloseSearch.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.DisplayFindResults = _this.DisplayFindResults.bind(_this);
        _this.OpenDialog = _this.OpenDialog.bind(_this);
        _this.UncheckUnread = _this.UncheckUnread.bind(_this);

        _this.ConnectToRoom = _this.ConnectToRoom.bind(_this);
        _this.Keypress1 = _this.Keypress1.bind(_this);
        _this.openDialogByID = _this.openDialogByID.bind(_this);

        _this.GetMessages = _this.GetMessages.bind(_this);
        return _this;
    }

    _createClass(Messages, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            checkCookie(this.loaddata);
        }
    }, {
        key: 'loaddata',
        value: function loaddata(getUserData) {
            var arrayvar = this.state.FindResults.slice();
            if (getUserData.FriendList) for (var i = 0; i < getUserData.FriendList.length; i++) {
                $.when($.ajax({
                    url: "/GetUser/",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ id: getUserData.FriendList[i].FriendNBID }),
                    dataType: 'json'
                })).then(function (data, textStatus, jqXHR) {
                    arrayvar.push(data);
                    if (getUserData.FriendList.length == arrayvar.length) {
                        this.setState({ FriendList: arrayvar });
                        this.setState({ FindResults: this.state.FriendList });
                    }
                }.bind(this));
            }this.setState({ UserData: getUserData });
            this.setState({ Loading: false });
            this.socket = (0, _socket2.default)('nightbrowser.ru:80');
            this.socket.emit('UsrNotice', { 'UsrId': this.state.UserData.NBID, "UsrPass": getCookieMd5Pass() });
            this.socket.on('UserMessagesUpdate', function (Messages) {
                if (Messages) {

                    Messages.sort(function (a, b) {

                        return moment.utc(b.LastMessage).diff(moment.utc(a.LastMessage));
                    }.bind(this));

                    this.setState({ LastMessages: Messages });
                }
            }.bind(this));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.interval);
        }
    }, {
        key: 'ShowSearch',
        value: function ShowSearch() {
            this.setState({ ShowSearch: true });
        }
    }, {
        key: 'CloseSearch',
        value: function CloseSearch() {
            this.setState({ ShowSearch: false });
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            this.setState({ Searchvalue: event.target.value, ShowSearch: true });
            if (event.target.value != '') {
                var Search = event.target.value.split(/\s* \s*/);
                ajaxReq("/FindUsers/", { FirstWord: Search[0], SecondWord: Search[1] }, function (usersFindResult) {
                    this.DisplayFindResults(usersFindResult);
                }.bind(this));
            } else {
                this.setState({ FindResults: this.state.FriendList });
            }
        }
    }, {
        key: 'DisplayFindResults',
        value: function DisplayFindResults(Results) {
            this.setState({ FindResults: Results });
        }
    }, {
        key: 'GetMessages',
        value: function GetMessages() {

            $.when($.ajax({
                url: "/getPrivateMessages/",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ currentDialog: this.state.currentDialog, Items: this.state.LoadItems, CountOfLoad: 15, UsrId: this.state.UserData.NBID, UsrPass: getCookieMd5Pass() }),
                dataType: 'json'
            })).then(function (data, textStatus, jqXHR) {

                if (data !== "End") {
                    this.setState({ messages: this.state.messages.reverse() });
                    this.setState({ messages: this.state.messages.concat(data) });
                    this.setState({ LoadItems: this.state.LoadItems + 15 });
                    this.setState({ messages: this.state.messages.reverse() });
                } else {
                    this.setState({ EvrethingIsLoaded: true });
                }
                if (this.state.LoadItems == 30) {

                    this.refs.MessagesContent.scrollImidiatly();
                }
                if (data.length < 15) {
                    this.setState({ EvrethingIsLoaded: true });
                }
            }.bind(this));
        }
    }, {
        key: 'ConnectToRoom',
        value: function ConnectToRoom() {
            var _this2 = this;

            this.socket = (0, _socket2.default)('nightbrowser.ru:80');
            this.socket.on('connect', function () {
                // Connected, let's sign-up for to receive messages for this room
                if (this.state.UserData.NBID < this.state.UserDialogGoal.NBID) {
                    this.setState({ currentDialog: 'PrivateRoom' + this.state.UserData.NBID + "a" + this.state.UserDialogGoal.NBID });
                    this.socket.emit('room', 'PrivateRoom' + this.state.UserData.NBID + "a" + this.state.UserDialogGoal.NBID);
                } else {
                    this.setState({ currentDialog: 'PrivateRoom' + this.state.UserDialogGoal.NBID + "a" + this.state.UserData.NBID });
                    this.socket.emit('room', 'PrivateRoom' + this.state.UserDialogGoal.NBID + "a" + this.state.UserData.NBID);
                }

                this.refs.MessagesContent.scrollToDown();
                this.socket.emit('UnTagReadedSMS', { 'Author': this.state.UserData.NBID, "DialogGoal": this.state.UserDialogGoal.NBID });

                this.GetMessages();
            }.bind(this));

            this.socket.on('RECEIVE_MESSAGEPrivate', function (data) {
                addMessage(data);
                this.refs.MessagesContent.scrollToDown();
            }.bind(this));
            var addMessage = function addMessage(data) {
                _this2.setState({ messages: [].concat(_toConsumableArray(_this2.state.messages), [data]) });
            };
            this.sendMessage = function (ev) {
                ev.preventDefault();
                if (_this2.state.Message !== "") _this2.socket.emit('SEND_MESSAGEprivate', {
                    Author: _this2.state.UserData.NBID,
                    Message: _this2.state.MessageValue,
                    roomId: _this2.state.currentDialog,
                    DialogGoal: _this2.state.UserDialogGoal.NBID
                });
                _this2.setState({ MessageValue: '' });
                _this2.state.LastMessages.map(function (Mess) {

                    if (Mess.UsrID == this.state.UserDialogGoal.NBID) {
                        Mess.LastMessage = curDateandTime();
                    }
                }.bind(_this2));
            };
        }
    }, {
        key: 'OpenDialog',
        value: function OpenDialog(UserDialog) {
            var _this3 = this;

            if (UserDialog.NBID != this.state.UserDialogGoal.NBID) {

                this.setState({
                    ShowSearch: false, UserDialogGoal: UserDialog, ShowDialogs: true, updatemessage: true
                }, function () {
                    _this3.UncheckUnread(_this3.state.UserDialogGoal.NBID);
                    _this3.setState({ LoadItems: 15, messages: [] });
                    _this3.ConnectToRoom();
                });
            }
        }
    }, {
        key: 'UncheckUnread',
        value: function UncheckUnread(Id) {
            console.log("go");
            console.log(Id);
            this.state.LastMessages.map(function (UserS) {
                console.log(UserS);
                if (UserS.UsrID == Id) {
                    console.log("Changed");
                    UserS.Unread = 0;
                }
            });
        }
    }, {
        key: 'openDialogByID',
        value: function openDialogByID(_openDialogByID) {

            if (_openDialogByID.UsrID != this.state.UserDialogGoal.NBID) ajaxReq("/GetUser/", { id: _openDialogByID.UsrID }, function (userData) {
                var _this4 = this;

                this.setState({
                    ShowSearch: false, UserDialogGoal: userData, ShowDialogs: true, updatemessage: true

                }, function () {

                    _this4.setState({ LoadItems: 15, messages: [],
                        MessageValue: "",
                        Searchvalue: '',
                        FindResults: [],
                        currentDialog: "",
                        EvrethingIsLoaded: false
                    });
                    _this4.UncheckUnread(_this4.state.UserDialogGoal.NBID);
                    _this4.ConnectToRoom();
                });
            }.bind(this));
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {}
    }, {
        key: 'Keypress1',
        value: function Keypress1(event) {
            if (event.keyCode == 13) {
                this.sendMessage(event);
                if (event.preventDefault) event.preventDefault(); // This should fix it
                return false; // Just a workaround for old browsers
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            if (!this.state.UserDialogGoal.UsrPhotoBig) {
                this.state.UserDialogGoal.UsrPhotoBig = '../images/LogoProfile.jpg';
            }
            var divStyle = {
                backgroundImage: 'url(' + this.state.UserDialogGoal.UsrPhotoBig + ')'

            };

            if (this.state.Loading == true) {
                return _react2.default.createElement(Loading, null);
            } else {
                if (this.props.DisplayType == "OnPage") {
                    return _react2.default.createElement(
                        'div',
                        { className: 'Messagesblock' },
                        _react2.default.createElement(
                            'div',
                            { className: 'MessagesLeftSideBlock' },
                            '         ',
                            _react2.default.createElement(
                                'div',
                                { className: 'MessagesSearchBlock' },
                                '           ',
                                _react2.default.createElement(
                                    'div',
                                    { className: 'SearchInput' },
                                    _react2.default.createElement('input', { type: 'text', value: this.state.Searchvalue, onChange: this.handleChange, className: 'SearchInputInChats WFixMes' }),
                                    !this.state.ShowSearch && _react2.default.createElement(
                                        'div',
                                        { className: 'SearchPoint ColorFixMes', onClick: this.ShowSearch },
                                        _react2.default.createElement('i', { className: 'fa fa-search poisk  ', 'aria-hidden': 'true' })
                                    ),
                                    this.state.ShowSearch && _react2.default.createElement(
                                        'div',
                                        { className: 'SearchPoint ColorFixMes1', onClick: this.CloseSearch },
                                        _react2.default.createElement('i', { className: 'fa fa-times poisk  timesFix', 'aria-hidden': 'true' })
                                    )
                                )
                            ),
                            this.state.ShowSearch && _react2.default.createElement(
                                'div',
                                { className: 'LastMessagesBlock' },
                                _react2.default.createElement(SearchResult, { Results: this.state.FindResults, openDialog: this.OpenDialog })
                            ),
                            !this.state.ShowSearch && _react2.default.createElement(
                                'div',
                                { className: 'LastMessagesBlock' },
                                _react2.default.createElement(LastMessages, { LastMessages: this.state.LastMessages,
                                    openDialogByID: this.openDialogByID })
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'MessagesRightSideBlock' },
                            this.state.ShowDialogs && _react2.default.createElement(
                                'div',
                                null,
                                _react2.default.createElement(
                                    'a',
                                    { href: '/User/' + this.state.UserDialogGoal.NBID, target: '_blank' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'MessagesTopBar' },
                                        _react2.default.createElement('div', { className: 'userpic searchresultuserpic', style: divStyle }),
                                        _react2.default.createElement(
                                            'p',
                                            { className: 'dialogcaption' },
                                            this.state.UserDialogGoal.UsrFirstName,
                                            ' ',
                                            this.state.UserDialogGoal.UsrLastName
                                        )
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    null,
                                    _react2.default.createElement(MessagesContent, { ref: 'MessagesContent', EvrethingIsLoaded: this.state.EvrethingIsLoaded, GetMessages: this.GetMessages, UserDialogGoal: this.state.UserDialogGoal, messages: this.state.messages, UserData: this.state.UserData })
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'MessageBottomBarSend' },
                                    _react2.default.createElement('textarea', { id: 'Message', placeholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435...', value: this.state.MessageValue, onChange: function onChange(ev) {
                                            return _this5.setState({ MessageValue: ev.target.value });
                                        }, onKeyDown: this.Keypress1 }),
                                    _react2.default.createElement(
                                        'div',
                                        { onClick: this.sendMessage, className: 'sendMessageButton' },
                                        _react2.default.createElement('i', { className: 'fab fa-avianex' })
                                    )
                                )
                            ),
                            !this.state.ShowDialogs && _react2.default.createElement(
                                'div',
                                { className: 'MessagesContentNoSelected' },
                                ' \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0414\u0438\u0430\u043B\u043E\u0433 '
                            )
                        )
                    );
                }
            }
        }
    }]);

    return Messages;
}(_react2.default.Component);

exports.default = Messages;

var SearchResult = exports.SearchResult = function (_React$Component2) {
    _inherits(SearchResult, _React$Component2);

    function SearchResult() {
        _classCallCheck(this, SearchResult);

        return _possibleConstructorReturn(this, (SearchResult.__proto__ || Object.getPrototypeOf(SearchResult)).apply(this, arguments));
    }

    _createClass(SearchResult, [{
        key: 'render',
        value: function render() {
            var FindResultsComponents = this.props.Results.map(function (UserFind) {
                var _this7 = this;

                if (!UserFind.UsrPhotoBig) {
                    UserFind.UsrPhotoBig = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'url(' + UserFind.UsrPhotoBig + ')'

                };
                return _react2.default.createElement(
                    'div',
                    { className: 'FindResultsUserBlock', key: UserFind.NBID, onClick: function onClick() {
                            return _this7.props.openDialog(UserFind);
                        } },
                    _react2.default.createElement('hr', null),
                    _react2.default.createElement('a', { href: '/User/' + UserFind.NBID, target: '_blank', className: 'userpic userpic_xs searchresultuserpic', style: divStyle }),
                    _react2.default.createElement(
                        'div',
                        { className: 'FindResultsUserName' },
                        UserFind.UsrFirstName,
                        ' ',
                        UserFind.UsrLastName
                    )
                );
            }.bind(this));
            return _react2.default.createElement(
                'div',
                null,
                FindResultsComponents
            );
        }
    }]);

    return SearchResult;
}(_react2.default.Component);

;
var initalState = {
    LastMessages: [],
    RenderMesse: []
};

var LastMessages = exports.LastMessages = function (_React$Component3) {
    _inherits(LastMessages, _React$Component3);

    function LastMessages(props) {
        _classCallCheck(this, LastMessages);

        var _this8 = _possibleConstructorReturn(this, (LastMessages.__proto__ || Object.getPrototypeOf(LastMessages)).call(this, props));

        _this8.state = initalState;
        _this8.CompilateMet = _this8.CompilateMet.bind(_this8);
        return _this8;
    }

    _createClass(LastMessages, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.CompilateMet(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.CompilateMet(nextProps);
        }
    }, {
        key: 'CompilateMet',
        value: function CompilateMet(nextProps) {
            var _this9 = this;

            console.log(nextProps.LastMessages);

            if (nextProps.LastMessages !== this.state.LastMessages) {
                this.setState(initalState);
                this.setState({
                    LastMessages: nextProps.LastMessages
                }, function () {
                    _this9.props.LastMessages.map(function (UserS) {

                        if (UserS.LastMessage) {

                            $.when($.ajax({
                                url: "/GetUser/",
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({ id: UserS.UsrID }),
                                dataType: 'json'
                            })).then(function (data, textStatus, jqXHR) {
                                UserS.UsrPhotoBig = data.UsrPhotoBig;
                                UserS.UsrFirstName = data.UsrFirstName;
                                UserS.UsrLastName = data.UsrLastName;
                                this.setState({ RenderMesse: [].concat(_toConsumableArray(this.state.RenderMesse), [UserS]) });
                            }.bind(this));
                        }
                    }.bind(_this9));
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {

            var LastMessagesComponents = this.state.RenderMesse.map(function (UserS) {
                var _this10 = this;

                if (!UserS.UsrPhotoBig) {
                    UserS.UsrPhotoBig = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'url(' + UserS.UsrPhotoBig + ')'
                };
                var foo = void 0;
                if (UserS.Unread === 1) {
                    foo = '#504646';
                } else {
                    foo = '';
                }
                var divStyle1 = {
                    backgroundColor: foo
                };

                var dt = new Date(Date.parse(UserS.LastMessage));
                var lastmessagedate = void 0;
                var monthl = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

                if (CalculateDate(dt) == curDate()) {
                    var hour = dt.getHours();
                    hour = (hour < 10 ? "0" : "") + hour;
                    var Minutes = dt.getMinutes();
                    Minutes = (Minutes < 10 ? "0" : "") + Minutes;
                    lastmessagedate = hour + ":" + Minutes;
                } else {
                    var month = dt.getMonth();
                    var day = dt.getDate();
                    lastmessagedate = day + " " + monthl[month];
                    //console.log(lastmessagedate)
                }

                return _react2.default.createElement(
                    'div',
                    { className: 'FindResultsUserBlock', style: divStyle1, key: Math.random() * 100, onClick: function onClick() {
                            return _this10.props.openDialogByID(UserS);
                        } },
                    UserS.Unread !== 1 && _react2.default.createElement('a', { className: 'userpic userpic_xs searchresultuserpic', style: divStyle, href: '/User/' + UserS.UsrID, target: '_blank' }),
                    UserS.Unread === 1 && _react2.default.createElement('a', { className: 'userpic userpic_xs searchresultuserpic UnreadedMessageBox', style: divStyle, href: '/User/' + UserS.UsrID, target: '_blank' }),
                    _react2.default.createElement(
                        'p',
                        { className: 'FindResultsUserName' },
                        UserS.UsrFirstName,
                        ' ',
                        UserS.UsrLastName
                    ),
                    _react2.default.createElement(
                        'p',
                        { className: 'FindResultsUserTime' },
                        ' ',
                        lastmessagedate
                    )
                );
            }.bind(this));
            return _react2.default.createElement(
                'div',
                null,
                LastMessagesComponents
            );
        }
    }]);

    return LastMessages;
}(_react2.default.Component);

;

var MessagesContent = exports.MessagesContent = function (_React$Component4) {
    _inherits(MessagesContent, _React$Component4);

    function MessagesContent(props) {
        _classCallCheck(this, MessagesContent);

        var _this11 = _possibleConstructorReturn(this, (MessagesContent.__proto__ || Object.getPrototypeOf(MessagesContent)).call(this, props));

        _this11.state = {
            firstTime: true,
            NewMessage: false
        };
        _this11.scrollToDown = _this11.scrollToDown.bind(_this11);
        _this11.scrollImidiatly = _this11.scrollImidiatly.bind(_this11);
        _this11.Scroll = _this11.Scroll.bind(_this11);

        return _this11;
    }

    _createClass(MessagesContent, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {

            this.setState({ firstTime: true });
            this.scrollToDown();
            this.scrollImidiatly();
        }
    }, {
        key: 'scrollToDown',
        value: function scrollToDown() {

            var el = this.refs.DisplayMessages;

            if (el.scrollHeight - 850 < el.scrollTop || this.state.firstTime) {

                el.scrollTop = el.scrollHeight;

                setTimeout(function () {

                    this.setState({ firstTime: false });
                }.bind(this), 1000);
            } else {
                this.setState({ NewMessage: true });
            }
        }
    }, {
        key: 'scrollImidiatly',
        value: function scrollImidiatly() {
            var el = this.refs.DisplayMessages;

            el.scrollTop = el.scrollHeight;
            this.setState({ NewMessage: false });
        }
    }, {
        key: 'Scroll',
        value: function Scroll() {
            var el = this.refs.DisplayMessages;

            if (el.scrollTop + 800 > el.scrollHeight) {
                this.setState({ NewMessage: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            //console.log(this.props.messages)
            var i = 0;
            var MessagesComponents = this.props.messages.map(function (messageData) {

                if (!messageData.Author.Photo) {
                    messageData.Author.Photo = '../images/LogoProfile.jpg';
                }
                var divStyle = {
                    backgroundImage: 'url(' + messageData.Author.Photo + ')'

                };
                var MessageAuthor = messageData.Author.Name || messageData.Author.Fam;

                var dt = new Date(messageData.Date);
                //console.log(moment(messageData.Date).locale('ru').format("DD MMM YYYY"));

                var lastmessagedate = void 0;
                var monthl = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

                if (CalculateDate(dt) == curDate()) {
                    var hour = dt.getHours();
                    hour = (hour < 10 ? "0" : "") + hour;
                    var Minutes = dt.getMinutes();
                    Minutes = (Minutes < 10 ? "0" : "") + Minutes;
                    lastmessagedate = hour + ":" + Minutes;
                } else {
                    var month = dt.getMonth();
                    var day = dt.getDate();
                    lastmessagedate = day + " " + monthl[month];
                    //console.log(lastmessagedate)
                }
                return _react2.default.createElement(
                    'div',
                    { className: 'PrivateChatMessageBlock', key: i++ },
                    _react2.default.createElement('div', { className: 'userpic PhotoInContentMessages searchresultuserpic', style: divStyle, key: lastmessagedate + MessageAuthor }),
                    _react2.default.createElement(
                        'div',
                        { className: 'messagetext', key: lastmessagedate },
                        _react2.default.createElement(
                            'p',
                            { className: 'authorname', key: MessageAuthor },
                            MessageAuthor
                        ),
                        _react2.default.createElement(
                            'p',
                            { className: 'PrivateChatMessage', key: messageData.Message },
                            messageData.Message
                        )
                    ),
                    _react2.default.createElement(
                        'p',
                        { className: 'PrivateChatMessageTime', key: messageData.Date, title: messageData.Date },
                        lastmessagedate
                    )
                );
            }.bind(this));

            return _react2.default.createElement(
                'div',
                { id: 'MessagesContent', className: 'MessagesContent', ref: 'DisplayMessages', onScroll: this.Scroll },
                !this.props.EvrethingIsLoaded && _react2.default.createElement(
                    'div',
                    { className: 'LoadMore LoadMoreFix', onClick: this.props.GetMessages },
                    ' \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0435\u0449\u0435'
                ),
                MessagesComponents,
                this.state.NewMessage && _react2.default.createElement(
                    'div',
                    { className: 'ScrollDown', onClick: this.scrollImidiatly },
                    ' \u041D\u043E\u0432\u044B\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F'
                )
            );
        }
    }]);

    return MessagesContent;
}(_react2.default.Component);

;

/***/ }),

/***/ 597:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _BarAndModules = __webpack_require__(272);

var _BarAndModules2 = _interopRequireDefault(_BarAndModules);

var _reactRouter = __webpack_require__(15);

var _Prievewstyle = __webpack_require__(620);

var _Prievewstyle2 = _interopRequireDefault(_Prievewstyle);

var _Prievewreset = __webpack_require__(619);

var _Prievewreset2 = _interopRequireDefault(_Prievewreset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Preview = function (_React$Component) {
    _inherits(Preview, _React$Component);

    function Preview(props) {
        _classCallCheck(this, Preview);

        return _possibleConstructorReturn(this, (Preview.__proto__ || Object.getPrototypeOf(Preview)).call(this, props));
    }

    _createClass(Preview, [{
        key: 'ComponentDidMount',
        value: function ComponentDidMount() {
            jQuery(document).ready(function ($) {
                /* cache jQuery objects */
                var slideshow = $('.cd-slideshow'),
                    slides = slideshow.children('li'),
                    navigation = $('.cd-slideshow-nav');
                /* initialize varaibles */
                var delta = 0,
                    scrollThreshold = 6,
                    resizing = false,
                    scrolling = false;

                /* check media query and bind corresponding events */
                var mq = windowWidth(slideshow.get(0)),
                    bindToggle = false;
                bindEvents(mq, true);
                /* initilaize slidshow */
                initSlideshow(slideshow);

                /* on swipe, update visible sub-slides (if available) */
                slides.on('swipeleft', function (event) {
                    mq == 'mobile' && updateSubSlide($(this), 'next');
                });
                slides.on('swiperight', function (event) {
                    mq == 'mobile' && updateSubSlide($(this), 'prev');
                });

                /* update slideshow if user clicks on a not-visible slide (desktop version only)*/
                slides.on('click', function (event) {
                    var slide = $(this);
                    if (mq == 'desktop' && !slide.hasClass('visible')) {} else if (mq == 'desktop' && $(event.target).parents('.sub-visible').length == 0 && $(event.target).parents('.sub-slides').length > 0) {
                        var newSubSlide = $(event.target).parents('.cd-slider-content').parent('li'),
                            direction = newSubSlide.prev('.sub-visible').length > 0 ? 'next' : 'prev';
                        updateSubSlide(slide, direction);
                    }
                });

                /* update slideshow position on resize */
                $(window).on('resize', function () {
                    if (!resizing) {
                        !window.requestAnimationFrame ? updateOnResize() : window.requestAnimationFrame(updateOnResize);
                        resizing = true;
                    }
                });

                function updateSlideDots(listItemNav, string, newSubIndex) {
                    var activeDot = listItemNav.children('.active');

                    if (string == 'next') var newDots = activeDot.next();else if (string == 'prev') var newDots = activeDot.prev();else var newDots = listItemNav.children('li').eq(newSubIndex);

                    activeDot.removeClass('active');
                    newDots.addClass('active');
                }
                var newSubSlide;
                function updateSubSlide(listItem, string, subSlide) {
                    var translate = 0,
                        listItemNav = listItem.children('.slider-dots'),
                        marginSlide = Number(listItem.find('.cd-slider-content').eq(0).css('margin-right').replace('px', '')) * 6,
                        windowWidth = window.innerWidth;

                    windowWidth = mq == 'desktop' ? windowWidth - marginSlide : windowWidth;
                    if (listItem.children('.sub-slides').length > 0) {
                        var subSlidesWrapper = listItem.children('.sub-slides'),
                            visibleSubSlide = subSlidesWrapper.children('.sub-visible');
                        if (visibleSubSlide.length == 0) visibleSubSlide = subSlidesWrapper.children('li').eq(0).addClass('sub-visible');

                        if (string == 'nav') {
                            /* we have choosen a new slide from the navigation */
                            newSubSlide = subSlide;
                        } else {
                            var newSubSlide = string == 'next' ? visibleSubSlide.next() : visibleSubSlide.prev();
                        }

                        if (newSubSlide.length > 0) {
                            var newSubSlidePosition = newSubSlide.index();
                            translate = parseInt(-newSubSlidePosition * windowWidth);

                            setTransformValue(subSlidesWrapper.get(0), 'translateX', translate + 'px');
                            updateSlideDots(listItemNav, string, newSubSlidePosition);
                            visibleSubSlide.removeClass('sub-visible');
                            newSubSlide.addClass('sub-visible');
                        }
                    }
                }

                function updateOnResize() {
                    mq = windowWidth(slideshow.get(0));
                    bindEvents(mq, bindToggle);
                    if (mq == 'mobile') {
                        bindToggle = true;
                        slideshow.attr('style', '').children('.visible').removeClass('visible');
                    } else {
                        bindToggle = false;
                        if (slides.filter('.visible').length == 0) slides.eq(0).addClass('visible');
                    }
                    initSlideshow(slideshow);
                    resizing = false;
                }

                /* $( ".slider-dots>li" ).click(function() {
                 var visibleSlide = slides.filter('.visible');
                 updateSubSlide(visibleSlide,'next');
                 }); */
                $(".nextSlideButton1").click(function () {
                    var visibleSlide = slides.filter('.visible');
                    updateSubSlide(visibleSlide, 'next');
                    var translate = 0,
                        listItemNav = visibleSlide.children('.slider-dots'),
                        marginSlide = Number(visibleSlide.find('.cd-slider-content').eq(0).css('margin-right').replace('px', '')) * 6,
                        windowWidth = window.innerWidth;

                    windowWidth = mq == 'desktop' ? windowWidth - marginSlide : windowWidth;
                    if (visibleSlide.children('.sub-slides').length > 0) {
                        var subSlidesWrapper = visibleSlide.children('.sub-slides'),
                            visibleSubSlide = subSlidesWrapper.children('.sub-visible');
                        if (visibleSubSlide.length == 0) visibleSubSlide = subSlidesWrapper.children('li').eq(0).addClass('sub-visible');
                        newSubSlide = visibleSubSlide.next();
                        if (newSubSlide.length > 0) {
                            var newSubSlidePosition = newSubSlide.index();
                            translate = parseInt(-newSubSlidePosition * windowWidth);

                            setTransformValue(subSlidesWrapper.get(0), 'translateX', translate + 'px');
                            updateSlideDots(listItemNav, "next", newSubSlidePosition);
                            visibleSubSlide.removeClass('sub-visible');
                            newSubSlide.addClass('sub-visible');
                        }
                    }
                });
                function bindEvents(MQ, bool) {
                    if (MQ == 'desktop' && bool) {

                        $(document).on('keydown', function (event) {
                            if (event.which == '32') {
                                var visibleSlide = slides.filter('.visible');
                                updateSubSlide(visibleSlide, 'next');
                            } else if (event.which == '39') {
                                var visibleSlide = slides.filter('.visible');
                                updateSubSlide(visibleSlide, 'next');
                            } else if (event.which == '37') {
                                var visibleSlide = slides.filter('.visible');
                                updateSubSlide(visibleSlide, 'prev');
                            }
                        });
                    } else if (MQ == 'mobile') {
                        $(document).off('keydown');
                    }
                }

                function initSlideshow(slideshow) {
                    var windowWidth = window.innerWidth;
                    slideshow.children('li').each(function () {
                        var slide = $(this),
                            subSlideNumber = slide.children('.sub-slides').children('li').length,
                            slideWidth = subSlideNumber * windowWidth;
                        slideWidth = slideWidth == 0 ? windowWidth : slideWidth;
                        slide.css('width', slideWidth + 'px');
                        if (subSlideNumber > 0) {
                            var visibleSubSlide = slide.find('.sub-visible');
                            if (visibleSubSlide.length == 0) {
                                visibleSubSlide = slide.find('li').eq(0);
                                visibleSubSlide.addClass('sub-visible');
                            }
                            updateSubSlide(slide, 'nav', visibleSubSlide);
                            /* createSubSlideDots(slide, subSlideNumber); */
                        }
                    });
                }

                function getTranslateValue(element, axis) {
                    var elementStyle = window.getComputedStyle(element, null),
                        elementTranslate = elementStyle.getPropertyValue("-webkit-transform") || elementStyle.getPropertyValue("-moz-transform") || elementStyle.getPropertyValue("-ms-transform") || elementStyle.getPropertyValue("-o-transform") || elementStyle.getPropertyValue("transform");

                    if (elementTranslate.indexOf('(') >= 0) {
                        elementTranslate = elementTranslate.split('(')[1];
                        elementTranslate = elementTranslate.split(')')[0];
                        elementTranslate = elementTranslate.split(',');
                        var translateValue = axis == 'X' ? elementTranslate[4] : elementTranslate[5];
                    } else {
                        var translateValue = 0;
                    }

                    return Number(translateValue);
                }

                function setTransformValue(element, property, value) {
                    element.style["-webkit-transform"] = property + "(" + value + ")";
                    element.style["-moz-transform"] = property + "(" + value + ")";
                    element.style["-ms-transform"] = property + "(" + value + ")";
                    element.style["-o-transform"] = property + "(" + value + ")";
                    element.style["transform"] = property + "(" + value + ")";

                    $(element).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                        if (mq == 'desktop') {
                            delta = 0;
                        }
                    });
                }

                function windowWidth(element) {
                    var mq = window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/["']/g, '');
                    return mq;
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            {

                return _react2.default.createElement(
                    'div',
                    { className: 'body' },
                    _react2.default.createElement(
                        'div',
                        { className: 'cd-slideshow-wrapper' },
                        _react2.default.createElement(
                            'ol',
                            { className: 'cd-slideshow' },
                            _react2.default.createElement(
                                'li',
                                { id: 'slide-2', className: 'visible' },
                                _react2.default.createElement(
                                    'ol',
                                    { className: 'sub-slides' },
                                    _react2.default.createElement(
                                        'li',
                                        { id: 'topslide1' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'cd-slider-content' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'content-wrapper' },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'krug' },
                                                    _react2.default.createElement('div', { className: 'a2ndBcgKrug' }),
                                                    ' ',
                                                    _react2.default.createElement('div', { className: 'stars' }),
                                                    _react2.default.createElement('div', { className: 'twinkling' }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'logobykwi' },
                                                        'NB'
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'signsObsh' },
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'leftSignsHello' },
                                                        _react2.default.createElement(
                                                            'p',
                                                            { className: 'hello_eng signs_p smallbuk_int' },
                                                            'Hello'
                                                        ),
                                                        _react2.default.createElement(
                                                            'p',
                                                            { className: 'hello_chi signs_p smallbuk_int' },
                                                            '\u30CF\u30ED\u30FC'
                                                        ),
                                                        _react2.default.createElement(
                                                            'p',
                                                            { className: 'hello_ger signs_p smallbuk_int' },
                                                            ' Hallo'
                                                        )
                                                    ),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'privetDrug' },
                                                        _react2.default.createElement(
                                                            'p',
                                                            { className: 'hello_ru signs_p' },
                                                            '\u041F\u0440\u0438\u0432\u0435\u0442,\u0434\u0440\u0443\u0433!'
                                                        )
                                                    ),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'rightSignsFriend' },
                                                        _react2.default.createElement(
                                                            'p',
                                                            { className: 'friend_ger signs_p smallbuk_int' },
                                                            'friend'
                                                        ),
                                                        _react2.default.createElement(
                                                            'p',
                                                            { className: 'friend_chi signs_p smallbuk_int' },
                                                            '\u53CB\u9054'
                                                        ),
                                                        _react2.default.createElement(
                                                            'p',
                                                            { className: 'friend_eng signs_p smallbuk_int' },
                                                            'freund'
                                                        )
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'p',
                                                    { className: ' signs_p entroduce ' },
                                                    '\u041F\u043E\u0437\u0432\u043E\u043B\u044C \u043D\u0430\u043C \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u0430\u0442\u044C \u043E \u0441\u0435\u0431\u0435 ',
                                                    _react2.default.createElement('br', null),
                                                    ' \u0432 \u043E\u0447\u0435\u043D\u044C \u043A\u0440\u0430\u0442\u043A\u043E\u0439 \u0444\u043E\u0440\u043C\u0435;)'
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'slideshowbuttons ' },
                                                    _react2.default.createElement(
                                                        'ol',
                                                        { className: 'slider-dots' },
                                                        _react2.default.createElement('li', { id: '1Prew', className: 'active' }),
                                                        _react2.default.createElement('li', { id: '2Prew' }),
                                                        _react2.default.createElement('li', { id: '3Prew', onclick: '' }),
                                                        _react2.default.createElement('li', { id: '4Prew', onclick: '' })
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'nextSlideButton' },
                                                    _react2.default.createElement(
                                                        'button',
                                                        { className: 'nextSlideButton1' },
                                                        '\u0412\u043F\u0435\u0440\u0451\u0434 '
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'li',
                                        { id: 'topslide2' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'cd-slider-content' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'content-wrapper' },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'krug' },
                                                    _react2.default.createElement('div', { className: 'a2ndBcgKrug' }),
                                                    ' ',
                                                    _react2.default.createElement('div', { className: 'stars' }),
                                                    _react2.default.createElement('div', { className: 'twinkling' }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'logobykwi' },
                                                        'NB'
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'zagolovokPresentSlide' },
                                                    '\u0427\u0435\u043C \u043C\u044B \u043F\u043E\u043B\u0435\u0437\u043D\u044B?'
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'SecondSlidePresentasionText' },
                                                    _react2.default.createElement('i', { className: 'fa fa-bullhorn fa-3x fafixpadding', 'aria-hidden': 'true' }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'SecondSlidePresentasionText1 ' },
                                                        '\u0421\u043E\u0437\u0434\u0430\u0439 \u0441\u0432\u043E\u0439 \u0447\u0430\u0442 \u0438\u043B\u0438 \u0441\u043E\u0431\u044B\u0442\u0438\u0435, ',
                                                        _react2.default.createElement('br', null),
                                                        '\u043F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u044F\u0439\u0441\u044F \u043A \u0443\u0436\u0435 \u0437\u0430\u043F\u043B\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u043C,',
                                                        _react2.default.createElement('br', null),
                                                        ' \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F\u043C \u0438 \u0447\u0430\u0442\u0430\u043C.'
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'SecondSlidePresentasionText' },
                                                    _react2.default.createElement('i', { className: 'fa fa-comments-o fa-3x fafixpadding', 'aria-hidden': 'true' }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'SecondSlidePresentasionText1 ' },
                                                        '\u041F\u043E\u043B\u044C\u0437\u0443\u0439\u0441\u044F \u043F\u0440\u043E\u0441\u0442\u044B\u043C \u0438 \u0431\u044B\u0441\u0442\u0440\u044B\u043C \u0447\u0430\u0442\u043E\u043C,',
                                                        _react2.default.createElement('br', null),
                                                        '\u0443\u0437\u043D\u0430\u0439 \u043C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0434\u0440\u0443\u0437\u0435\u0439 \u0438 \u0441\u0435\u0431\u044F,',
                                                        _react2.default.createElement('br', null),
                                                        '\u0430 \u0442\u0430\u043A\u0436\u0435 \u043F\u043E\u0433\u043E\u0434\u0443 \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F!\u0421 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u043C',
                                                        _react2.default.createElement('br', null),
                                                        ' \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u043E\u043C \u043F\u043E\u0437\u043D\u0430\u043A\u043E\u043C\u0438\u0448\u0441\u044F \u0441\u0430\u043C:)..'
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'slideshowbuttons' },
                                                    _react2.default.createElement(
                                                        'ol',
                                                        { className: 'slider-dots' },
                                                        _react2.default.createElement('li', { id: '1Prew' }),
                                                        _react2.default.createElement('li', { id: '2Prew', className: 'active' }),
                                                        _react2.default.createElement('li', { id: '3Prew', onclick: '' }),
                                                        _react2.default.createElement('li', { id: '4Prew', onclick: '' })
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'nextSlideButton' },
                                                    _react2.default.createElement(
                                                        'button',
                                                        { className: 'nextSlideButton1' },
                                                        '\u0412\u043F\u0435\u0440\u0451\u0434 '
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'li',
                                        { id: 'topslide3' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'cd-slider-content' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'content-wrapper' },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'krug' },
                                                    _react2.default.createElement('div', { className: 'a2ndBcgKrug' }),
                                                    ' ',
                                                    _react2.default.createElement('div', { className: 'stars' }),
                                                    _react2.default.createElement('div', { className: 'twinkling' }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'logobykwi' },
                                                        'NB'
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'zagolovokPresentSlide' },
                                                    'Help'
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'SecondSlidePresentasionText SecondSlidePresentasionText_fix' },
                                                    _react2.default.createElement('i', { className: 'fa fa-info-circle fa-3x', 'aria-hidden': 'true' }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'SecondSlidePresentasionText1 ' },
                                                        '\u041C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u043C \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0430\u043C \u043E\u0447\u0435\u043D\u044C ',
                                                        _react2.default.createElement('br', null),
                                                        ' \u0442\u044F\u0436\u0435\u043B\u043E \u043A\u043E\u043D\u043A\u0443\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441 \u0431\u043E\u043B\u044C\u0448\u0438\u043C\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430\u043C\u0438. ',
                                                        _react2.default.createElement('br', null),
                                                        '\u0415\u0441\u043B\u0438 \u0442\u0435\u0431\u0435 \u0447\u0442\u043E-\u0442\u043E \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u043E\u0441\u044C \u0432 \u0445\u043E\u0434\u0435 ',
                                                        _react2.default.createElement('br', null),
                                                        ' \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F, \u0440\u0430\u0441\u0441\u043A\u0430\u0436\u0438 \u043E \u043D\u0430\u0441 \u0434\u0440\u0443\u0437\u044C\u044F\u043C.'
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'zagolovokPresentSlide' },
                                                    '\u0411\u041E\u041B\u042C\u0428\u041E\u0415 \u0421\u041F\u0410\u0421\u0418\u0411\u041E.'
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'slideshowbuttons' },
                                                    _react2.default.createElement(
                                                        'ol',
                                                        { className: 'slider-dots' },
                                                        _react2.default.createElement('li', { id: '1Prew' }),
                                                        _react2.default.createElement('li', { id: '2Prew' }),
                                                        _react2.default.createElement('li', { id: '3Prew', onclick: '', className: 'active' }),
                                                        _react2.default.createElement('li', { id: '4Prew', onclick: '' })
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'nextSlideButton' },
                                                    _react2.default.createElement(
                                                        'button',
                                                        { className: 'nextSlideButton1' },
                                                        '\u0412\u043F\u0435\u0440\u0451\u0434 '
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'li',
                                        { id: 'topslide4' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'cd-slider-content' },
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'content-wrapper' },
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'krug' },
                                                    _react2.default.createElement('div', { className: 'a2ndBcgKrug' }),
                                                    ' ',
                                                    _react2.default.createElement('div', { className: 'stars' }),
                                                    _react2.default.createElement('div', { className: 'twinkling' }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'logobykwi logobykwi_fix' },
                                                        '</>'
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'zagolovokPresentSlide' },
                                                    '...\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435'
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'SecondSlidePresentasionText SecondSlidePresentasionText_fix2' },
                                                    _react2.default.createElement('i', { className: 'fa fa-bug fa-3x', 'aria-hidden': 'true' }),
                                                    _react2.default.createElement(
                                                        'div',
                                                        { className: 'SecondSlidePresentasionText1 ' },
                                                        '\u0415\u0441\u043B\u0438 \u0443 \u0432\u0430\u0441 \u0432\u043E\u0437\u043D\u0438\u043A\u043B\u0438 \u043A\u0430\u043A\u0438\u0435-\u043B\u0438\u0431\u043E \u0431\u0430\u0433\u0438/\u043E\u0448\u0438\u0431\u043A\u0438  \u043D\u0435 \u043F\u0430\u043D\u0438\u043A\u0443\u0439\u0442\u0435... \u041C\u043D\u043E\u0433\u0438\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u043D\u0430\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u0438 \u043C\u043E\u0433\u0443\u0442 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C\u0441\u044F.\u041F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0432\u0440\u0435\u043C\u044F, \u0430 \u043F\u043E\u0442\u043E\u043C \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430. \u041C\u044B \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u043C \u0442\u0432\u043E\u0440\u0447\u0435\u0441\u043A\u0438\u0445 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0435\u0439 \u043A \u0441\u0435\u0431\u044F \u0432 \u043A\u043E\u043C\u043C\u0430\u043D\u0434\u0443. \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0438\u0435 \u0432 \u0440\u0430\u0437\u0434\u0435\u043B\u0435 \xAB\u041F\u0430\u0440\u0442\u043D\u0451\u0440\u0430\u043C\xBB.'
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'slideshowbuttons' },
                                                    _react2.default.createElement(
                                                        'ol',
                                                        { className: 'slider-dots' },
                                                        _react2.default.createElement('li', { id: '1Prew' }),
                                                        _react2.default.createElement('li', { id: '2Prew' }),
                                                        _react2.default.createElement('li', { id: '3Prew', onclick: '' }),
                                                        _react2.default.createElement('li', { id: '4Prew', onclick: '', className: 'active' })
                                                    )
                                                ),
                                                _react2.default.createElement(
                                                    'div',
                                                    { className: 'nextSlideButton closepresentation' },
                                                    _react2.default.createElement(
                                                        'button',
                                                        { className: 'nextSlideButton1', onClick: this.props.StartBut },
                                                        '\u041D\u0430\u0447\u0430\u0442\u044C '
                                                    )
                                                )
                                            )
                                        )
                                    ),
                                    _react2.default.createElement('li', { id: 'topslide5' })
                                )
                            )
                        )
                    )
                );
            }
        }
    }]);

    return Preview;
}(_react2.default.Component);

exports.default = Preview;
;

/***/ }),

/***/ 598:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(15);

var _Messages = __webpack_require__(596);

var _Messages2 = _interopRequireDefault(_Messages);

var _FriendsList = __webpack_require__(594);

var _FriendsList2 = _interopRequireDefault(_FriendsList);

var _EventTab = __webpack_require__(592);

var _EventTab2 = _interopRequireDefault(_EventTab);

var _UserProfile = __webpack_require__(622);

var _UserProfile2 = _interopRequireDefault(_UserProfile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var initialState = {
    EventsTab: true,
    FriendsTab: false,
    MessagesTab: false,
    DisplayProfileEditButton: false,
    DisplayMessageTab: false,
    NotAuth: false,
    Display2ButtonsForMenu: true,
    DisplayButtons: false,
    SendFriendRequest: true,
    FirstTabClaas: "one",
    SecondTabClass: "two",
    ATabsClass: "tabsssa1",
    hrTabsClass: "tabshr1",
    UserData: {},
    Age: '',
    Desc: false,
    IncomingInvites: 0,
    IncomingMessages: 0,
    ShowMessages: false,
    Loading: true
};

var queryString = __webpack_require__(394);
var setQuery = __webpack_require__(573);

var Profile = function (_React$Component) {
    _inherits(Profile, _React$Component);

    function Profile(props) {
        _classCallCheck(this, Profile);

        var _this = _possibleConstructorReturn(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).call(this, props));

        _this.state = initialState;
        _this.SendFriendRequest = _this.SendFriendRequest.bind(_this);
        _this.componentDidMount = _this.componentDidMount.bind(_this);
        _this.DisplayMessageTabfunc = _this.DisplayMessageTabfunc.bind(_this);
        _this.SobitiyaTabEnable = _this.SobitiyaTabEnable.bind(_this);
        _this.FriendsTabEnable = _this.FriendsTabEnable.bind(_this);
        _this.MessagesTabEnable = _this.MessagesTabEnable.bind(_this);
        _this.openDesc = _this.openDesc.bind(_this);
        _this.OpenMessages = _this.OpenMessages.bind(_this);

        return _this;
    }

    //TODO: fix perehodi


    _createClass(Profile, [{
        key: 'componentWillUpdate',
        value: function componentWillUpdate() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            this.setState(initialState);
            this.setState({
                UserData: nextProps.UserData
            }, function () {
                var messagesreq = 0;
                ajaxReq("/GetUserUnreadedMessages/", {
                    UsrId: _this2.state.UserData.NBID,
                    UsrPass: getCookieMd5Pass()
                }, function (unMess) {
                    messagesreq = unMess;
                    this.setState({ IncomingMessages: messagesreq });
                }.bind(_this2));

                var fiendsreq = 0;
                if (_this2.props.UserData.FriendList) for (var i = 0; i < _this2.props.UserData.FriendList.length; i++) {
                    if (_this2.props.UserData.FriendList[i].Status == 1) {
                        fiendsreq++;
                    }
                }

                checkCookie(_this2.DisplayMessageTabfunc);
                var dt = new Date(curDate() + "Z");
                var dt1 = new Date(_this2.props.UserData.DateofBirthday + "Z");
                _this2.setState({
                    Age: plural(Math.trunc((dt - dt1) / (1000 * 3600 * 24) / 365), 'год', 'года', 'лет'),
                    IncomingInvites: fiendsreq
                });
            });
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this3 = this;

            this.setState({
                UserData: this.props.UserData
            }, function () {
                var messagesreq = 0;
                ajaxReq("/GetUserUnreadedMessages/", { UsrId: _this3.state.UserData.NBID, UsrPass: getCookieMd5Pass() }, function (unMess) {
                    messagesreq = unMess;
                    this.setState({ IncomingMessages: messagesreq });
                }.bind(_this3));

                var fiendsreq = 0;
                if (_this3.props.UserData.FriendList) for (var i = 0; i < _this3.props.UserData.FriendList.length; i++) {
                    if (_this3.props.UserData.FriendList[i].Status == 1) {
                        fiendsreq++;
                    }
                }

                checkCookie(_this3.DisplayMessageTabfunc);
                var dt = new Date(curDate() + "Z");
                var dt1 = new Date(_this3.props.UserData.DateofBirthday + "Z");
                _this3.setState({ Age: plural(Math.trunc((dt - dt1) / (1000 * 3600 * 24) / 365), 'год', 'года', 'лет'), IncomingInvites: fiendsreq });
            });
        }
    }, {
        key: 'DisplayMessageTabfunc',
        value: function DisplayMessageTabfunc(cookies) {
            if (cookies.NBID == this.state.UserData.NBID) {
                this.setState({ DisplayMessageTab: true, DisplayProfileEditButton: true, SendFriendRequest: false, Display2ButtonsForMenu: false });
            } else {
                this.setState({ Display2ButtonsForMenu: true });

                if (cookies != "") {
                    this.setState({ DisplayButtons: true });
                    if (cookies.FriendList) for (var i = 0; i < cookies.FriendList.length; i++) {
                        if (cookies.FriendList[i].FriendNBID == this.props.UserData.NBID) {
                            this.setState({ SendFriendRequest: false });
                        }
                    }
                }
            }
            if (cookies == "") {
                this.setState({ NotAuth: true, SendFriendRequest: false });
            }
            if (this.state.Display2ButtonsForMenu) {
                this.setState({ FirstTabClaas: "one2", SecondTabClass: "two2", ATabsClass: "tabsssa2", hrTabsClass: "tabshr2" });
            } else {
                this.setState({ FirstTabClaas: "one", SecondTabClass: "two" });
            }
            this.setState({ Loading: false });
            var parsed = queryString.parse(location.search);
            switch (parsed.l) {
                case "Messages":
                    if (!this.state.Display2ButtonsForMenu) this.MessagesTabEnable();break;
                case "Friends":
                    this.FriendsTabEnable();break;
                case "Events":
                    this.SobitiyaTabEnable();break;
                default:
                    break;
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'SendFriendRequest',
        value: function (_SendFriendRequest) {
            function SendFriendRequest() {
                return _SendFriendRequest.apply(this, arguments);
            }

            SendFriendRequest.toString = function () {
                return _SendFriendRequest.toString();
            };

            return SendFriendRequest;
        }(function () {

            SendFriendRequest(this.state.UserData.NBID);
            this.setState({ SendFriendRequest: false });
        })
    }, {
        key: 'SobitiyaTabEnable',
        value: function SobitiyaTabEnable() {
            setQuery({ l: 'Events' });
            this.setState({ EventsTab: true, FriendsTab: false, MessagesTab: false });
            if (this.state.Display2ButtonsForMenu) {
                this.setState({ hrTabsClass: "tabshr2 onehr2" });
            } else {
                this.setState({ hrTabsClass: "tabshr1 onehr" });
            }
        }
    }, {
        key: 'FriendsTabEnable',
        value: function FriendsTabEnable() {
            setQuery({ l: 'Friends' });
            this.setState({ EventsTab: false, FriendsTab: true, MessagesTab: false });
            if (this.state.Display2ButtonsForMenu) {
                this.setState({ hrTabsClass: "tabshr2 twohr2" });
            } else {
                this.setState({ hrTabsClass: "tabshr1 twohr" });
            }
        }
    }, {
        key: 'MessagesTabEnable',
        value: function MessagesTabEnable() {
            setQuery({ l: 'Messages' });
            this.setState({ EventsTab: false, FriendsTab: false, MessagesTab: true });
            this.setState({ hrTabsClass: "tabshr1 threehr" });
        }
    }, {
        key: 'openDesc',
        value: function openDesc() {
            this.setState({ Desc: !this.state.Desc });
        }
    }, {
        key: 'OpenMessages',
        value: function OpenMessages() {
            this.setState({ ShowMessages: !this.state.ShowMessages });
        }
    }, {
        key: 'render',
        value: function render() {
            {

                if (this.state.UserData.UsrPhotoBig) {
                    var divStyle = {
                        backgroundImage: 'url(' + this.state.UserData.UsrPhotoBig + ')'
                    };
                } else {
                    var divStyle = {
                        backgroundImage: 'url(/images/LogoProfile.jpg)'
                    };
                }

                if (this.state.Loading) {
                    return _react2.default.createElement(
                        'div',
                        { className: 'content contentProfile' },
                        _react2.default.createElement('div', { className: 'topprofile heightProfZ' })
                    );
                } else {
                    return _react2.default.createElement(
                        'div',
                        { className: 'content contentProfile' },
                        _react2.default.createElement(
                            'div',
                            { className: 'topprofile', style: this.state.UserData.VIPSTYLE },
                            _react2.default.createElement(
                                'div',
                                { className: 'profileleftContent' },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'DisplayUserCity' },
                                    ' ',
                                    this.state.UserData.UsrCity && _react2.default.createElement(
                                        'span',
                                        null,
                                        _react2.default.createElement('i', { className: 'far fa-dot-circle', 'aria-hidden': 'true' }),
                                        ' ',
                                        this.state.UserData.UsrCity,
                                        ' '
                                    )
                                ),
                                this.state.UserData.UsrDesc && !this.state.Desc && _react2.default.createElement(
                                    'div',
                                    { className: 'aboutbtn', onClick: this.openDesc },
                                    ' \u041E \u0441\u0435\u0431\u0435 ',
                                    _react2.default.createElement('i', { className: 'fa fa-angle-down ButtonMod', 'aria-hidden': 'true' })
                                ),
                                this.state.UserData.UsrDesc && this.state.Desc && _react2.default.createElement(
                                    'div',
                                    { className: 'aboutbtn', onClick: this.openDesc },
                                    '\u041E \u0441\u0435\u0431\u0435 ',
                                    _react2.default.createElement('i', { className: 'fa fa-angle-up ButtonMod', 'aria-hidden': 'true' })
                                ),
                                this.state.Desc && _react2.default.createElement(
                                    'div',
                                    { className: 'usrdesc' },
                                    this.state.UserData.UsrDesc
                                ),
                                this.state.DisplayProfileEditButton && _react2.default.createElement(
                                    _reactRouter.Link,
                                    { to: '/User/' + this.state.UserData.NBID + '/edit', className: 'EditProfileButton' },
                                    '  ',
                                    _react2.default.createElement('i', { className: 'fas fa-sliders-h ButtonModEdit', 'data-fa-transform': 'shrink-4 rotate-90' }),
                                    ' \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C'
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'profiletoptext' },
                                _react2.default.createElement(
                                    'p',
                                    { className: 'DisplayUserName' },
                                    this.state.UserData.UsrFirstName || _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u0418\u043C\u044F \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E'
                                    ),
                                    ' ',
                                    this.state.UserData.UsrLastName,
                                    ' , ',
                                    this.state.UserData.DateofBirthday && _react2.default.createElement(
                                        'span',
                                        null,
                                        this.state.Age
                                    ),
                                    ' '
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'DisplayUserPhoto' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'DisplayUserPhotoFix ', style: divStyle },
                                        _react2.default.createElement('img', { src: this.state.UserData.UsrPhotoBig, alt: this.state.UserData.UsrFirstName })
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'ProfileAuthorizitedInProfileAvatarBlockLevel' },
                                        this.state.UserData.Level
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'ProfileAuthorizitedInProfileAvatarBlockLevelLabel' },
                                        '\u0423\u0440\u043E\u0432\u0435\u043D\u044C'
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'regestrationDate' },
                                    '\u0417\u0430\u0440\u0435\u0433\u0435\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D | ',
                                    this.state.UserData.DateOfReg
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'profileRightContent' },
                                this.state.SendFriendRequest && _react2.default.createElement(
                                    'div',
                                    { className: 'addFriendButtoN', onClick: this.SendFriendRequest },
                                    _react2.default.createElement('i', { className: 'fa fa-plus fa-border AddFriendICon' }),
                                    ' ',
                                    _react2.default.createElement(
                                        'div',
                                        null,
                                        '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0434\u0440\u0443\u0437\u044C\u044F'
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'bottomprofile' },
                            _react2.default.createElement(
                                'div',
                                { className: 'tabs' },
                                _react2.default.createElement(
                                    'ul',
                                    null,
                                    _react2.default.createElement(
                                        'li',
                                        { className: this.state.FirstTabClaas, onClick: this.SobitiyaTabEnable },
                                        _react2.default.createElement(
                                            'a',
                                            { className: this.state.ATabsClass },
                                            '\u0421\u043E\u0431\u044B\u0442\u0438\u044F '
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'li',
                                        { className: this.state.SecondTabClass, onClick: this.FriendsTabEnable },
                                        _react2.default.createElement(
                                            'a',
                                            { className: this.state.ATabsClass },
                                            '\u0414\u0440\u0443\u0437\u044C\u044F ',
                                            this.state.IncomingInvites !== 0 && this.state.DisplayProfileEditButton && _react2.default.createElement(
                                                'div',
                                                { className: 'IconOfMissingAlerts' },
                                                this.state.IncomingInvites
                                            )
                                        )
                                    ),
                                    this.state.DisplayMessageTab && _react2.default.createElement(
                                        'li',
                                        { className: 'three', onClick: this.MessagesTabEnable },
                                        _react2.default.createElement(
                                            'a',
                                            { className: this.state.ATabsClass },
                                            '\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F',
                                            this.state.IncomingMessages !== 0 && this.state.DisplayProfileEditButton && _react2.default.createElement(
                                                'div',
                                                { className: 'IconOfMissingAlerts' },
                                                this.state.IncomingMessages
                                            )
                                        )
                                    ),
                                    _react2.default.createElement('hr', { id: 'menuUnderline', className: this.state.hrTabsClass })
                                )
                            ),
                            this.state.EventsTab && _react2.default.createElement(
                                'div',
                                { className: 'OnService' },
                                _react2.default.createElement('i', { className: 'fas fa-wrench' }),
                                '\u0420\u0430\u0437\u0434\u0435\u043B \u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435'
                            ),
                            this.state.FriendsTab && _react2.default.createElement(
                                'div',
                                { className: 'Friendsblock' },
                                this.state.UserData.FriendList && _react2.default.createElement(_FriendsList2.default, { UserData: this.state.UserData, DisplayMessageTab: this.state.DisplayMessageTab }),
                                !this.state.UserData.FriendList && _react2.default.createElement(
                                    'div',
                                    { className: 'OnService' },
                                    _react2.default.createElement('i', { className: 'fas fa-smile' }),
                                    ' \u0417\u0434\u0435\u0441\u044C \u0431\u0443\u0434\u0443\u0442 \u0432\u0430\u0448\u0438 \u0434\u0440\u0443\u0437\u044C\u044F'
                                )
                            ),
                            this.state.MessagesTab && _react2.default.createElement(_Messages2.default, { DisplayType: 'OnPage' })
                        )
                    );
                }
            }
        }
    }]);

    return Profile;
}(_react2.default.Component);

exports.default = Profile;
;

/***/ }),

/***/ 599:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(57);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loading = function Loading() {
    return _react2.default.createElement(
        'div',
        { className: 'loadingState' },
        '        ',
        _react2.default.createElement(
            'div',
            { className: 'sk-folding-cube' },
            _react2.default.createElement('div', { className: 'sk-cube1 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube2 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube4 sk-cube' }),
            _react2.default.createElement('div', { className: 'sk-cube3 sk-cube' })
        ),
        _react2.default.createElement(
            'div',
            { className: 'loadinglabel' },
            '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E...'
        )
    );
};

var Content = function (_React$Component) {
    _inherits(Content, _React$Component);

    function Content(props) {
        _classCallCheck(this, Content);

        var _this = _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).call(this, props));

        _this.state = {
            Loading: true,
            UserData: {},
            ip: "",
            usrPhoto: ""
        };

        _this.componentWillMount = _this.componentWillMount.bind(_this);
        _this.AddVk = _this.AddVk.bind(_this);

        return _this;
    }

    _createClass(Content, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            if (this.props.UserData.UsrPhotoBig != "../images/LogoProfile.jpg") {
                this.setState({ usrPhoto: this.props.UserData.UsrPhotoBig });
            } else {
                this.setState({ usrPhoto: '' });
            }
            this.setState({ UserData: this.props.UserData });
            this.setState({ Loading: false });

            $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function (data) {
                console.log(data);
                this.setState({ ip: data.geobytesipaddress });
            }.bind(this));
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.UserData.UsrPhotoBig == "../images/LogoProfile.jpg") {
                $('#blah').attr('src', "/images/LogoProfile.jpg");
            } else $('#blah').attr('src', this.state.usrPhoto);
        }
    }, {
        key: 'AddVk',
        value: function (_AddVk) {
            function AddVk() {
                return _AddVk.apply(this, arguments);
            }

            AddVk.toString = function () {
                return _AddVk.toString();
            };

            return AddVk;
        }(function () {
            AddVk(this.state.UserData);
        })
    }, {
        key: 'changePhotoUrl',
        value: function changePhotoUrl(event) {

            $('#blah').attr('src', event.target.value);
        }
    }, {
        key: 'changePhotoFile',
        value: function changePhotoFile(event) {
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah').attr('src', e.target.result);
                };

                reader.readAsDataURL(event.target.files[0]);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var urltophoto = "";
            if (this.state.usrPhoto[0] == '/') {
                urltophoto = 'http://nightbrowser.herokuapp.com' + this.state.usrPhoto;
            } else {
                if (this.state.usrPhoto == '../images/LogoProfile.jpg') {
                    urltophoto = 'http://nightbrowser.herokuapp.com/images/LogoProfile.jpg';
                } else {
                    urltophoto = this.state.usrPhoto;
                }
            }
            if (this.state.Loading == true) {
                return _react2.default.createElement(Loading, null);
            } else {
                return _react2.default.createElement(
                    'div',
                    { className: 'content' },
                    _react2.default.createElement(
                        'div',
                        { className: 'ProfileEditBack' },
                        _react2.default.createElement(
                            'div',
                            { className: 'ProfileEditForm' },
                            _react2.default.createElement(
                                'p',
                                { className: 'formcaption' },
                                ' \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F'
                            ),
                            _react2.default.createElement(
                                'form',
                                { action: '/UploadPhoto', method: 'POST', encType: 'multipart/form-data' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'ProfileEditSocial' },
                                    '\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0421\u0435\u0442\u0438:',
                                    _react2.default.createElement('br', null),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'LoginButtons' },
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'vk_vhod', onClick: this.AddVk },
                                            _react2.default.createElement('img', { src: '/images/vklogo.png', width: '60', height: '60' })
                                        )
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'inlineblock' },
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'ProfileEditFields' },
                                        _react2.default.createElement(
                                            _reactBootstrap.ControlLabel,
                                            null,
                                            '\u0412\u0430\u0448\u0435 \u0438\u043C\u044F'
                                        ),
                                        _react2.default.createElement(_reactBootstrap.FormControl, { type: 'text', name: 'FirstName', required: true, defaultValue: this.props.UserData.UsrFirstName,
                                            placeholder: '\u0418\u043C\u044F' }),
                                        '\xA0',
                                        _react2.default.createElement(_reactBootstrap.FormControl, { type: 'text', name: 'SecondName', required: true, defaultValue: this.props.UserData.UsrLastName,
                                            placeholder: '\u0424\u0430\u043C\u0438\u043B\u0438\u044F' })
                                    ),
                                    _react2.default.createElement('input', { type: 'hidden', id: 'NBID', name: 'NBID', value: this.props.UserData.NBID }),
                                    _react2.default.createElement('input', { type: 'hidden', id: 'UserIp', name: 'UserIp', value: this.state.ip }),
                                    _react2.default.createElement(
                                        _reactBootstrap.FormGroup,
                                        { controlId: 'formControls', className: 'shortfieldgroup EventFromTime' },
                                        _react2.default.createElement(
                                            _reactBootstrap.ControlLabel,
                                            null,
                                            ' \u0424\u043E\u0442\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044F '
                                        ),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'eventimgprewblock' },
                                            _react2.default.createElement('img', { id: 'blah', src: '/images/200.jpg', alt: 'your image' })
                                        ),
                                        _react2.default.createElement(
                                            'label',
                                            { htmlFor: 'imgInp', className: 'custom-file-upload' },
                                            _react2.default.createElement('i', { className: 'fa fa-cloud-upload' }),
                                            ' \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435'
                                        ),
                                        _react2.default.createElement('input', { id: 'imgInp', type: 'file', name: 'avatar', onChange: this.changePhotoFile }),
                                        _react2.default.createElement(_reactBootstrap.FormControl, { type: 'url', defaultValue: urltophoto, placeholder: '\u0418\u043B\u0438 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 url \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F (\u041E\u0441\u0442\u0430\u0432\u0442\u044C\u0435 \u043F\u0443\u0441\u0442\u044B\u043C \u0435\u0441\u043B\u0438 \u0432\u044B \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0438 \u0441\u0432\u043E\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435)', name: 'AvatarURL', onChange: this.changePhotoUrl })
                                    )
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'inlineblock fortextarea' },
                                    _react2.default.createElement(
                                        _reactBootstrap.FormGroup,
                                        { controlId: 'formControlsTextarea', className: 'shortfieldgroup editdiv' },
                                        _react2.default.createElement(
                                            _reactBootstrap.ControlLabel,
                                            null,
                                            '\u041E \u0441\u0435\u0431\u0435'
                                        ),
                                        _react2.default.createElement(_reactBootstrap.FormControl, { placeholder: '\u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438\u0442\u0435 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u043E \u0442\u043E\u043C, \u0447\u0442\u043E \u043B\u044E\u0434\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0437\u043D\u0430\u0442\u044C \u043E \u0432\u0430\u0441 (\u043C\u0430\u043A\u0441. 180 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)', maxlength: '180', componentClass: 'textarea', defaultValue: this.props.UserData.UsrDesc, name: 'UserDescription' })
                                    ),
                                    _react2.default.createElement(
                                        'div',
                                        { className: 'inlineblockcenter' },
                                        _react2.default.createElement(
                                            _reactBootstrap.FormGroup,
                                            { controlId: 'formControls', className: 'EventFromTime' },
                                            _react2.default.createElement(
                                                _reactBootstrap.ControlLabel,
                                                null,
                                                ' \u041F\u043E\u043B '
                                            ),
                                            _react2.default.createElement(
                                                'div',
                                                { className: 'button-wrap' },
                                                this.props.UserData.Sex == "Мужской" && _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'no-button', value: '\u041C\u0443\u0436\u0441\u043A\u043E\u0439', defaultChecked: true }),
                                                (!this.props.UserData.Sex || this.props.UserData.Sex == "Женский") && _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'no-button', value: '\u041C\u0443\u0436\u0441\u043A\u043E\u0439' }),
                                                _react2.default.createElement(
                                                    'label',
                                                    { className: 'button-label', htmlFor: 'no-button' },
                                                    _react2.default.createElement(
                                                        'h1',
                                                        null,
                                                        '\u043C\u0443\u0436\u0441\u043A\u043E\u0439'
                                                    )
                                                ),
                                                this.props.UserData.Sex == "Женский" && _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'maybe-button', value: '\u0416\u0435\u043D\u0441\u043A\u0438\u0439', defaultChecked: true }),
                                                (!this.props.UserData.Sex || this.props.UserData.Sex == "Мужской") && _react2.default.createElement('input', { className: 'hidden radio-label', type: 'radio', name: 'Sex', id: 'maybe-button', value: '\u0416\u0435\u043D\u0441\u043A\u0438\u0439' }),
                                                _react2.default.createElement(
                                                    'label',
                                                    { className: 'button-label', htmlFor: 'maybe-button' },
                                                    _react2.default.createElement(
                                                        'h1',
                                                        null,
                                                        '\u0436\u0435\u043D\u0441\u043A\u0438\u0439'
                                                    )
                                                )
                                            )
                                        ),
                                        _react2.default.createElement(
                                            _reactBootstrap.FormGroup,
                                            { controlId: 'formControls', className: 'EventFromTime' },
                                            _react2.default.createElement(
                                                _reactBootstrap.ControlLabel,
                                                null,
                                                '\u0414\u0430\u0442\u0430 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F'
                                            ),
                                            this.props.UserData.DateofBirthday && _react2.default.createElement(_reactBootstrap.FormControl, { type: 'date', name: 'DateofBirthday', defaultValue: this.props.UserData.DateofBirthday, required: true }),
                                            !this.props.UserData.DateofBirthday && _react2.default.createElement(_reactBootstrap.FormControl, { type: 'date', name: 'DateofBirthday', defaultValue: curDate(18), required: true })
                                        )
                                    )
                                ),
                                _react2.default.createElement(
                                    _reactBootstrap.Button,
                                    { className: 'formsubmit', type: 'submit', name: 'submit' },
                                    '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C'
                                )
                            )
                        )
                    )
                );
            }
        }
    }]);

    return Content;
}(_react2.default.Component);

exports.default = Content;
;

/***/ }),

/***/ 600:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports
exports.push([module.i, "@import url(http://fonts.googleapis.com/css?family=Lato:300,400,900);", ""]);

// module
exports.push([module.i, ".button-label {\n  display: inline-block;\n  padding: 0.2em 0.7em;\n  margin: 0 0.5em;\n  cursor: pointer;\n  color: #292929;\n  border-radius: 0.25em;\n  background: #efefef;\n  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2), inset 0 -3px 0 rgba(0, 0, 0, 0.22);\n  transition: 0.3s;\n  user-select: none; }\n  .button-label h1 {\n    font-size: 1em;\n    font-family: \"Lato\", sans-serif; }\n  .button-label:hover {\n    background: gainsboro;\n    color: #101010;\n    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2), inset 0 -3px 0 rgba(0, 0, 0, 0.32); }\n  .button-label:active {\n    transform: translateY(2px);\n    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2), inset 0px -1px 0 rgba(0, 0, 0, 0.22); }\n  @media (max-width: 40em) {\n    .button-label {\n      padding: 0em 1em 3px;\n      margin: 0.25em; } }\n\n#yes-button:checked + .button-label {\n  background: #3c3434;\n  color: #efefef; }\n  #yes-button:checked + .button-label:hover {\n    background: #2e2828;\n    color: #e2e2e2; }\n\n#no-button:checked + .button-label {\n  background: #7399d5;\n  color: #efefef; }\n  #no-button:checked + .button-label:hover {\n    background: #5f8bcf;\n    color: #e2e2e2; }\n\n#maybe-button:checked + .button-label {\n  background: #7399d5;\n  color: #efefef; }\n  #maybe-button:checked + .button-label:hover {\n    background: #5f8bcf;\n    color: #e2e2e2; }\n\n.hidden {\n  display: none; }\n\nul,\nli {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n.tg-list {\n  text-align: center;\n  display: flex;\n  align-items: center; }\n\n.tg-list-item {\n  margin: 0 2em; }\n\nh2 {\n  color: #777; }\n\nh4 {\n  color: #999; }\n\n.tgl {\n  display: none; }\n  .tgl, .tgl:after, .tgl:before,\n  .tgl *,\n  .tgl *:after,\n  .tgl *:before,\n  .tgl + .tgl-btn {\n    box-sizing: border-box; }\n    .tgl::selection, .tgl:after::selection, .tgl:before::selection,\n    .tgl *::selection,\n    .tgl *:after::selection,\n    .tgl *:before::selection,\n    .tgl + .tgl-btn::selection {\n      background: none; }\n  .tgl + .tgl-btn {\n    margin: 0 0.7em;\n    outline: 0;\n    display: block;\n    width: 3em;\n    height: 2em;\n    position: relative;\n    cursor: pointer;\n    user-select: none; }\n    .tgl + .tgl-btn:after, .tgl + .tgl-btn:before {\n      position: relative;\n      display: block;\n      content: \"\";\n      width: 50%;\n      height: 100%; }\n    .tgl + .tgl-btn:after {\n      left: 0; }\n    .tgl + .tgl-btn:before {\n      display: none; }\n  .tgl:checked + .tgl-btn:after {\n    left: 50%; }\n\n.tgl-light + .tgl-btn {\n  background: #f0f0f0;\n  border-radius: 2em;\n  padding: 2px;\n  transition: all .4s ease; }\n  .tgl-light + .tgl-btn:after {\n    border-radius: 50%;\n    background: #fff;\n    transition: all .2s ease; }\n\n.tgl-light:checked + .tgl-btn {\n  background: #9FD6AE; }\n\n.tgl-ios + .tgl-btn {\n  background: #fbfbfb;\n  border-radius: 2em;\n  padding: 2px;\n  transition: all .4s ease;\n  border: 1px solid #e8eae9; }\n  .tgl-ios + .tgl-btn:after {\n    border-radius: 2em;\n    background: #fbfbfb;\n    transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), padding 0.3s ease, margin 0.3s ease;\n    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08); }\n  .tgl-ios + .tgl-btn:hover:after {\n    will-change: padding; }\n  .tgl-ios + .tgl-btn:active {\n    box-shadow: inset 0 0 0 2em #e8eae9; }\n    .tgl-ios + .tgl-btn:active:after {\n      padding-right: .8em; }\n\n.tgl-ios:checked + .tgl-btn {\n  background: #86d993; }\n  .tgl-ios:checked + .tgl-btn:active {\n    box-shadow: none; }\n    .tgl-ios:checked + .tgl-btn:active:after {\n      margin-left: -.8em; }\n\n.tgl-skewed + .tgl-btn {\n  overflow: hidden;\n  transform: skew(-10deg);\n  backface-visibility: hidden;\n  transition: all .2s ease;\n  font-family: sans-serif;\n  background: #888; }\n  .tgl-skewed + .tgl-btn:after, .tgl-skewed + .tgl-btn:before {\n    transform: skew(10deg);\n    display: inline-block;\n    transition: all .2s ease;\n    width: 100%;\n    text-align: center;\n    position: absolute;\n    line-height: 2em;\n    font-weight: bold;\n    color: #fff;\n    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4); }\n  .tgl-skewed + .tgl-btn:after {\n    left: 100%;\n    content: attr(data-tg-on); }\n  .tgl-skewed + .tgl-btn:before {\n    left: 0;\n    content: attr(data-tg-off); }\n  .tgl-skewed + .tgl-btn:active {\n    background: #888; }\n    .tgl-skewed + .tgl-btn:active:before {\n      left: -10%; }\n\n.tgl-skewed:checked + .tgl-btn {\n  background: #86d993; }\n  .tgl-skewed:checked + .tgl-btn:before {\n    left: -100%; }\n  .tgl-skewed:checked + .tgl-btn:after {\n    left: 0; }\n  .tgl-skewed:checked + .tgl-btn:active:after {\n    left: 10%; }\n\n.tgl-flat + .tgl-btn {\n  padding: 2px;\n  transition: all .2s ease;\n  background: #fff;\n  border: 4px solid #3c3434;\n  border-radius: 2em; }\n  .tgl-flat + .tgl-btn:after {\n    transition: all .2s ease;\n    background: #3c3434;\n    content: \"\";\n    border-radius: 1em; }\n\n.tgl-flat:checked + .tgl-btn {\n  border: 4px solid #7399d5; }\n  .tgl-flat:checked + .tgl-btn:after {\n    left: 50%;\n    background: #7399d5; }\n\n.tgl-flip + .tgl-btn {\n  padding: 2px;\n  transition: all .2s ease;\n  font-family: sans-serif;\n  perspective: 100px; }\n  .tgl-flip + .tgl-btn:after, .tgl-flip + .tgl-btn:before {\n    display: inline-block;\n    transition: all .4s ease;\n    width: 100%;\n    text-align: center;\n    position: absolute;\n    line-height: 2em;\n    font-weight: bold;\n    color: #fff;\n    position: absolute;\n    top: 0;\n    left: 0;\n    backface-visibility: hidden;\n    border-radius: 4px; }\n  .tgl-flip + .tgl-btn:after {\n    content: attr(data-tg-on);\n    background: #02C66F;\n    transform: rotateY(-180deg); }\n  .tgl-flip + .tgl-btn:before {\n    background: #FF3A19;\n    content: attr(data-tg-off); }\n  .tgl-flip + .tgl-btn:active:before {\n    transform: rotateY(-20deg); }\n\n.tgl-flip:checked + .tgl-btn:before {\n  transform: rotateY(180deg); }\n\n.tgl-flip:checked + .tgl-btn:after {\n  transform: rotateY(0);\n  left: 0;\n  background: #7399d5; }\n\n.tgl-flip:checked + .tgl-btn:active:after {\n  transform: rotateY(20deg); }\n\n.agerangeslidercover {\n  position: absolute;\n  background-color: rgba(243, 232, 232, 0.6);\n  width: 100%;\n  height: 75px;\n  z-index: 2; }\n\ntextarea.form-control {\n  height: 84.5%; }\n\n.formgroupinline1 {\n  display: flex;\n  height: 340px; }\n\n.formgroupinline {\n  display: flex;\n  align-items: center;\n  justify-content: center; }\n\ninput[type=\"date\"], input[type=\"time\"], input[type=\"number\"] {\n  margin: 0 0.5em; }\n\ninput[type=\"date\"] {\n  width: 160px; }\n\ninput[type=\"time\"] {\n  width: 100px; }\n\ninput[type=\"number\"] {\n  min-width: 20px;\n  max-width: 50px; }\n\n.formcaption {\n  align-self: center;\n  font-size: 14pt;\n  margin-bottom: 2%; }\n\n.formsubmit {\n  align-self: center;\n  font-size: 14pt;\n  margin-bottom: 2%;\n  margin-top: 2%; }\n\n.rangeslider {\n  position: relative;\n  width: 75%;\n  margin-left: 2em; }\n  .rangeslider > span {\n    width: 100%; }\n\n.shortfieldgroup {\n  width: 46%; }\n\n.CreateEventForm {\n  color: black;\n  display: flex;\n  flex-direction: column;\n  margin-top: 20px; }\n\n.eventimgprewblock {\n  width: 200px;\n  height: 200px;\n  line-height: 200px;\n  text-align: center;\n  margin: 0 auto; }\n\n.eventimgprewblock img {\n  max-width: 100%;\n  max-height: 100%;\n  vertical-align: middle; }\n\n.justyfied {\n  justify-content: space-between; }\n", ""]);

// exports


/***/ }),

/***/ 601:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".contentChat{    background-color: #000000;}\r\n.FindChatBlock{text-align: center;\r\n\r\n\r\n}\r\n.ChatsBlockLabel{\r\n    text-align: center;\r\n    font-size: 24px;\r\n    font-family: \"Arial\";\r\n    color: rgb(40, 164, 201);\r\n    font-weight: bold;\r\n    margin-bottom: 15px;\r\n    line-height: 1.2;\r\n}\r\n.SearchInputInChats{\r\n    height: 40px;\r\n    padding: 5px;\r\n    font-size: 1.5em;\r\n    border-width: 4.43px;\r\n    border-color: rgb(40, 164, 201);\r\n    border-style: solid;\r\n    background-color: rgb(52, 45, 45);\r\n    width: 250px;\r\n    border-radius: 25px;\r\n    display: inline-block;\r\n}\r\n.SearchPoint{\r\n    border-radius: 50%;\r\n    height: 40px;\r\n    width: 40px;\r\n    border-width: 3.15px;\r\n    border-style: solid;\r\n    border-color: rgb(117, 100, 221);\r\n    align-self: center;\r\n    margin-left: -39px;\r\n    position: relative;\r\n    color: white;\r\n    font-size: 1.6em;\r\n    background-color: rgb(37, 37, 39);\r\n    justify-content: center;\r\n    padding-top: 3px;\r\n    transition: 0.5s;\r\n    display: inline-block;\r\n}\r\n.SearchPoint:hover{\r\n    color: gray;\r\n}\r\n.poisk{\r\n position: relative;\r\n top: 0px;\r\n    left:-2px;\r\n}\r\n", ""]);

// exports


/***/ }),

/***/ 602:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".btn-loadede{\r\n    background-color: indianred;\r\n}\r\n.ChatBlockOnChatsPage{\r\n    width: 233px;\r\n    display: inline-block;\r\n    margin: 5px;\r\n    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\r\n    top: 0px;\r\n}\r\n.ChatsBlockMain{\r\n\r\n    text-align: center;\r\n    padding-right: 10%;\r\n    padding-left: 10%;\r\n}\r\n.ChatsPrimaryBlockOnMainPageContentBlockphoto{\r\n    white-space: normal;\r\n    height: 101px;\r\n    width: 100%;\r\n    background: 50% 100% no-repeat;\r\n    background-size: cover;\r\n    background-position: center;\r\n    text-align: center;\r\n}\r\n.ChatsBlockLabel{\r\n    font-family: \"Arial\";\r\n    color: rgb(211, 218, 205);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n    text-align: center;\r\n    margin-top: 15px;\r\n    font-size: x-large;\r\n}\r\n.ChatsBlockSwitcher{\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n    text-align: center;\r\n    transition: 1s;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n    line-height: 27px;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n.tgl1{\r\n    display: none;\r\n}\r\n.tgl-flat1:checked + .tgl-btn1{\r\n    border: 4px solid #28a4c9;\r\n}\r\n.tgl-flat1:checked + .tgl-btn1:after {\r\n/left: 50%;\r\n    background: #7399d5;\r\n}\r\n.tgl1:checked + .tgl-btn1:after {\r\n    left: 50%;\r\n}\r\n.tgl-flat1 + .tgl-btn1 {\r\n    padding: 2px;\r\n    transition: all .2s ease;\r\n    background: #3c3434;\r\n    border: 4px solid #28a4c9;\r\n    border-radius: 2em;\r\n}\r\n.tgl1 + .tgl-btn1 {\r\n    margin: 0 0.7em;\r\n    outline: 0;\r\n    display: block;\r\n    width: 5em;\r\n    height: 2em;\r\n    position: relative;\r\n    cursor: pointer;\r\n    user-select: none;\r\n}\r\n.tgl1, .tgl1:after, .tgl1:before, .tgl1 *, .tgl1 *:after, .tgl1 *:before, .tgl1 + .tgl-btn1 {\r\n    box-sizing: border-box;\r\n}\r\n.tgl-flat1 + .tgl-btn1:after {\r\n    transition: all .2s ease;\r\n    background: #a7af9f;\r\n    content: \"\";\r\n    border-radius: 1em;\r\n}\r\n.tgl1 + .tgl-btn1:after {\r\n    left: 0;\r\n}\r\n.tgl1 + .tgl-btn1:after {\r\n    position: relative;\r\n    display: block;\r\n    content: \"\";\r\n    width: 50%;\r\n    height: 100%;\r\n}\r\n.ChatBlockOnMainPage{\r\n    width: 30%;\r\n    display: inline-block;\r\n    margin: 5px;\r\n    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\r\n    top: 0px;\r\n    position: relative;\r\n    transition:all 0.3s ease;\r\n}\r\n.ChatBlockOnMainPage:hover .ChatBlockOnHover{\r\n    -webkit-transform: scale(1.3);\r\n    -ms-transform: scale(1.3);\r\n    transform: scale(1.2);\r\n    opacity: 1;\r\n    box-shadow: inset 0 0 0 15px #53a7ea;\r\n}\r\n.ChatBlockOnHover{\r\n    transition:all 0.3s ease;\r\n    position: absolute;\r\n    left: 0;\r\n    opacity: .0;\r\n    background-color: black;\r\n    width: 100%;\r\n    height: 100%;\r\n    z-index: 2;\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    font-family: \"Myriad Pro\", sans-serif;\r\n    color: rgb(94, 176, 23);\r\n    font-size: 3.7vh;\r\n    font-weight: bold;\r\n    background: 50% 100% no-repeat;\r\n    background-size: cover;\r\n    background-position: center;\r\n}\r\n.ChatsPrimaryBlockOnMainPageContentBlockText{\r\n    background-color: #edeef0;\r\n    color:black;\r\n    text-align: center;\r\n    padding: 10px 20px;\r\n    overflow: hidden;\r\n    height:50px;\r\n}\r\n.ChatsPopularityOnChatsPage{\r\n    font-size: 3vh;\r\n    font-weight: bold;\r\nz-index: 1;\r\n    font-family: FANTASY;\r\n    float: left;\r\n    padding-top: 2px;\r\n    height: 4vh;\r\n    width: 4vh;\r\n    background-size: cover;\r\n    border-radius: 20px;\r\n    position: absolute;\r\n    margin: 5px;\r\n    border: 2px solid rgba(0, 204, 247, 0.55);}\r\n.ChatsPrimaryBlockOnMainPageContentBlockObyavNameTitle{\r\n    font-family: \"Myriad Pro\", sans-serif;\r\n    color: rgb(94, 176, 23);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n    font-size: 4vh;\r\n    text-align: center;\r\n\r\n}\r\n.ChatMessagesBlock{\r\n    color: black;\r\n}\r\n\r\n.ChatContnent{\r\n    min-height: 84.8vh;\r\n    background-position: center;\r\n    position: relative;\r\n    background-color: rgb(75,82,105);\r\n    background-repeat: no-repeat;\r\n    z-index: 0;\r\n}\r\n.BackgroundInfo{\r\n    height: 100%;\r\n    z-index: 1;\r\n    background-size: 100%;\r\n    background-image: -moz-linear-gradient( 150deg, rgb(11,11,11) 0%, rgb(75,82,105) 100%);\r\n    background-image: -webkit-linear-gradient( 150deg, rgb(11,11,11) 0%, rgb(75,82,105) 100%);\r\n    background-image: -ms-linear-gradient( 150deg, rgb(11,11,11) 0%, rgb(75,82,105) 100%);\r\n    opacity: .96;\r\n}\r\n\r\n.ChatHeader{\r\n    background-image: -moz-linear-gradient( 180deg, rgb(11,11,11) 0%, rgb(37,36,36) 100%);\r\n    background-image: -webkit-linear-gradient( 180deg, rgb(11,11,11) 0%, rgb(37,36,36) 100%);\r\n    background-image: -ms-linear-gradient( 180deg, rgb(11,11,11) 0%, rgb(37,36,36) 100%);\r\n    height: 81px;\r\n    z-index: 3;\r\n    width: 100%;\r\n    background-size: 100%;\r\n}\r\n\r\n.ShareInviteToChat {\r\n    border-radius: 50%;\r\n    background-image: -moz-linear-gradient( 90deg, rgb(40,164,201) 0%, rgb(101,83,154) 100%);\r\n    background-image: -webkit-linear-gradient( 90deg, rgb(40,164,201) 0%, rgb(101,83,154) 100%);\r\n    background-image: -ms-linear-gradient( 90deg, rgb(40,164,201) 0%, rgb(101,83,154) 100%);\r\n    position: absolute;\r\n    margin: 5px 5px;\r\n    height: 70px;\r\n    width: 70px;\r\n    background-size: 100%;\r\n    font-size: 2.5em;\r\n    display: flex;\r\n    justify-content: center;\r\n    padding-top: 12px;\r\n    padding-left: 5px;\r\n    color: #d9cece;\r\n    cursor:pointer;\r\n    transition: 0.2s;\r\n}\r\n.ShareInviteToChat:hover{\r\n    padding-top: 10px;\r\n    font-size: 2.8em;\r\n    color: whitesmoke;\r\n    background-image: -moz-linear-gradient( 120deg, rgb(40,164,201) 0%, rgb(101,83,154) 100%);\r\n    background-image: -webkit-linear-gradient( 120deg, rgb(40,164,201) 0%, rgb(101,83,154) 100%);\r\n    background-image: -ms-linear-gradient( 120deg, rgb(40,164,201) 0%, rgb(101,83,154) 100%);\r\n}\r\n.NameOfChatAndDesc{\r\n    text-align: center;\r\n    justify-content: center;\r\n\r\n}\r\n.NameOfChatAndDesc >span{\r\n    font-size: 30px;\r\n    font-family: \"Arial\";\r\n    color: rgb(25, 224, 41);\r\n    font-weight: bold;\r\n    line-height: 1.6;\r\n}\r\n.DescButton{\r\n    font-size: 18px;\r\n    font-family: \"Arial\";\r\n    color: rgb(236, 226, 226);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n    cursor: pointer;\r\n    width: 150px;\r\n    margin: 0 auto;\r\n    z-index: 5;\r\n    position: relative;\r\n}\r\n.ChatDesc{\r\n\r\n    position: absolute;\r\n    left: 50%;\r\n}\r\n.ChatDescIn{\r\n    width: 400px;\r\n    background-color: #191819;\r\n    position: relative; left: -50%;\r\n    opacity: .0;\r\n    color:#a89f9f;\r\n    margin-top: -50px;\r\n    transition: 0.5s;\r\n    border-bottom-right-radius: 25px;\r\n    border-bottom-left-radius: 25px;\r\n    border-right-color: rgb(40,164,201);\r\n    border-right-style: solid;\r\n    border-right-width: 1px;\r\n    border-bottom-color: rgb(40,164,201);\r\n    border-bottom-style: solid;\r\n    border-bottom-width: 3px;\r\n    border-left-color: rgb(40,164,201);\r\n    border-left-style: solid;\r\n    border-left-width: 1px;\r\n    z-index: 1;\r\n}\r\n.TypeOfPrivacy{\r\n    color:red;\r\n    text-align: right;\r\n    width: 120px;\r\n    right: 0;\r\n    position: absolute;\r\n    margin-right: 16px;\r\n    margin-top: -40px;\r\n}\r\n.fixgreen{\r\n    color:lawngreen;\r\n    margin-top: -60px;\r\n\r\n}\r\n.TypeOfPrivacy >i{\r\n    font-size: 4.3em;\r\n}\r\n.DisplayMessages{\r\n    width: 100%;\r\n    text-align: center;\r\n    justify-content: center;\r\n    overflow: scroll;\r\n    overflow-x: hidden;\r\n    min-height: 75.6vh;\r\n    height: 75.6vh;\r\n}\r\n.BottomMenu{\r\n    width: 100%;\r\n    height: 15%;\r\n}\r\n.MessagesBlockMain{\r\n    margin-bottom: -27px;\r\n}\r\n.UsrPhotoOnChat{\r\n    border-width: 3.79px;\r\n    border-color: rgb(117, 100, 221);\r\n    border-style: solid;\r\n    border-radius: 50%;\r\n    background-color: rgb(19, 19, 19);\r\n    width: 70px;\r\n    height: 70px;\r\n    position: relative;\r\n    z-index: 4;\r\n    min-height: 70px;\r\n    max-width: 70px;\r\n}\r\n\r\n.LeftSidePhotos{\r\n    margin-right: 50px;\r\n    display: inline-block;\r\n}\r\n.PhotoLabel{\r\n    font-family: \"Arial\";\r\n    border-style: solid;\r\n    border-width: 3px;\r\n    border-color: rgb(117, 100, 221);\r\n    border-radius: 10px;\r\n    background-color: black;\r\n    color: #2f8f1c;\r\n    width: 70px;\r\n    font-size: 0.8em;\r\n    padding-left: 4px;\r\n    font-weight: bold;\r\n    height: 22px;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    z-index: 7;\r\n    position: relative;\r\n    padding-top: 1px;\r\n    margin-top: -20px;\r\n}\r\n.SelfMessage{\r\n    width:40%;\r\n    background-color: #161515;\r\n    border-bottom-left-radius: 25px;\r\n    display: inline-flex;\r\n    min-height: 70px;\r\n    min-width: 300px;\r\n    position: relative;\r\n    top: -51px;\r\n    padding-left: 25px;\r\n    padding-top: 9px;\r\n    padding-bottom: 9px;\r\n}\r\n.DisplayMessages::-webkit-scrollbar-track\r\n{\r\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);\r\n    border-radius: 10px;\r\n    background-color: #F5F5F5;\r\n}\r\n\r\n.DisplayMessages::-webkit-scrollbar\r\n{\r\n    width: 5px;\r\n    background-color: #F5F5F5;\r\n}\r\n\r\n.DisplayMessages::-webkit-scrollbar-thumb\r\n{\r\n    border-radius: 10px;\r\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);\r\n    background-color: #555;\r\n}\r\n.ChatMessageBottomBarSend{\r\n    display: flex;\r\n    height: 78px;\r\n    min-height: 78px;\r\n    text-align: center;\r\n    justify-content: center;\r\n}\r\n.ChatMessageBottomBarSend>textarea{\r\n    padding: 5px;\r\n    padding-left: 18px;\r\n    padding-right: 54px;\r\n    margin: 1%;\r\n    min-width: 40%;\r\n    border-radius: 35px;\r\n    position: relative;\r\n    box-shadow: -16px 7px 37px -8px #000000 inset;\r\n    border-width: 3.15px;\r\n    border-color: rgb(117, 100, 221);\r\n    border-style: solid;\r\n    background-color: rgb(53, 53, 55);\r\n    color:whitesmoke;\r\n}\r\n.ChatMessageBottomBarSend>div{\r\n    border-radius: 50%;\r\n    height: 54px;\r\n    width: 54px;\r\n    border-width: 3.15px;\r\n    border-style: solid;\r\n    border-color: rgb(117, 100, 221);\r\n    align-self: center;\r\n    /* font-size: x-large; */\r\n    margin-left: -66px;\r\n    position: relative;\r\n    color: #eda237;\r\n    font-size: 2em;\r\n    background-color: rgb(37, 37, 39);\r\n    justify-content: center;\r\n    padding-top: 7px;\r\n    transition: 0.5s;\r\n}\r\n.ChatMessageBottomBarSend>div:hover{\r\n\r\n    font-size: 2.2em;\r\n    color: whitesmoke;\r\ntransform: rotate(180deg);\r\n}\r\n.LoadMore{\r\n    width: 150px;\r\n    display: inline-block;\r\n    padding: 5px;\r\n    border: 3.36px solid #7363d8;\r\n    border-radius: 20px;\r\n    margin-top: 5px;\r\n    margin-bottom: 3px;\r\n    background-color: rgb(40, 57, 94);\r\n    cursor:pointer;\r\n}\r\n.ScrollDown{\r\n    width: 150px;\r\n    bottom: 105px;\r\n    display: inline-block;\r\n    position: absolute;\r\n    padding: 5px;\r\n    border: 3.36px solid #7363d8;\r\n    border-radius: 20px;\r\n    margin-top: 5px;\r\n    margin-bottom: 3px;\r\n    background-color: rgb(40, 57, 94);\r\n    cursor: pointer;\r\n}\r\n.ScrollDown:hover{\r\n    background-color: rgb(68, 77, 94);\r\n}\r\n@media screen and (max-width: 768px) {\r\n    .ChatMessageBottomBarSend{\r\n\r\n        margin-top: -30px;\r\n    }\r\n    .ChatBlockOnChatsPage{\r\n        width: 100%;\r\n        margin: 0px;\r\n    }\r\n    .ChatDesc{\r\n        left:0;\r\n        width: 100%;\r\n    }\r\n    .ChatDescIn{\r\n        width:100%;\r\n        left:0;\r\n    }\r\n    .ChatsPrimaryBlockOnMainPageContentBlockObyavNameTitle{\r\n        font-size: 12pt;\r\n    }\r\n    .ChatsBlockMain{\r\n        padding-right: 0%;\r\n        padding-left:0%;\r\n    }\r\n    .LeftSidePhotos{\r\n        margin-right: 20px;\r\n    }\r\n}\r\n@media screen and (max-width: 400px) {\r\n.ChatDescIn{\r\n    width: 100%;\r\n}\r\n}", ""]);

// exports


/***/ }),

/***/ 603:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".CreateChatContent{\r\n    color: #fff;\r\n    background-color: hsla(0, 0%, 0%, 0.9);\r\n    width:100%;\r\n    margin: 0 0 auto auto;\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    text-align: center;\r\n}\r\n.fontfix2{font-size: 30px;\r\nfont-family: \"Arial\";\r\ncolor: rgb(18, 235, 29);\r\nfont-weight: bold;\r\nline-height: 1.2;}\r\n.CreateChatFormCaption{\r\n    align-self: center;\r\n    font-size: 14pt;\r\n    margin-right: 50px;\r\n    font-family: 'Arial';\r\n    color: rgb(206, 215, 206);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n\r\n}\r\n.CreateChatFormName{\r\n    margin-top: 20px;\r\n    flex-wrap: wrap;\r\n    display: flex;\r\n\r\n    text-align: left;\r\n}\r\n.FixMarg{\r\n    margin-left: 42px;\r\n}\r\n.CenterContentFix{\r\n    justify-content: center;\r\n}\r\n.ChatDescription{\r\n    width: 450px !important;\r\n    height: 148px !important;\r\n    padding: 3px;\r\n    padding-left: 21px !important;\r\n    border-radius: 20px !important;\r\n    font-family: 'Arial';\r\n    font-size: 14pt;\r\n    background-color: rgb(60, 52, 52);\r\n    color: white;\r\n\r\n    border: 2.5px solid #28a4c9;\r\n}\r\n.FontFix{\r\n    font-family: 'Arial';\r\n    font-size: 14pt;\r\n    background-color: rgb(60, 52, 52);\r\n    border-radius: 50px !important;\r\n    color: white;\r\n    padding: 3px;\r\n    border: 2.5px solid #28a4c9;\r\n}\r\n.CreateButton{\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n}\r\n.CreateChatContentLeft{\r\n    text-align: left;\r\n    margin: 0 auto;\r\n    width: 50%;\r\n}\r\n.CreateChateventimgprewblock {\r\n    width: 340px;\r\n    height: 200px;\r\n    text-align: center;\r\n    margin: 0 auto;\r\n    font-size: 30px;\r\n    font-family: \"Arial\";\r\n    color: rgb(18, 235, 29);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n}\r\n\r\n.CreateChateventimgprewblock img {\r\n    max-width: 100%;\r\n    max-height: 100%;\r\n    vertical-align: middle;\r\n}\r\n\r\n.CreateChatFormCaptionPhoto{\r\n    align-self: center;\r\n    font-size: 14pt;\r\n    font-family: 'Arial';\r\n    text-align: center;\r\n}\r\n.FlexFixx{\r\n\r\n    display: inline-flex;\r\n}\r\n\r\n.custom-photo-upload {\r\n    display: table;\r\n    margin: 0 auto;\r\n    padding: 6px 12px;\r\n    cursor: pointer;\r\n    margin-top: 50px;\r\n    margin-bottom: 10px;\r\n    background-color: rgb(33, 28, 65);\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(40, 164, 201);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n\r\n\r\n\r\n}\r\n@media screen and (max-width: 768px) {\r\n    .FixMarg {\r\n        margin-left: -113px;\r\n    }\r\n}", ""]);

// exports


/***/ }),

/***/ 604:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, "\n.CreateEventContentBg{\n  color: #fff;\n  background-color: #211f1f;\n  width: 100%;\n  height: 100%;\n   margin: 0 0 auto auto;\n   display: flex;\n   flex-direction: column;\n   justify-content: center;\n   text-align: center;\n}\n\n.HeadBlockEventContent{\n    position: relative;\n\n    margin-top: 80px;\n    height: 130px;\n    border-radius: 15px;\n    box-shadow: 0px 0px 56px 4px rgba(29, 60, 160, 0.92);\n}\n.MenuButtonBlockEventContent{\n    border-top-left-radius: 15px;\n    border-bottom-left-radius: 15px;\n    left: 0;\n    position: absolute;\n    width: 15%;\n    background-color: rgba(42,40,40,0.81);\n    height: 100%;\n    display: inline-flex;\n}\n.HeadInformationBlockEventContent{\n    left: 15%;\n   border-top-right-radius: 15px;\n    border-bottom-right-radius: 15px;\n    position: absolute;\n    width: 85%;\n    display: inline-flex;\n    background-color: rgba(42,40,40,0.81);\n    height: 100%;\n    background-repeat: no-repeat;\n    background-attachment: fixed;\n    background-position: center;\n    background: no-repeat center center;\n    background-size: cover;\n    justify-content: space-between;\n}\n.EventPagecaptionandtime{\n    margin:1% 3%;\n    width: 80%;\n}\n\n.EventPageeventcaption{\n    font-size: xx-large;\n    position: absolute;\n    top: 25px;\n}\n\n.EventPagedatetime{\n    border: 1px solid #04e762;\n    background-color: #04e762;\n    padding: 1px;\n    padding-left: 5px;\n\n    padding-right: 5px;\n    border-radius: 5px;\n    position: absolute;\n    top: 61px;\n    margin: 1% 0 0 1%;\n    font-family: sans-serif;\n    color: rgba(255,255,255,8.5);\n\n}\n\n.EventPageeventreq{\n    position: absolute;\n    display: flex;\n    right: 100px;\n    top: 25px;\n    font-size: x-large;\n\n}\n.EventPageGreenLabel{\n    border-radius: 39px;\n    border: 1px gray solid;\n    padding: 20px;\n    cursor:pointer;\n    transition: all 0.6s ease 0s;\n    display: inline-block;\n}\n\n.EventPageGreenLabel:hover {\n    background: #2ECC71;\n    border-color: #2ECC71 !important;\n    transition: all 0.6s ease 0s;\n}\n.EventPageRedLabel{\n    margin-left: 15px;\n    border-radius: 39px;\n    border: 1px gray solid;\n    padding: 20px;\n    cursor:pointer;\n    transition: all 0.6s ease 0s;\n    display: inline-block;\n    padding-left: 15px;\n    padding-right: 15px;\n}\n.EventPageRedLabel:hover {\n    background: #EC644B;\n    border-color: #EC644B !important;\n    transition: all 0.6s ease 0s;\n}\n.EventPageOrangeLabel{\n    border-radius: 39px;\n    border: 1px gray solid;\n    padding: 20px;\n    cursor:pointer;\n    transition: all 0.6s ease 0s;\n    display: inline-block;\n    padding-left: 15px;\n    padding-right: 15px;\n}\n.EventPageOrangeLabel:hover {\n    background: #EB9532;\n    border-color: #EB9532 !important;\n    transition: all 0.6s ease 0s;\n}\n\n.eventmiddle{\n    display:flex;\n    justify-content: space-between;\n    padding: 2% 3% 0% 2%;\n}\n.eventbottom{\n    position: relative;\n    font-family: Arial;\n    margin-top: 60px;\n    height: 400px;\n    border-radius: 15px;\n}\n.EventBLeftCol{\n    left: 0;\n    position: absolute;\n    width: 20%;\n   /*background-color: rgba(42,40,40,0.81);*/\n    height: 100%;\n}\n\n.EventBLeftColAuthor{\n    left: 0;\n    position: absolute;\n    width: 90%;\n    background-color: rgba(42,40,40,0.81);\n    height: 65%;\n    border-radius: 15px;\n    box-shadow: 0px 0px 56px 4px rgba(29, 60, 160, 0.92);\n}\n.divStyleUserPhotoBG{\n    height: 100px;\n    width: 100px;\n    border-radius: 50%;\n    border: 2px #55587b solid;\n    margin: 0 auto;\n    margin-top: 15px;\n    background-position: center;\n    background-size: auto 100%;\n    box-shadow: 0 0 10px 5px rgba(71,71,204,0.5);\n}\n.EventBLeftColAuthorLabelName{\n    color:#543bb7;\n    margin-top: 15px;\n    FONT-SIZE: 20PX;\n    FONT-WEIGHT: BOLD;\n}\n.EventBLeftColAuthorLabel{\n    color:#81e66a;\n    margin-top: 15px;\n    FONT-SIZE: 20PX;\n    FONT-WEIGHT: BOLD;\n}\n.EventBLeftColAuthorOpenButton{\n    margin: 0 auto;\n    width: 150px;\n    margin-top: 15px;\n    padding: 15px;\n    border: 1px solid #383736;\n    border-radius: 30px;\n    cursor: pointer;\n    transition:         0.12s ease-in;\n    position: relative;\n    outline: 0;\n    overflow:hidden;\n    background: none;\n    z-index: 1;\n    color:#b5b5c3;\n}\n.EventBLeftColAuthorOpenButton:hover {\n    color: #eaeaee;\n}\n\n.EventBLeftColAuthorOpenButton:before {\n    content: \"\";\n    position: absolute;\n    background: #383736;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    top: 100%;\n    z-index: -1;\n    -webkit-transition: top 0.15s ease-in;\n}\n\n.EventBLeftColAuthorOpenButton:hover:before {\n    top: 0;\n}\n\n.EventBLeftColListButton{\n    bottom: 0;\n    left:0;\n    position: absolute;\n    width: 90%;\n    background-color: rgba(42,40,40,0.81);\n    height: 25%;\n    border-radius: 15px;\n    box-shadow: 0px 0px 56px 4px rgba(29, 60, 160, 0.92);\n    font-size: 25px;\n}\n.EventBLeftColListButtonLabel{\n    margin-top: 15px;\n    FONT-SIZE: 17PX;\n    FONT-WEIGHT: BOLD;\n}\n.EventBLeftColListButtonListIcon{\n    margin-top: 10px;\n    cursor: pointer;\n    border: 3px solid #363534;\n}\n\n.EventBRightCol{\n    right: 0;\n    position: absolute;\n    width: 70%;\n    /*background-color: rgba(42,40,40,0.81);*/\n    height: 100%;\n    background-color: rgba(42,40,40,0.81);\n    border-radius: 15px;\n    box-shadow: 0px 0px 56px 4px rgba(29, 60, 160, 0.92);\n}\n\n.eventdesc {\n    display:flex;\n    align-content: flex-start;\n    flex-direction: column;\n    padding: 30px;\n    margin: 0 2% 3% 0;\n    font-size: 13pt;\n    z-index: 2;\n}\n.EventBRightColLastRed{\n    position: absolute;\n    right: 0;\n    z-index: 1;\n    width: 90px;\n    height: 100px;\n    margin: auto;\n    overflow: hidden;\n}\n.EventBRightColLastRedTrig{\n    position :absolute;\n    z-index: 3;\n    background-color: red;\n    width: 100%;\n    top: 0px;\n    height: 50px;\n    transition: height 500ms,top 500ms;\n}\n.EventBRightColLastReddroppgin{\n    position :relative;\n    top: 0px;\n    z-index: 2;\n    background-color: green;\n    width: auto;\n    height: 50px;\n    margin: auto;\n    transition: height 500ms,top 500ms;\n}\n.EventBRightColLastReddroppgin:hover + .EventBRightColLastRedTrig {\n    border-top: none;\n    top: 50px;\n    height: 50px;\n}\n\n.EventBRightColLastRedTrig:hover {\n    top: 50px;\n    height: 50px;\n}", ""]);

// exports


/***/ }),

/***/ 605:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".EventsPrimaryBlockOnMainPage{\r\n    padding-top: 1px;\r\n    color: #fff;\r\n    background: linear-gradient(270deg, #246655, #c2ffcb, #9800ff, #000000);\r\n    background-size: 800% 800%;\r\n    /*animation: Listbackgroundanimation 30s ease infinite;*/\r\n    width:100%;\r\n    height:100%;\r\n    margin: 0 0 auto auto;\r\n}\r\n\r\n\r\n.carousel {\r\n    background: #FAFAFA;\r\n}\r\n\r\n.carousel-cell {\r\n    width: 28%;\r\n    height: 200px;\r\n    margin-right: 10px;\r\n    background: #8C8;\r\n    border-radius: 5px;\r\n    counter-increment: carousel-cell;\r\n}\r\n.flickity-page-dots{\r\n    bottom: -3px;\r\n\r\n}\r\n.flickity-page-dots .dot{\r\n    background: #FFFFFF;\r\n}\r\n/* cell number */\r\n.carousel-cell:before {\r\n    display: block;\r\n    text-align: center;\r\n    content: counter(carousel-cell);\r\n    line-height: 200px;\r\n    font-size: 80px;\r\n    color: white;\r\n}\r\n\r\n.EventsPrimaryBlockOnMainPageAlert{\r\n    height: 35px;\r\n    background-color: black;\r\n    text-align: center;\r\n    transition: 1s;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n    position: relative;\r\n    line-height: 15px;\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n}\r\n\r\n.EventsPrimaryBlockOnMainPageAlertClose{\r\n    border-width: 3.15px;\r\n    border-color: rgb(40, 164, 201);\r\n    border-style: solid;\r\n    border-radius: 50%;\r\n    background-color: rgb(60, 52, 52);\r\n    width: 28px;\r\n    height: 28px;\r\n    z-index: 2;\r\n    position: absolute;\r\n    right: 10px;\r\n    color:#68d60f;\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    cursor:pointer;\r\n}\r\n.EventsPrimaryBlockOnMainPageTimeNext{\r\n    height: 59px;\r\n    background-color: black;\r\n    text-align: center;\r\n    transition: 1s;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n    position: relative;\r\n    line-height: 27px;\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n}\r\n.EventsPrimaryBlockOnMainPageTimeColor{\r\n    color:#68d60f;\r\n}\r\n\r\n.EventsPrimaryBlockOnMainPageViewNearest {\r\n    border-width: 3.15px;\r\n    border-color: rgb(45, 136, 164);\r\n    background-color: rgb(60, 52, 52);\r\n    border-radius: 20px;\r\n    border-style: solid;\r\n    color:#68d60f;\r\n\r\n    padding-right: 8px;\r\n    padding-left: 8px;\r\n    padding-top: 2px;\r\n    padding-bottom: 2px;\r\n    cursor:pointer;\r\n\r\n}\r\n.EventsPrimaryBlockOnMainPageViewNearest:hover{\r\n    opacity: .7;\r\n}\r\n.widthFix{\r\n    width: 200px;\r\n    margin: 0 auto;\r\n    margin-bottom: 25px;\r\n}\r\n.EventsPrimaryBlockOnMainPagelabel{\r\n    font-family: \"Myriad Pro\", sans-serif;\r\n    margin-top: -33px;\r\n    padding: 10px;\r\n    color:#efe5e7;\r\n}\r\n.EventsPrimaryBlockOnMainPageContent{\r\n    margin-top: 6px;\r\n    height: 330px;\r\n    word-wrap: break-word;\r\n    overflow-x: auto;\r\n    overflow-y: hidden;\r\n    white-space: nowrap;\r\n    margin-left: 5px;\r\n    margin-right: 5px;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentBlock{\r\n    width: 250px;\r\n    display: inline-block;\r\n    margin: 5px;\r\n    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\r\n\r\n    top: 0px;\r\n\r\n\r\n}\r\n.EventsPrimaryBlockOnMainPageContentLeft{\r\n    height: 320px;\r\n    display: inline-flex;\r\n    width: 50px;\r\n    background: red;\r\n    position: absolute;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentRight{\r\n    height: 320px;\r\n    display: inline-flex;\r\n    width: 50px;\r\n    background: red;\r\n    position: absolute;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentBlockphoto{\r\n    white-space: normal;\r\n    height: 200px;\r\n    width: 100%;\r\n    background: 50% 100% no-repeat;\r\n    background-size: cover;\r\n    background-position: center;\r\n    text-align: center;\r\n}\r\n\r\n.EventsPrimaryBlockOnMainPageContentBlockText{\r\n    background-color: #edeef0;\r\n    color:black;\r\n    text-align: center;\r\n    padding: 10px 20px;\r\n    overflow: hidden;\r\n    height: 111px;\r\n}\r\n\r\n.EventsPrimaryBlockOnMainPageContentBlockText>p{\r\n    white-space: normal;\r\n    display: -webkit-box;\r\n    -webkit-line-clamp: 3;\r\n    -webkit-box-orient: vertical;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    font-size: medium;\r\n    line-height: 1.2em;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentBlockTextCat{\r\n    font-weight: bold;\r\n    color: rebeccapurple;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentBlockTextDate{\r\n    font-weight: bold;\r\n\r\n}\r\n.EventsPrimaryBlockOnMainPageContentBlockCreatorPhotoTitle{\r\n    height: 50px;\r\n    width: 50px;\r\n    background-size: cover;\r\n    border-radius: 20px;\r\n    position: relative;\r\n    margin: 5px;\r\n    border: 2px solid rgba(0, 204, 247, 0.55);\r\n}\r\n\r\n\r\n.EventsPrimaryBlockOnMainPageContentBlockObyavNameTitle{\r\n    font-family: \"Myriad Pro\", sans-serif;\r\n    margin-top: 50px;\r\n    color:white;\r\n    font-weight: bold;\r\n    font-size: 12pt;\r\n    text-align: center;\r\n\r\n}\r\n\r\n\r\n.EventsPrimaryBlockOnMainPageContent::-webkit-scrollbar-track\r\n{\r\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);\r\n    border-radius: 10px;\r\n    background-color: rgba(255,255,255,.8);\r\n}\r\n\r\n.EventsPrimaryBlockOnMainPageContent::-webkit-scrollbar\r\n{\r\n    height: 10px;\r\n    cursor:pointer;\r\n    transition:1s;\r\n}\r\n\r\n.EventsPrimaryBlockOnMainPageContent::-webkit-scrollbar-thumb\r\n{\r\n    border-radius: 10px;\r\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);\r\n    background-color: #8c8989;\r\n    cursor: pointer;\r\n    transition: 1s;\r\n    border: 1px rgba(255,255,255,.8) solid;\r\n}\r\n.EventsPrimaryBlockOnMainPageContent::-webkit-scrollbar-thumb:hover{\r\n    background-color: rgba(22,22,21,0.8);\r\n    transition:1s;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentButtons{\r\n    margin-top: 10px;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentButtonsBlock{\r\n    background-color: #f7f0f0;\r\n    height:25px;\r\n    width: 240px;\r\n    margin: 0 auto;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentButtonsBlockNew{\r\n    display: inline-block;\r\n    width: 50%;\r\n    font-family: \"Arial\";\r\n    line-height: 25px;\r\n    transition: 1s;\r\n    height: 25px;\r\n    text-align: center;\r\n    cursor:pointer;\r\n}\r\n.EventsPrimaryBlockOnMainPageContentButtonsBlockPop{\r\n    cursor:pointer;\r\n    display: inline-block;\r\n    width: 50%;\r\n    font-family: \"Arial\";\r\n    line-height: 25px;\r\n    transition: 1s;\r\n    height: 25px;\r\n    text-align: center;\r\n}\r\n\r\n\r\n\r\n@media screen and (max-width: 768px) {\r\n    .EventsPrimaryBlockOnMainPagelabel{\r\n        margin-top: 0px;\r\n        text-align: center;\r\n\r\n    }\r\n}", ""]);

// exports


/***/ }),

/***/ 606:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".friendblock {\r\n    z-index: 1;\r\n    box-sizing: border-box;\r\n    width: 210px;\r\n    /*22%;*/\r\n    background-position: center;\r\n    background-repeat: no-repeat;\r\n    background-size: cover;\r\n    background-image:linear-gradient(rgba(29, 44, 70, 0.75),rgba(29, 44, 70, 0.75)), url(\"https://webref.ru/assets/images/html5-css3/img-06.jpg\") ;\r\n    padding: 1.5%;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    height: 210px;\r\n    margin: 15px 3% 15px 0;\r\n    overflow: hidden;\r\n    text-decoration: none;\r\n    border-radius: 20px;\r\n    box-shadow: 0 0 14px 8px rgba(75, 185, 220, 0.9);\r\n}\r\n/*друзья*/\r\n.friends{\r\n    display: flex;\r\nheight: 100%;\r\n    padding: 0 3%;\r\n    background-color: #3c3434 !important;\r\n}\r\n.FriendIncomingArea{\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    width:25%;\r\n    flex-direction: column;\r\n    align-items: center;\r\n}\r\n.friendrequestscaption {\r\n    color:black;\r\n}\r\n\r\n.FriendArea{\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    width: 75%;\r\n}\r\n.FriendArea1{\r\n    display: flex;\r\n    flex-wrap: wrap;\r\n    width: 100%;\r\n}\r\n\r\n\r\n.dispFlex{\r\n    display:flex;\r\n}\r\n\r\n\r\n.memberblock:hover .friendbottom {\r\n\r\n    margin-bottom: 15%;\r\n}\r\n.friendblock:hover .friendbottom{\r\n    margin-top: 20%;\r\n}\r\n.friendtop{\r\n    color: white;\r\n    cursor: pointer;\r\n    z-index: 50;\r\n    flex-direction: column;\r\n    align-self: flex-end;\r\n    font-size: 40px;\r\n}\r\n.friendblock p {\r\n    text-align: center;\r\n    color:white;\r\n}\r\n.friendblock i {\r\n    align-self: flex-end;\r\n}\r\n.friendbottom{\r\n    display: flex;\r\n    flex-direction: column;\r\n    font-size: large;\r\n    transition: all .3s ease-in-out;\r\n}\r\n.verticalhr{\r\n    height: auto;\r\n    min-height: 200px;\r\n    width: .25rem;\r\n}\r\n\r\n\r\n.Friendsblock{\r\n    color:black;\r\n}\r\n.leftPlusAdd{\r\n    display: inline-block;\r\n    font-size: 40px;\r\n}\r\n.rightMinusRemove{\r\n    display: inline-block;\r\n    font-size: 40px;\r\n    position: relative;\r\n    margin-right: 0px;\r\n    margin-left: 130px;\r\n}\r\n@media screen and (max-width: 768px) {\r\n    .rightMinusRemove{\r\n\r\n        margin-left: 25px;\r\n    }\r\n    .friendblock{\r\n        width: 100px;\r\n        height: 100px;\r\n    }\r\n}", ""]);

// exports


/***/ }),

/***/ 607:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".LoadMoreFix{\r\n    display: block !important;\r\n    margin: 0 auto;\r\n}\r\n.WFixMes{\r\n    width: 99% !important;\r\n}\r\n.ColorFixMes{\r\ncolor:#75d125 !important;\r\n    border-color: rgb(40, 164, 201) !important;\r\n    cursor:pointer;\r\n\r\n}\r\n.ColorFixMes1{\r\n    color: #d14449 !important;\r\n    border-color: rgb(40, 164, 201) !important;\r\n    cursor:pointer;\r\n}\r\n.searchresultuserpic{\r\n    background-position: center;\r\n    border-radius: 50%;\r\n    background-size: auto 100%;\r\n    box-shadow: 0 0 5px 2px rgba(75, 185, 220, 0.9);\r\n    position: relative;\r\n    z-index: 1;\r\n    height: 30px;\r\n    width: 30px;\r\n    margin: 0 6% 0 2%;\r\n}\r\n.UnreadedMessageBox{\r\n    animation: animate 3.5s linear infinite;\r\n}\r\n.timesFix{\r\n    left: 7px !important;\r\n}\r\n@keyframes animate {\r\n    0%{\r\n        color: #484848;\r\n        box-shadow: 0 0 7px  rgba(75, 185, 220, 0.9), 0 0 20px #9b55ff;\r\n        text-shadow: none;\r\n    }\r\n    90%{\r\n        color: #484848;\r\n        box-shadow: 0 0 7px #9b55ff, 0 0 20px #ff8040;\r\n        text-shadow: none;\r\n    }\r\n    100%{\r\n        color: #fff900;\r\n        box-shadow: 0 0 7px #ff8040, 0 0 20px #ffe71e;\r\n    }\r\n}", ""]);

// exports


/***/ }),

/***/ 608:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section, main {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nol, ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}", ""]);

// exports


/***/ }),

/***/ 609:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, "\n/* -------------------------------- \n\nPrimary style\n\n-------------------------------- */\n*, *::after, *::before {\n  box-sizing: border-box;\n}\n\nhtml {\n  font-size: 62.5%;\n}\n\n.body {\n  font-size: 1.6rem;\n  font-family: \"Roboto\", sans-serif;\n  color: #ffffff;\n  background-color: #303030;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\na {\n  color: #d25555;\n  text-decoration: none;\n}\n\n/* -------------------------------- \n\nSlideshow \n\n-------------------------------- */\n.cd-slideshow-wrapper {\n  overflow: hidden;\n}\n@media only screen and (min-width: 1100px) {\n  .cd-slideshow-wrapper {\n    height: 100vh;\n  }\n}\n\n.cd-slideshow {\n  position: relative;\n}\n.cd-slideshow::before {\n  /* never visible - this is used in jQuery to check the current MQ */\n  content: 'mobile';\n  display: none;\n}\n.cd-slideshow .sub-slides {\n  width: 100%;\n  /* Force Hardware acceleration */\n  -webkit-transform: translateZ(0);\n  -moz-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  -o-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-transition: -webkit-transform 0.3s;\n  -moz-transition: -moz-transform 0.3s;\n  transition: transform 0.3s;\n}\n.cd-slideshow .sub-slides::after {\n  clear: both;\n  content: \"\";\n  display: table;\n}\n.cd-slideshow > li, .cd-slideshow .sub-slides > li {\n  position: relative;\n  z-index: 1;\n  height: 100vh;\n  width: 100vw;\n}\n.cd-slideshow > li::after, .cd-slideshow .sub-slides > li::after {\n  clear: both;\n  content: \"\";\n  display: table;\n}\n.cd-slideshow .sub-slides > li {\n  float: left;\n}\n.cd-slideshow .slider-dots {\n  /*\n  \tdots visible on mobile when a slide has sub-slides\n  \tyou won't see this element in the html - created using jQuery\n  */\n  cursor:pointer;\n  z-index: 3;\n  bottom: 20px;\n  margin-top:50px;\n  text-align: center;\n}\n.cd-slideshow .slider-dots li {\n  display: inline-block;\n  height: 10px;\n  width: 10px;\n  margin-right: 5px;\n  border-radius: 50%;\n  background-color: white;\n  -webkit-transition: background-color 0.3s;\n  -moz-transition: background-color 0.3s;\n  transition: background-color 0.3s;\n}\n.cd-slideshow .slider-dots li.active {\n  background-color: #d60aff;\n}\n.cd-slideshow .slider-dots li:last-of-type {\n  margin-right: 0;\n}\n.cd-slideshow.remove-transitions {\n  /*\n  \tremove transition on transforms\n  \tused to switch form a slide to another from the main navigation\n  */\n  -webkit-transition: -webkit-transform 0s;\n  -moz-transition: -moz-transform 0s;\n  transition: transform 0s;\n}\n.cd-slideshow.remove-transitions .sub-slides {\n  -webkit-transition: -webkit-transform 0s;\n  -moz-transition: -moz-transform 0s;\n  transition: transform 0s;\n}\n@media only screen and (min-width: 1100px) {\n  .cd-slideshow {\n    /* Force Hardware acceleration */\n    -webkit-transform: translateZ(0);\n    -moz-transform: translateZ(0);\n    -ms-transform: translateZ(0);\n    -o-transform: translateZ(0);\n    transform: translateZ(0);\n    -webkit-transition: -webkit-transform 0.6s;\n    -moz-transition: -moz-transform 0.6s;\n    transition: transform 0.6s;\n  }\n  .cd-slideshow::before {\n    /* never visible - this is used in jQuery to check the current MQ */\n    content: 'desktop';\n  }\n  .cd-slideshow .sub-slides {\n    -webkit-transition-duration: 0.6s;\n    -moz-transition-duration: 0.6s;\n    transition-duration: 0.6s;\n  }\n  .cd-slideshow > li, .cd-slideshow .sub-slides > li {\n    height: auto;\n    width: auto;\n  }\n\n}\n\n/* --------------------------------\n\nSlide Content\n\n-------------------------------- */\n.cd-slider-content {\n  position: relative;\n  height: 100vh;\n  width: 100vw;\n  float: left;\n  display: table;\n}\n.cd-slider-content .content-wrapper {\n  display: table-cell;\n  padding-top: 50px;\n  text-align: center;\n  background-color: #d25555;\n}\n.cd-slideshow > li:nth-of-type(1) .cd-slider-content .content-wrapper {\n  background: #000000;\n}\n.cd-slideshow > li:nth-of-type(2) .cd-slider-content .content-wrapper {\n  background: #2b3158;\n}\n.cd-slideshow > li:nth-of-type(3) .cd-slider-content .content-wrapper {\n  background: #56b456;\n}\n.cd-slideshow > li:nth-of-type(4) .cd-slider-content .content-wrapper {\n  background: #52bccf;\n}\n.cd-slideshow > li:nth-of-type(5) .cd-slider-content .content-wrapper {\n  background: #df8a2f;\n}\n.cd-slideshow > li:nth-of-type(6) .cd-slider-content .content-wrapper {\n  background: #c14fce;\n}\n.cd-slider-content h2 {\n  font-size: 3rem;\n  color: #ffffff;\n}\n\n@media only screen and (min-width: 1100px) {\n  .cd-slider-content {\n    height: 98vh;\n    width: 90vw;\n    margin: 1vh 2vw;\n    border-radius: 10px;\n    cursor: pointer;\n  }\n  .visible .sub-visible .cd-slider-content, .visible > .cd-slider-content {\n    /* visible slide */\n    cursor: auto;\n  }\n  .cd-slideshow > li:first-of-type .cd-slider-content {\n\n  }\n  .sub-slides > li:first-of-type .cd-slider-content {\n    margin-left: 5vw;\n  }\n  .sub-slides > li .cd-slider-content {\n    margin-left: 1.25vw;\n    margin-right: 1.25vw;\n  }\n  .cd-slider-content .content-wrapper {\n    height: 100%;\n    /* hide the slide content if the slide is not selected/visible */\n    opacity: 0;\n    box-shadow: 0 6px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);\n    border-radius: inherit;\n    -webkit-transition: opacity 0.6s;\n    -moz-transition: opacity 0.6s;\n    transition: opacity 0.6s;\n  }\n  .cd-slider-content::after {\n    /* this is used to change the slide background color when the slide is out of focus */\n    content: '';\n    position: absolute;\n    z-index: 3;\n    top: 0;\n    left: 0;\n    height: 100%;\n    width: 100%;\n    border-radius: inherit;\n    background-color: #3a3a3a;\n    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);\n    opacity: 1;\n    visibility: visible;\n    -webkit-transition: opacity 0.6s, visibility 0.6s;\n    -moz-transition: opacity 0.6s, visibility 0.6s;\n    transition: opacity 0.6s, visibility 0.6s;\n  }\n  .visible .cd-slider-content .content-wrapper {\n    opacity: 1;\n  }\n  .visible .cd-slider-content::after {\n    opacity: 0;\n    visibility: hidden;\n  }\n  .cd-slider-content h2 {\n    font-size: 4rem;\n    font-weight: 300;\n  }\n  .cd-slider-content p {\n    font-weight: bold;\n  }\n}\n\n/* --------------------------------\n\nSlideshow Navigation\n\n-------------------------------- */\n.cd-slideshow-nav {\n  position: fixed;\n  z-index: 2;\n  top: 0;\n  left: 0;\n}\n.cd-slideshow-nav .cd-nav-items {\n  position: fixed;\n  z-index: 1;\n  height: 100vh;\n  width: 100%;\n  overflow: hidden;\n  top: 0;\n  left: 0;\n  background-color: #171717;\n  -webkit-transform: translateX(-100%);\n  -moz-transform: translateX(-100%);\n  -ms-transform: translateX(-100%);\n  -o-transform: translateX(-100%);\n  transform: translateX(-100%);\n  -webkit-transition: -webkit-transform 0.3s;\n  -moz-transition: -moz-transform 0.3s;\n  transition: transform 0.3s;\n}\n.cd-slideshow-nav .cd-nav-items > ol {\n  height: 100%;\n  overflow: auto;\n  padding: 80px 20px 80px 30px;\n}\n.cd-slideshow-nav ol ol {\n  padding-left: 1em;\n}\n.cd-slideshow-nav a {\n  color: #ffffff;\n  display: inline-block;\n  margin-bottom: .8em;\n}\n.cd-slideshow-nav a:before {\n  /* list bullets */\n  position: relative;\n  content: '';\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  background: #6e6e6e;\n  border-radius: 50%;\n  margin-right: .4em;\n  -webkit-transform: translateY(-2px);\n  -moz-transform: translateY(-2px);\n  -ms-transform: translateY(-2px);\n  -o-transform: translateY(-2px);\n  transform: translateY(-2px);\n}\n.cd-slideshow-nav.nav-open .cd-nav-items {\n  -webkit-transform: translateX(0);\n  -moz-transform: translateX(0);\n  -ms-transform: translateX(0);\n  -o-transform: translateX(0);\n  transform: translateX(0);\n}\n.cd-slideshow-nav.nav-open .cd-nav-items > ol {\n  -webkit-overflow-scrolling: touch;\n}\n@media only screen and (min-width: 1100px) {\n  .cd-slideshow-nav .cd-nav-items > ol {\n    padding: 14vh 6vw;\n  }\n  .cd-slideshow-nav ol ol {\n    padding-left: 3em;\n  }\n  .cd-slideshow-nav a {\n    font-weight: bold;\n    color: #595959;\n    font-size: 4rem;\n    -webkit-transition: all 0.2s;\n    -moz-transition: all 0.2s;\n    transition: all 0.2s;\n  }\n  .cd-slideshow-nav a:before {\n    /* list bullets */\n    width: 24px;\n    height: 24px;\n    -webkit-transform: translateY(-2px);\n    -moz-transform: translateY(-2px);\n    -ms-transform: translateY(-2px);\n    -o-transform: translateY(-2px);\n    transform: translateY(-2px);\n    -webkit-transition: all 0.2s;\n    -moz-transition: all 0.2s;\n    transition: all 0.2s;\n  }\n  .no-touch .cd-slideshow-nav a:hover {\n    color: #ffffff;\n  }\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(1) a:hover::before,\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(1) li a:hover::before {\n    background: #d25555;\n  }\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(2) a:hover::before,\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(2) li a:hover::before {\n    background: #2b3158;\n  }\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(3) a:hover::before,\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(3) li a:hover::before {\n    background: #56b456;\n  }\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(4) a:hover::before,\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(4) li a:hover::before {\n    background: #52bccf;\n  }\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(5) a:hover::before,\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(5) li a:hover::before {\n    background: #df8a2f;\n  }\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(6) a:hover::before,\n  .cd-slideshow-nav .cd-nav-items > ol > li:nth-of-type(6) li a:hover::before {\n    background: #c14fce;\n  }\n}\n\n.cd-nav-trigger {\n  position: absolute;\n  z-index: 2;\n  top: 20px;\n  left: 20px;\n  height: 40px;\n  width: 40px;\n  cursor: pointer;\n  border-radius: 50%;\n  border: none;\n  outline: none;\n  background-color: rgba(0, 0, 0, 0.8);\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);\n  /* replace text with image */\n  overflow: hidden;\n  text-indent: 100%;\n  white-space: nowrap;\n  color: transparent;\n}\n.cd-nav-trigger span, .cd-nav-trigger span::after, .cd-nav-trigger span::before {\n  /* used to create the menu icon */\n  position: absolute;\n  height: 2px;\n  width: 18px;\n  background-color: #ffffff;\n}\n.cd-nav-trigger span {\n  /* menu icon middle line */\n  left: 50%;\n  top: 50%;\n  bottom: auto;\n  right: auto;\n  -webkit-transform: translateX(-50%) translateY(-50%);\n  -moz-transform: translateX(-50%) translateY(-50%);\n  -ms-transform: translateX(-50%) translateY(-50%);\n  -o-transform: translateX(-50%) translateY(-50%);\n  transform: translateX(-50%) translateY(-50%);\n  -webkit-transition: background-color 0.3s;\n  -moz-transition: background-color 0.3s;\n  transition: background-color 0.3s;\n}\n.cd-nav-trigger span::after, .cd-nav-trigger span::before {\n  content: '';\n  left: 0;\n  -webkit-transition: -webkit-transform 0.3s;\n  -moz-transition: -moz-transform 0.3s;\n  transition: transform 0.3s;\n}\n.cd-nav-trigger span::before {\n  /* menu icon middle top line */\n  -webkit-transform: translateY(-6px);\n  -moz-transform: translateY(-6px);\n  -ms-transform: translateY(-6px);\n  -o-transform: translateY(-6px);\n  transform: translateY(-6px);\n}\n.cd-nav-trigger span::after {\n  /* menu icon middle bottom line */\n  -webkit-transform: translateY(6px);\n  -moz-transform: translateY(6px);\n  -ms-transform: translateY(6px);\n  -o-transform: translateY(6px);\n  transform: translateY(6px);\n}\n.nav-open .cd-nav-trigger span {\n  background-color: transparent;\n}\n.nav-open .cd-nav-trigger span::before {\n  -webkit-transform: rotate(45deg);\n  -moz-transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  -o-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n.nav-open .cd-nav-trigger span::after {\n  -webkit-transform: rotate(-45deg);\n  -moz-transform: rotate(-45deg);\n  -ms-transform: rotate(-45deg);\n  -o-transform: rotate(-45deg);\n  transform: rotate(-45deg);\n}\n@media only screen and (min-width: 1100px) {\n  .cd-nav-trigger {\n    height: 48px;\n    width: 48px;\n    left: calc(2.5vw - 24px);\n    top: calc(4vh - 24px);\n  }\n}\n\n/* --------------------------------\n\nno-js\n\n-------------------------------- */\n.no-js .cd-slideshow-wrapper {\n  overflow: visible;\n  height: auto;\n}\n\n.no-js .cd-slideshow > li,\n.no-js .cd-slideshow .sub-slides > li {\n  height: auto;\n  width: 100vw;\n  margin: 0;\n}\n\n.no-js .cd-slider-content {\n  margin: 0;\n  height: 100vh;\n  width: 100%;\n  border-radius: 0;\n}\n\n.no-js .cd-slideshow > li:first-of-type .cd-slider-content,\n.no-js .sub-slides > li:first-of-type .cd-slider-content,\n.no-js .sub-slides > li .cd-slider-content {\n  margin: 0;\n}\n\n.no-js .cd-slider-content .content-wrapper {\n  opacity: 1;\n  box-shadow: none;\n}\n\n.no-js .cd-slider-content::after {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.no-js .cd-nav-trigger {\n  display: none;\n}\n\n.no-js .cd-slideshow-nav {\n  position: static;\n}\n\n.no-js #icon-keyboard {\n  display: none;\n}\n\n.no-js .cd-slideshow-nav .cd-nav-items {\n  position: static;\n  -webkit-transform: translateX(0);\n  -moz-transform: translateX(0);\n  -ms-transform: translateX(0);\n  -o-transform: translateX(0);\n  transform: translateX(0);\n}\n\n.no-js .cd-slideshow-nav .cd-nav-items {\n  height: auto;\n}\n\n.no-js .sub-nav {\n  display: none;\n}\n\n\n.krug {\n  position: relative;\n  z-index: 0;\n  border-width: 4.542px;\n  border-color: rgb(51, 50, 50);\n  border-style: solid;\n  border-radius: 50%;\n  margin: 0 auto;\n  width: 20vw;\n  height:20vw;\n}\n\n.a2ndBcgKrug{\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  border-radius: 50%;\n  opacity: .4;\n  z-index: 49;\n  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)\n}\n.nextSlideButton{\n  position: absolute;\n\n  bottom: 50px;\n  left:0;\n  right:0;\n  cursor:pointer;\n}\n.slideshowbuttons{          position: absolute;\n\n  bottom: 30px;\n  left:0;\n  right:0;\n}\n.nextSlideButton button {\n  transition:  0.8s 0.1s ease;\n  cursor: pointer;\n  height: 50px;\n  width: 150px;\n  border-radius: 10px;\n\n  color: #6496c8;\n  background: rgba(0,0,0,0);\n  border: solid 5px #6496c8;\n}\n.nextSlideButton button:hover,\n.nextSlideButton button.hover {\n  border-color: #346392;\n  color: #346392;\n  background-color:#fcf9f9;\n}\n.nextSlideButton button:active,\n.nextSlideButton button.active {\n  border-color: #27496d;\n  color: #27496d;\n}\n\n\n@keyframes animStar\n{from\n{transform: translateY(0px)}\n  to\t\t{\n    transform: translateY(200px)}\n}\n\n\n.logobykwi {\n  position: absolute;\n  z-index: 50;\n  font-size: 13vw;\n  font-family: \"Microsoft-Yi-Baiti\";\n  color: rgb(192, 192, 192);\n  line-height: 1.3;\n  margin-left: auto;\n  margin-right: auto;\n  left: 0;\n  right: 0;\n\n\n  animation: logobykwianim 12s infinite;\n}\n@keyframes logobykwianim {\n  0%   {text-shadow: 0 0 90px #0f4bc5,-1px -1px 0px rgba(255,255,255,0.3), 1px 1px 0px rgba(0,0,0,0.8);}\n  25% {text-shadow: 0 0 90px #2516c5,-1px -1px 0px rgba(255,255,255,0.3), 1px 1px 0px rgba(0,0,0,0.8);}\n  50% {text-shadow: 0 0 90px #921ac5,-1px -1px 0px rgba(232, 168, 255, 0.61), 1px 1px 0px rgba(0,0,0,0.8);}\n  75% {text-shadow: 0 0 90px #2516c5,-1px -1px 0px rgba(255,255,255,0.3), 1px 1px 0px rgba(0,0,0,0.8);}\n  100%   {text-shadow: 0 0 90px #0f4bc5,-1px -1px 0px rgba(255,255,255,0.3), 1px 1px 0px rgba(0,0,0,0.8);}\n}\n.leftSignsHello   {\n\n  animation-name: allleftsighns;\n  animation-duration: 4s;\n  min-width:182px;\n}\n.rightSignsFriend{\n\n  animation-name: allrightsighns;\n  animation-duration: 4s;\n  min-width:182px;\n}\n.signsObsh{\n  display: inline-flex;\n}\n.entroduce{\n  opacity:0;\n  padding-top: 50px;\n  font-size: 2.5vw;\n  font-family: \"Arial\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  z-index: 12;\n  animation-name: showentrod;\n  animation-duration: 2s;\n  animation-delay: 4s;\n  animation-fill-mode:forwards;\n}\n.hello_ru{\n\n  font-size: 2.5vw;\n  font-family: \"Century Gothic\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  z-index: 5;\n  margin-top: 50px;\n  opacity:.6;\n  animation-name: showtext;\n\n\n  animation-duration: 3s;\n\n}\n.signs_p{\n\n  padding-top:30px;\n}\n.privetDrug{\n\n  width: 100%;\n}\n.hello_eng{\n  opacity:0;\n  font-size: 1.5vw;\n  font-family: \"Century Gothic\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  text-align: right;\n  -moz-transform: matrix( 0.94801473667477,0.31822642732412,-0.31822642732412,0.94801473667477,0,0);\n  -webkit-transform: matrix( 0.94801473667477,0.31822642732412,-0.31822642732412,0.94801473667477,0,0);\n  -ms-transform: matrix( 0.94801473667477,0.31822642732412,-0.31822642732412,0.94801473667477,0,0);\n  animation-name: showtextEngHe;\n  animation-duration: 2s;\n  animation-delay: 3s;\n  animation-fill-mode:forwards;\n\n}\n.hello_chi{\n  opacity:0;\n  font-size: 1.5vw;\n  font-family: \"MS Gothic\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  text-align: right;\n  animation-name: showtextchihe;\n  animation-duration: 2s;\n  animation-fill-mode:forwards;\n  animation-delay: 4s;\n}\n.hello_ger{\n  opacity:0;\n  font-size: 1.5vw;\n  font-family: \"MS Gothic\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  text-align: right;\n  -moz-transform: matrix( 0.97265566680441,-0.23225191890114,0.23225191890114,0.97265566680441,0,0);\n  -webkit-transform: matrix( 0.97265566680441,-0.23225191890114,0.23225191890114,0.97265566680441,0,0);\n  -ms-transform: matrix( 0.97265566680441,-0.23225191890114,0.23225191890114,0.97265566680441,0,0);\n  animation-name: showtextgerhe;\n  animation-duration: 2s;\n  animation-fill-mode:forwards;\n  animation-delay: 3.25s;\n  z-index: 10;\n}\n.friend_eng{\n  opacity:0;\n  font-size: 1.5vw;\n  font-family: \"Century Gothic\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  text-align: left;\n  -moz-transform: matrix( 0.94898969619256,0.3153070828896,-0.31530708288961,0.94898969619256,0,0);\n  -webkit-transform: matrix( 0.94898969619256,0.3153070828896,-0.31530708288961,0.94898969619256,0,0);\n  -ms-transform: matrix( 0.94898969619256,0.3153070828896,-0.31530708288961,0.94898969619256,0,0);\n  animation-name: showtextEngFR;\n  animation-duration: 2s;\n  animation-delay: 3.75s;\n  animation-fill-mode:forwards;\n  z-index: 7;\n}\n.friend_chi{\n  opacity:0;\n  font-size: 1.5vw;\n  font-family: \"MS Gothic\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  text-align: left;\n  animation-name: showtextchir;\n  animation-duration: 2s;\n  animation-delay: 4.25s;\n  animation-fill-mode:forwards;\n  z-index: 9;\n}\n.friend_ger{\n  opacity:0;\n  font-size: 1.5vw;\n  font-family: \"MS Gothic\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  text-align: left;\n  -moz-transform: matrix( 0.95914169566044,-0.28292615228292,0.28292615228292,0.95914169566044,0,0);\n  -webkit-transform: matrix( 0.95914169566044,-0.28292615228292,0.28292615228292,0.95914169566044,0,0);\n  -ms-transform: matrix( 0.95914169566044,-0.28292615228292,0.28292615228292,0.95914169566044,0,0);\n  animation-name: showtextgerr;\n  animation-duration: 2s;\n  animation-delay: 4.5s;\n  animation-fill-mode:forwards;\n  z-index: 11;\n}\n/* @keyframes allleftsighns { */\n/* 0%   { opacity:0;margin-right: 90px; } */\n/* 16.666%  {} */\n/* 33.333%  {} */\n/* 49.998% {} */\n/* 66.666% {} */\n/* 83.666% {} */\n/* 100% {opacity:1} */\n/* } */\n/* @keyframes allrightsighns { */\n/* 0%   { opacity:0;margin-left: 90px; } */\n/* 16.666%  {} */\n/* 33.333%  {} */\n/* 49.998% {} */\n/* 66.666% {} */\n/* 83.666% {} */\n/* 100% {opacity:1} */\n/* }  */\n@keyframes showtext {\n  0%   { opacity:0;\t\tmargin-top: 30px;font-size:2vw}\n  100% {opacity:.6;}\n}\n@keyframes showtextEngHe {\n  0%   { \topacity:0;margin-right: 30px;\t}\n  100% {opacity:.6;}\n}\n@keyframes showentrod {\n  0%   { \topacity:0;\t}\n  100% {opacity:.6;}\n}\n@keyframes showtextEngFR {\n  0%   { \topacity:0;margin-left: 30px;\t}\n  100% {opacity:.6;}\n}\n@keyframes showtextchihe {\n  0%   { \topacity:0;margin-right: 30px;\t}\n  100% {opacity:.6;}\n}\n@keyframes showtextchir {\n  0%   { \topacity:0;margin-left: 30px;\t}\n  100% {opacity:.6;}\n}\n@keyframes showtextgerhe {\n  0%   { \topacity:0;margin-right: 30px;\t}\n  100% {opacity:.6;}\n}\n@keyframes showtextgerr {\n  0%   { \topacity:0;margin-left: 30px;\t}\n  100% {opacity:.6;}\n}\n.SecondSlidePresentasionText{\n  width: 100%;\n  margin: 0 auto;\n  display: flex;\n  padding-top: 30px;\n  justify-content: center;\n  align-items: center;\n}\n\n.SecondSlidePresentasionText1{\n  width: 600px;\n  padding-left: 20px;\n  font-size: 1.2vw;\n  font-family: \"Arial\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  text-align: left;\n  z-index: 11;\n\n}\n\n.zagolovokPresentSlide{\n  font-size: 2.5vw;\n  font-family: \"Century Gothic\";\n  color: rgb(192, 192, 192);\n  line-height: 1.2;\n  z-index: 5;\n  margin-top: 20px;\n  opacity:.6;\n}\n\n@media only screen and (max-width: 1024px) {\n  .nextSlideButton{display:none;}\n  .closepresentation{display: block;}\n}\n@media only screen and (max-width: 760px) {\n  .nextSlideButton{display:none;}\n  .closepresentation{display: block}\n  .leftSignsHello{\n    min-width: 90px;\n  }\n  .fa-3x{\n    font-size: 2em;\n  }\n\n  .zagolovokPresentSlide{    font-size: 10vw;}\n  .SecondSlidePresentasionText1{    font-size: 4vw;;width: 100%}\n  .fafixpadding{padding-left: 10px}\n  .rightSignsFriend{min-width: 90px;}\n\n  .logobykwi{\n    font-size: 30vw;\n  }\n  .krug {\n\n    width: 50vw;\n    height:50vw;\n  }\n  .signs_p{\n    font-size: 6vw;\n  }\n  .entroduce{ font-size: 7vw; }\n  .smallbuk_int{\n    font-size: 4vw;\n  }\n  .SecondSlidePresentasionText_fix{padding-left: 15px;}\n  .SecondSlidePresentasionText_fix2{padding-right: 10px;padding-left: 10px;margin-bottom: 70px;}\n  .privetDrug{    margin-top: -15px;}\n  .rightSignsFriend{    padding-left: 10px;}\n\n}\n@media only screen and (max-width: 320px) {\n  .krug {\n    width: 150.916px;\n    height: 150.916px;\n    border-width: 4px;\n    margin-top: -50px;\n  }\n\n\n}\n", ""]);

// exports


/***/ }),

/***/ 610:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".contentSearchPage{\r\n    width: 70%;\r\n    margin: 50px  auto 0 auto;\r\n    flex:1;\r\n}\r\n.allfilters {\r\n\r\n    height: 420px;\r\n    padding: 1% 0;\r\n    background-color: rgb(24, 23, 23);\r\n\r\n}\r\n\r\n.EventsLabelSP {\r\n    text-align: center;\r\n    font-size: 24px;\r\n    font-family: \"Arial\";\r\n    color: rgb(40, 164, 201);\r\n    font-weight: bold;\r\n    margin-bottom: 15px;\r\n    line-height: 1.2;\r\n}\r\n.mapfilter {\r\n    position: relative;\r\n    margin: 0 auto;\r\n    height: 80%;\r\n    width: 70%;\r\n    border-radius: 20px;\r\n    box-shadow: 0 0 14px 8px rgba(75, 185, 220, 0.9);\r\n}\r\n.mapfilter #map{\r\n    width: 100%;\r\n    height: 100%;\r\n    padding: 0;\r\n    margin: 0;\r\n\r\n}\r\n.ymaps-2-1-60-map  {\r\n    border-radius: 20px !important;\r\n}\r\n.ymaps-2-1-60-map-bg-ru{border-radius: 20px !important;}\r\n.ymaps-2-1-60-inner-panes{border-radius: 20px !important;}\r\n.FiltersAndSearchOpen{\r\n    height:50px;\r\n    width:200px;\r\n    background-color: rgb(24, 23, 23);\r\n    position: absolute;\r\n    right: 0px;\r\n    bottom: 0px;\r\n    border-top-left-radius: 10px;\r\n    padding: 10px;\r\n    border-bottom-right-radius: 20px;\r\n    cursor:pointer;\r\n    transition: 1s;\r\n}\r\n.FiltersAndSearchOpenText{\r\n    cursor:pointer;\r\n    font-size: 15px;\r\n    font-family: \"Arial\";\r\n    color: rgb(70, 203, 41);\r\n\r\n}\r\n.svg-inline--fa.fa-border {\r\n    height: 1.5em;\r\n}\r\n.svg-inline--fa.fa-w-16 {\r\n    width: 1.5em;\r\n}\r\n.svg-inline--fa.fa-lg {\r\n    vertical-align: -0.525em;\r\n}\r\n.CloseLabel{\r\n    vertical-align: -0.375em;\r\n    display: inline-block;\r\n}\r\n.filters {\r\n    padding:0 1% 1% 1%;\r\n}\r\n.filters>div{\r\n    margin-bottom: 12px;\r\n}\r\n.filters button{\r\n    font-size: 14px;\r\n}\r\n\r\n.searcheventresult{\r\n    padding-top: 30px;\r\n    background-color: #3c3434;\r\n    padding-bottom: 5px;\r\n}\r\n.eventinresult{\r\n    color: black;\r\n    height:140px;\r\n    border-radius: 2px;\r\n    display: flex;\r\n    margin: 1.3% 10px;\r\n    box-shadow: 0 0 3px 3px rgba(75, 185, 220, 0.9);\r\n    background-color: rgb(24, 23, 23);\r\n\r\n}\r\n.eventimg{\r\n    width: 30%;\r\n    background-size: 100% auto;\r\n}\r\n.eventdescbysearch{\r\n    width: 70%;\r\n    padding: 1%;\r\n    font-size: 14pt;\r\n}\r\n.flexcont{\r\n    display: flex;\r\n    justify-content: space-around;\r\n\r\n}\r\n.eventright{\r\n    width: 50%;\r\n    display: flex;\r\n    flex-direction: column;\r\n\r\n}\r\n.eventrightCreator{\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(224, 237, 221);\r\n    line-height: 2.2;\r\n    text-align: left;\r\n\r\n}\r\n.eventleft{\r\n    width: 100%;\r\n    position:relative;\r\n}\r\n.formcaption1{\r\n    float:right;\r\n}\r\n.lubaya{\r\n    font-weight: bold;\r\n}\r\n.EventGreenText{\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(70, 203, 41);\r\n    font-weight: bold;\r\n    position: absolute;\r\n}\r\n.GreenT{\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(70, 203, 41);\r\n}\r\n.EventGreenTextDate{\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(224, 237, 221);\r\n    line-height: 1.2;\r\n    text-align: left;\r\n    position: absolute;\r\n    bottom: -27px;\r\n}\r\n.EventGreenTextPar{\r\n    bottom: -50px;\r\n    position: absolute;\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(224, 237, 221);\r\n    line-height: 1.2;\r\n    text-align: left;\r\n}\r\n@media screen and (max-width: 768px) {\r\n    .eventrightCreator{\r\n        line-height: 1.2;\r\n    }\r\n    .contentSearchPage{\r\n        width: 100%;\r\n        margin: 50px  auto 0 auto;\r\n        flex:1;\r\n    }\r\n}", ""]);

// exports


/***/ }),

/***/ 611:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".topprofile {\r\n    margin: 0 auto;\r\n    display:flex;\r\n    padding: 15px;\r\n    background-repeat: no-repeat;/* фон не повторяется */\r\n    background-size: cover; /* фоновая картинка на весь экран */\r\n    background-color: rgba(9, 8, 8, 0.82);\r\n    margin-top: 0%;\r\n    background-attachment: fixed;\r\n    background-position: center;\r\n\r\n}\r\n\r\n.DisplayUserName {\r\n    font-size: 24px;\r\n    font-family: \"Arial\";\r\n    color: rgb(243, 232, 232);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n\r\n}\r\n.DisplayUserPhotoFix>img{\r\n\r\n    height: 150px;\r\n    width: 150px;\r\n    background-position: center;\r\n    border-radius: 50%; /* Превращаем в круг */\r\n    background-size: auto 100%; /* Высота фотографии равна высоте элемента */\r\n    box-shadow: 0 0 14px 8px rgba(75, 185, 220, 0.9);\r\n    position:relative;\r\n    z-index: 1;\r\n    opacity: 0;\r\n}\r\n.DisplayUserPhotoFix{\r\n    height: 150px;\r\n    width: 150px;\r\n    background-position: center;\r\n    border-radius: 50%; /* Превращаем в круг */\r\n    background-size: auto 100%; /* Высота фотографии равна высоте элемента */\r\n    box-shadow: 0 0 14px 8px rgba(75, 185, 220, 0.9);\r\n    position:relative;\r\n    z-index: 1;\r\n}\r\n.DisplayUserPhoto{\r\n    margin-top: 25px;\r\n}\r\n.ProfileAuthorizitedInProfileAvatarBlockLevel{\r\n    font-family: \"Arial\";\r\n    color:lawngreen;\r\n    font-size: 24px;\r\n    font-weight: bold;\r\n    width: 55px;\r\n    margin-top: -30px;\r\n    margin-left: 80px;\r\n    height: 31px;\r\n    position:relative;\r\n    z-index: 2;\r\n    border-width: 3.79px;\r\n    border-color: rgb(192, 192, 192);\r\n    border-style: solid;\r\n    border-radius: 20px;\r\n    background-color: rgb(9, 8, 8);\r\n    box-shadow: 0px 4px 0px 0px rgba(16, 15, 15, 0.004);\r\n\r\n\r\n\r\n}\r\n.ProfileAuthorizitedInProfileAvatarBlockLevelLabel{\r\n\r\n\r\n    font-family: \"Arial\";\r\n    color: rgb(243, 232, 232);\r\n    font-weight: bold;\r\n    margin-left: 67px;\r\n    position: relative;\r\n    z-index: 2;\r\n    font-size: 12px;\r\n\r\n}\r\n.aboutbtn{\r\n    margin:10px 0;\r\n    cursor:pointer;\r\n    font-size: 24px;\r\n    font-family: \"Arial\";\r\n    color: rgb(117, 209, 37);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n\r\n}\r\n.usrdesc{\r\n    margin-bottom: 2%;\r\n    width: 100%;\r\n    word-wrap: break-word;\r\n}\r\n.ButtonMod{\r\n    border-width: 3.15px;\r\n    border-color: rgb(40, 164, 201);\r\n    border-style: solid;\r\n    border-radius: 50%;\r\n    background-color: rgb(60, 52, 52);\r\n    color:lightgreen;\r\n    height: 25px !important;\r\n    width: 25px !important;\r\n    font-size: 20px;\r\n}\r\n.DisplayUserCity{\r\n    font-size: 24px;\r\n    font-family: \"Arial\";\r\n    color: rgb(255, 255, 0);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n\r\n}\r\n.profiletoptext{\r\n    display: flex;\r\n    justify-content: center;\r\n    align-content: space-between;\r\n    align-items: center;\r\n    flex-direction: column;\r\n    text-align: center;\r\n    width: 40%;\r\n}\r\n\r\n.profileleftContent{\r\n    display: flex;\r\n    /*justify-content: center;*/\r\n    align-content: space-between;\r\n    align-items: center;\r\n    flex-direction: column;\r\n    text-align: center;\r\n    margin-left: 4%;\r\n    width: 26%;\r\n}\r\n.regestrationDate{\r\n    margin-top: 10px;\r\n}\r\n.EditProfileButton{\r\n    font-size: 14px;\r\n    font-family: \"Arial\";\r\n    color: rgb(245, 245, 237);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n\r\n\r\n}\r\n.ButtonModEdit{\r\n    border-width: 3.15px;\r\n    border-color: rgb(40, 164, 201);\r\n    border-style: solid;\r\n    border-radius: 50%;\r\n\r\n    height: 30px !important;\r\n    width: 30px !important;\r\n    font-size: 60px;\r\n}\r\n.addFriendButtoN {\r\n    height: 40px;\r\n    font-size: 1.5em;\r\n    border-width: 4.43px;\r\n    border-color: rgb(40, 164, 201);\r\n    border-style: solid;\r\n    background-color: #75d125;\r\n    width: 215px;\r\n    border-radius: 25px;\r\n    display: inline-block;\r\n    cursor: pointer;\r\n}\r\n\r\n.addFriendButtoN>div{\r\n    position: relative;\r\n    display: inline-block;\r\n    top: -11px;\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(255, 255, 255);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n\r\n}\r\n.AddFriendICon{\r\n\r\n    border-radius: 50%;\r\n    height: 40px !important;\r\n    width: 40px !important;\r\n    border-width: 3.15px;\r\n    border-style: solid;\r\n    border-color: #28a4c9;\r\n    align-self: center;\r\n    position: relative;\r\n    color:#75d125;\r\n    background-color: #3c3434;\r\n    justify-content: center;\r\n    transition: 0.5s;\r\n    display: inline-block;\r\n    margin-left: -5px;\r\n    margin-top: -4px;\r\n}\r\n.AddFriendICon:hover{\r\n    color: gray;\r\n}\r\n.AddToFriendButton{\r\n\r\n}\r\n.heightProfZ{\r\n    height: 320px;\r\n}\r\n.contentProfile{\r\n    height: calc(100% - 50px);\r\n    background-color: #3c3434;\r\n}\r\n.OnService{\r\n    font-weight: bold;\r\n    background-color: #3c3434;\r\n    margin: 0 auto;\r\n    font-size: 140%;\r\n    text-align: center;\r\n    margin-top: 50px;\r\n    font-family: \"Arial\";\r\n    color: rgb(243, 232, 232);\r\n}\r\n@media screen and (max-width: 768px) {\r\n    .DisplayUserCity{font-size: 11px;}\r\n    .aboutbtn{font-size: 15px;}\r\n    .ButtonMod{height: 17px !important;\r\n        width: 17px !important;\r\n        font-size: 14px;}\r\n    .ButtonModEdit{height: 25px !important;\r\n        width: 25px !important;}\r\n    .DisplayUserName{font-size:16px;}\r\n    .addFriendButtoN{width:40px;margin-left: 100%;}\r\n    .addFriendButtoN>div{display: none}\r\n}\r\n\r\n.IconOfMissingAlerts{\r\n    border-width: 1.15px;\r\n    border-color: rgb(40, 164, 201);\r\n    border-style: solid;\r\n    border-radius: 50%;\r\n    background-color: rgb(60, 52, 52);\r\n    color: lightgreen;\r\n    height: 20px !important;\r\n    width: 20px !important;\r\n    font-size: 15px;\r\n    margin-top: -8px;\r\n    margin-left: 7px;\r\n}\r\n.tabs {\r\n    font: 300 100% 'Helvetica Neue', Helvetica, Arial;\r\n    background-color: rgba(9, 8, 8, 0.82);\r\n    width: 100%;\r\n}\r\n\r\n.tabs>ul>li {\r\n    display: inline;\r\n    text-align: center;\r\n}\r\n.tabs>ul>hr{\r\n    border: none;\r\n    transition: .3s ease-in-out;\r\n    border-radius: 10px;\r\n    margin: 0;\r\n    background-color: rgb(117, 209, 37);\r\n}\r\n.tabsssa1 {\r\n    cursor: pointer;\r\n    display: inline-block;\r\n    width: 33%;\r\n    padding: .75rem 0;\r\n    margin: 0;\r\n    text-decoration: none;\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(245, 245, 237);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n    display: inline-flex;\r\n    justify-content: center;\r\n}\r\n.tabsssa2 {\r\n    cursor: pointer;\r\n    display: inline-block;\r\n    width: 50%;\r\n    padding: .75rem 0;\r\n    margin: 0;\r\n    text-decoration: none;\r\n    font-size: 16px;\r\n    font-family: \"Arial\";\r\n    color: rgb(245, 245, 237);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n}\r\n.tabshr1{\r\n    width: 25%;\r\n    margin-left:  4% !important;\r\n}\r\n.tabshr2{\r\n    width: 36%;\r\n    margin-left:  7% !important;\r\n}\r\n\r\n.one:hover ~ hr, .onehr\r\n{\r\n    margin-left: 4%  !important;\r\n}\r\n\r\n.two:hover ~ hr, .twohr {\r\n    margin-left: 37%  !important;\r\n}\r\n\r\n.three:hover ~ hr, .threehr {\r\n    margin-left: 70%  !important;\r\n}\r\n\r\n\r\n.one2:hover ~ hr, .onehr2\r\n{\r\n    margin-left: 7%  !important;\r\n}\r\n\r\n.two2:hover ~ hr, .twohr2 {\r\n    margin-left: 57%  !important;\r\n}\r\n.bottomprofile{\r\n    \r\n}", ""]);

// exports


/***/ }),

/***/ 612:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(25)(undefined);
// imports


// module
exports.push([module.i, ".LogoVneshn {\r\n    padding: 0 20px 0 40px;\r\n    margin-right: 0;\r\n    position: absolute;\r\n    left: 5px;\r\n    text-decoration: none;\r\n        font-size: 18px;\r\n        font-family: \"Arial\";\r\n        color: rgb(120, 235, 27);\r\n\r\n}\r\n.LogoVneshn:hover {\r\n    color: #fff;\r\n    text-decoration: none\r\n}\r\n.LogoVnutN{\r\n    display: inline-flex;\r\n    margin-left: 30px;\r\n    margin-top: 16px;\r\n}\r\n.LogoVnutN:after {\r\n    content: \"NightBrowser.ru\";\r\n}\r\n.LogoVnut {\r\n    padding-top: 3px;\r\n    width: 60px;\r\n    height: 40px;\r\n    position: absolute;\r\n    top: 5px;\r\n    left: 0;\r\n    border-width: 3px;\r\n    border-color: rgb(19, 122, 151);\r\n    border-style: solid;\r\n    border-radius: 20px;\r\n    background-color: rgb(11, 0, 19);\r\n    font-size: 24px;\r\n    font-family: \"Arial\";\r\n    color: rgb(211, 218, 205);\r\n    line-height: 1.2;\r\n}\r\n.fa-caret-down{\r\n    margin-top: 2px;\r\n    transition: 2s;\r\n}\r\n.SearchInputInMenu{\r\n    background-color: rgba(0,0,0,0.1);\r\n    border-radius: 50px;\r\n    color: white;\r\n    padding: 3px;\r\n    height: 34px;\r\n    width: 235px;\r\n    border: 2.5px solid #28a4c9;\r\n}\r\n.SearchPanel {\r\n    position: fixed;\r\n    margin: auto;\r\n    margin-top: 50px;\r\n    left: 0;\r\n    right: 0;\r\n    height: 78%;\r\n    z-index: 150;\r\n    width: 80vw;\r\n    max-width: 800px;\r\n    background-color: rgba(0, 0, 0, 0.95);\r\n}\r\n.searchresultuserpic1{\r\n    display: table-cell;\r\n    background-position: center;\r\n    border-radius: 50%; /* Превращаем в круг */\r\n    background-size: auto 100%; /* Высота фотографии равна высоте элемента */\r\n    width: 100px;\r\n    height: 100px;\r\n}\r\n.Searchres{\r\n    height: 100%;\r\n    overflow: auto;\r\n    margin-top: 10px;\r\n}\r\n.Searcpanel2{\r\n    margin-top: 10px;\r\n}\r\n.FindResultsUserBlockMain{\r\n    border:1px solid whitesmoke;\r\n    width: 300px;\r\n    display: table;\r\n    margin: 0 auto;\r\n}\r\n.FindResultsUserFirstNameMain{\r\n    display: table-cell;\r\n    vertical-align: middle;\r\n}\r\n.CloseSearch{\r\n    font-size: 2.5em;\r\n    cursor: pointer;\r\n    position: absolute;\r\n    right: 0;\r\n    margin-top: -10px;\r\n    color: #c0c0c0;\r\n    margin-top: -40px;\r\n    height: 40px !important;\r\n    width: 40px !important;\r\n    padding-bottom: 8px;\r\n    padding-left: 1px;\r\n    /* font-weight: bold; */\r\n    font-family: Arial;\r\n}\r\n.ShtorkaMobileMenuButton{\r\n    display: block;\r\n    cursor: pointer;\r\n    top:2.5px;\r\n    height: 45px;\r\n    border-radius: 50px;\r\n    width: 150px;\r\n    position: absolute;\r\n    background-color: #28a4c9;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n    left: 0;\r\n    right: 0;\r\n    transition: 1s;\r\n    z-index: 5;\r\n}\r\n\r\n.buttonIconMobileMenuButton{\r\n    height: 40px;\r\n    position: relative;\r\n    width: 40px;\r\n    border:4px white solid;\r\n    border-radius: 50%;\r\n    margin: 0 auto;\r\n    margin-top: 2.5px;\r\n}\r\n.ShtorkaMobileMenu{\r\n    position: fixed;\r\n    top: -100vh;\r\n    width: 80vw;\r\n    max-width: 800px;\r\n    height: 85%;\r\n    background-color: #3c3434;\r\n    transition: 1s;\r\n    margin: auto;\r\n    left: 0;\r\n    right: 0;\r\n\r\n    z-index: 2;\r\n}\r\n\r\n.ShtorkaMobileMenuShowDowned{\r\n    transition: 1s;\r\n    top: 0vh;\r\n}\r\n.ShtorkaMobileMenuButtonDowned {\r\n    transition: 1s;\r\n    top: 83vh;\r\n}\r\n.carretsignMenu {\r\n    transition: 2s;\r\n    margin-top: -1px;\r\n    margin-left: 1px;\r\n    transform: rotate(180deg);\r\n\r\n}\r\n.fa-1x{\r\n    font-size: 1.2em;\r\n    cursor: pointer;\r\n}\r\n\r\n.rightTopItems>li {\r\n    float: left;\r\n    margin-left: 0;\r\n    position: relative\r\n}\r\n.ProfileNotAuthorizitedInMenu{\r\n    display: inline-flex;\r\n    height: 70%;\r\n    background-color: #000000;\r\n    width: 100%;\r\n}\r\n.ProfileAuthorizitedInMenu{\r\n    display: inline-flex;\r\n    height: 30%;\r\n    background-color: #000000;\r\n    width: 100%;\r\n}\r\n.LoginButtons svg{\r\n    color: #fff;\r\n    font-size: 50px;\r\n    transition: 0.5s;\r\n    width: 20px;\r\n\r\n}\r\n.LoginButtons svg:hover{\r\n    background-color: #fff;\r\n    color: #1a394f;\r\n    border-radius: 5px;\r\n    cursor: pointer;\r\n}\r\n.ProfileAuthorizitedInMenuRightItems{\r\n    margin-left: 30px;\r\n    margin-top: 15px;\r\n}\r\n.ProfileAuthorizitedInMenuRightItemsCity {\r\n    font-family: \"Arial\";\r\n    color: rgb(252, 252, 252);\r\n    font-size: 25px;\r\n\r\n\r\n}\r\n.ProfileAuthorizitedInMenuRightItemsMissedNoth>p{\r\n    font-size: 20px;\r\n}\r\n.ProfileAuthorizitedInMenuRightItemsMissedNoth{\r\n    margin-left: -139px;\r\n    width: 350px;\r\n    padding-right: 50px;\r\n    text-align: right;\r\n    height: 120px;\r\n    margin-top: 17px;\r\n    font-size: 25px;\r\n    font-family: \"Arial\";\r\n    background-repeat: no-repeat;\r\n    background-size: cover;\r\n    background-position: center;\r\n    position: relative;\r\n    z-index: 2;\r\n    background-repeat: no-repeat;\r\n    background-size: cover;\r\n    background-position: center;\r\n    background-image: -moz-linear-gradient( 0deg, rgb(30,16,16) 0%, rgb(30,61,67) 100%);\r\n    background-image: -webkit-linear-gradient( 0deg, rgb(30,16,16) 0%, rgb(30,61,67) 100%);\r\n    background-image: -ms-linear-gradient( 0deg, rgb(30,16,16) 0%, rgb(30,61,67) 100%);\r\n    opacity: 0.988;\r\n    box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.35);\r\n}\r\n.ProfileAuthorizitedInMenuRightItemsOpenProfile{\r\n    background: #28a4c9;\r\n    margin-left: -229px;\r\n    border-bottom-right-radius: 330px;\r\n    width: 305px;\r\n    height: 35px;\r\n    font-size: 21px;\r\n    font-family: \"Arial\";\r\n    color: rgb(252, 252, 252);\r\n    text-align: center;\r\n    text-decoration: none;\r\n    display: inline-block;\r\n    padding-top: 5px;\r\n    cursor: pointer;\r\n     transition: 2s;\r\n    background-size: 1px 182px;\r\n\r\n\r\n}\r\n.ProfileAuthorizitedInMenuRightItemsOpenProfile:hover{\r\n\r\n\r\n    background-position: 90px;\r\n}\r\n.ProfileAuthorizitedInMenuLeftItems{\r\n    width: 28%;\r\n    position: relative;\r\n    margin-left: 2.25vw;\r\n    padding-top: 10px;\r\n    height: 100%;\r\n}\r\n.ProfileAuthorizitedInMenuLeftItemsName{\r\n    font-size: 3.5vw;\r\n    font-family: \"Arial\";\r\n    color: rgb(255, 181, 0);\r\n    font-weight: bold;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n\r\n}\r\n.ProfileAuthorizitedInMenuRightItemsCityName{\r\n    color: rgb(255, 181, 0);\r\n    display: inline-flex;\r\n    font-weight: bold;\r\n}\r\n.ProfileAuthorizitedInMenuLeftItemsAvatarBlockAvatar{\r\n\r\n    height: 150px;\r\n    position: initial;\r\n    width: 150px;\r\n    border: 5px #938f92 solid;\r\n    border-radius: 50%;\r\n    margin: 0 auto;\r\n    margin-top: 10px;\r\n    background-position: center;\r\n    background-size: auto 100%;\r\n    box-shadow: 0 0 10px 5px rgba(71,71,204,0.5);\r\n}\r\n.LoginPresentationPhotoBlockRight{\r\n    height: 150px;\r\n\r\n    width: 150px;\r\n    border-radius: 50%;\r\n    margin: 0 auto;\r\n    margin-top: 10px;\r\n    margin-left: 60px;\r\n    background-position: center;\r\n    background-size: cover;\r\n    background-repeat: no-repeat;\r\n    box-shadow: 0 0 10px 5px rgba(71,71,204,0.5);\r\n    display: inline-block;\r\n\r\n}\r\n.lvlFix{\r\n    margin-top: -42px !important;\r\n    margin-left: 70px !important;\r\n    position: relative;\r\n    z-index: 3;\r\n}\r\n.lblFix{\r\n    position: relative;\r\n    z-index: 4;\r\n}\r\n.LoginPresentationPhotoBlockCenter{\r\n    width: 150px;\r\n    margin: 0 auto;\r\n}\r\n.LoginPresentationLabel{\r\n    font-size: 120%;\r\n    font-family: \"Arial\";\r\n    color: rgb(120, 171, 54);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n    text-align: center;\r\n\r\n}\r\n\r\n.LoginPresentationPhotoBlockLeft{\r\n    height: 150px;\r\n\r\n    width: 150px;\r\n    border-radius: 50%;\r\n    margin: 0 auto;\r\n    margin-top: 10px;\r\n    background-position: center;\r\n    background-size: cover;\r\n    background-repeat: no-repeat;\r\n    box-shadow: 0 0 10px 5px rgba(71,71,204,0.5);\r\n    display: inline-block;\r\n}\r\n.PhotoBlockFix{\r\n    position: relative;\r\n    margin-top: -55px;\r\n    border:0px !important;\r\n}\r\n.LoginPresentationPhotoBlock{\r\n\r\n}\r\n.LoginPresentation{\r\n\r\n}\r\n.ProfileAuthorizitedInMenuLeftItemsAvatarBlock{\r\n    position: relative;\r\n    z-index: 10;\r\n}\r\n.fa-search{\r\n    position: absolute;\r\n    top: 15px;\r\n}\r\n.ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevel{\r\n    font-family: \"Arial\";\r\n    color: rgb(255, 255, 255);\r\n    border-style: solid;\r\n    font-size: x-large;\r\n    font-weight: bold;\r\n    width: 70px;\r\n    margin-top: -35px;\r\n    margin-left: 105px;\r\n    height: 42px;\r\n    padding-top: 5px;\r\n    color: #78eb1b;\r\n    border-width: 4px;\r\n    border-color: rgb(192, 192, 192);\r\n    border-style: solid;\r\n    border-radius: 16px;\r\n    background-color: rgb(0, 0, 0);\r\n    box-shadow: 0px 16px 7px 0px rgba(0, 0, 0, 0.68);\r\n\r\n}\r\n.ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevelLabel{\r\n\r\n    font-family: \"Arial\";\r\n    color: rgb(192, 192, 192);\r\n    font-weight: bold;\r\n    margin-left: 60px;\r\n    margin-top: 3px;\r\n\r\n}\r\n.SearchPanelinMenu{\r\n    padding: 10px;\r\n    height: 50px;\r\n    width: 100%;\r\n\r\n}\r\n.MenuItemsExit{\r\n    width: 100%;\r\n    height: 150px;\r\n    background-color: #1f1e1e;\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    text-align: center;\r\n    cursor:pointer;\r\n}\r\n.MenuItemsExit>p{\r\n    color: #c0c0c0;\r\n    margin: 0 auto;\r\n    vertical-align: center;\r\n    line-height: 3em;\r\n    font-size: 30PX;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n    display:inline-flex;\r\n    width: 150px;\r\n}\r\n.MenuItemsExit>p>span{\r\n    margin-left:20px;\r\n}\r\n.SbgInside>svg{\r\n    position: absolute;\r\n    z-index: 2;\r\n    margin-left: -4px;\r\n    margin-top: -32px;\r\n    width: 60px !important;\r\n}\r\n.SbgInside1>svg{\r\n    position: absolute;\r\n    z-index: 2;\r\n    margin-left: -79px;\r\n    margin-top: -50px;\r\n    width: 60px !important;\r\n}\r\n.LabelMenu{\r\n    margin-left: 157px;\r\n    color: #c0c0c0;\r\n    vertical-align: center;\r\n    font-size: 28px;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n}\r\n.LabelMenu1{\r\n    position: absolute;\r\n    margin-top: -94px;\r\n    margin-left: -32px;\r\n    color: #c0c0c0;\r\n    vertical-align: center;\r\n    font-size: 28px;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n}\r\n.CrugRamka{\r\n    position: absolute;\r\n    z-index: 1;\r\n    border-width: 3.15px;\r\n    border-color: rgb(40, 164, 201);\r\n    border-style: solid;\r\n    border-radius: 50%;\r\n    background-color: rgb(60, 52, 52);\r\n    display: inline-flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    cursor: pointer;\r\n    height: 100px;\r\n    width: 100px;\r\n    margin-left: 100px;\r\n}\r\n.MenuItemsExit>p>fa-3x{\r\n    line-height: inherit;\r\n}\r\n.MenuItemsEvents{\r\n    width: 100%;\r\n    height: 150px;\r\n    background-color: #000000;\r\n\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    text-align: center;\r\n}\r\n.MenuItemsEvents>p{\r\n    color: #c0c0c0;\r\n    margin: 0 auto;\r\n    vertical-align: center;\r\n    line-height: 3em;\r\n    font-size: 30PX;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n    width: 150px;\r\n    display:inline-flex;\r\n\r\n}\r\n.MenuItemsEvents>p>span{\r\n\r\n}\r\n\r\n.MenuItemsEvents>p>fa-3x{\r\n    line-height: inherit;\r\n}\r\n.MenuItemsCreateChat>p{\r\n    color: #c0c0c0;\r\n    margin: 0 auto;\r\n    vertical-align: center;\r\n    line-height: 2em;\r\n    font-size: 30px;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n}\r\n.MenuItemsCreateEvent>p{\r\n    color: #c0c0c0;\r\n    margin: 0 auto;\r\n    vertical-align: center;\r\n    line-height: 2em;\r\n    font-size: 30px;\r\n    font-weight: bold;\r\n    font-family: Arial;\r\n}\r\n.DisplayInline{display: inline-flex;\r\nwidth: 100%  ;\r\nheight: 147px;}\r\n.MenuItemsCreateEvent{\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    text-align: center;\r\n    width: 50%;\r\n    height: 150px;\r\n    background-color: #000000;\r\n}\r\n.MenuItemsCreateChat{\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: column;\r\n    text-align: center;\r\n    width: 50%;\r\n    height: 150px;\r\n    background-color: #000000;\r\n}\r\n\r\n.Login{\r\n    z-index:2;\r\n    background:black;\r\n    margin: 0 auto;\r\n    height: 250px;\r\n    width: 100%;\r\n\r\n}\r\n.LoginForm{\r\n    text-align: right;\r\n    margin-top:10px;\r\n    font-family: \"Arial\";\r\n    color: rgb(197, 206, 208);\r\n    font-weight: bold;\r\n    line-height: 1.2;\r\n    font-size: 160%;\r\n    width: 81%;\r\n}\r\n.MenubutttonFix{\r\n    text-align: center;\r\n    font-size: 115%;\r\n}\r\n.LoginButtonsBlock{\r\n    margin-top: 10px;\r\n    font-family: Myriad Pro;\r\n    font-style: italic;\r\n\r\n}\r\n.vk_vhod{\r\n    overflow: hidden;\r\n    border-radius:50%;\r\n    cursor:pointer;\r\n    width:50px;\r\n    height:50px;\r\n    margin: 0 auto;\r\n    margin-top: 15px;\r\n}\r\n.LoginButtons{\r\n    font-family: Myriad Pro;\r\n    margin:0 auto;\r\n\r\n}\r\n.LoginEmail{\r\n\r\n    margin: 10px;\r\n    margin-left: 14px;\r\n    width: 60%;\r\n    height: 41px;\r\n    padding: 1px 12px;\r\n    font-size: 14px;\r\n    line-height: 1.42857143;\r\n    background-color: #362f2f;\r\n    border: 2.5px solid #28a4c9;\r\n    border-radius: 50px;\r\n    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);\r\n    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;\r\n}\r\n.LoginEmail1{\r\n\r\n    margin: 10px;\r\n    margin-left: 14px;\r\n    width: 60%;\r\n    height: 41px;\r\n    padding: 1px 12px;\r\n    font-size: 14px;\r\n    line-height: 1.42857143;\r\n    background-color: #362f2f;\r\n    border: 2.5px solid #28a4c9;\r\n    border-radius: 50px;\r\n    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);\r\n    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;\r\n    margin-top: 20px;\r\n}\r\n.LoginBtn1{\r\n    padding: 9px;\r\n    margin-left: 55px;\r\n    margin-top: 5px;\r\n    display: inline-block;\r\n    margin-bottom: 0;\r\n    font-weight: 400;\r\n    line-height: 1.42857143;\r\n    text-align: center;\r\n    white-space: nowrap;\r\n    vertical-align: middle;\r\n    -ms-touch-action: manipulation;\r\n    touch-action: manipulation;\r\n    cursor: pointer;\r\n    -webkit-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    background-color: #4b74a5;\r\n    border: 1px solid transparent;\r\n    border-radius: 50px;\r\n    color:whitesmoke;\r\n\r\n}\r\n.MenubutttonFix{\r\n\r\n}\r\n.LoginBtn{\r\n    color:white;\r\n    margin-left: 5px;\r\n    margin-top: 5px;\r\n    display: inline-block;\r\n    padding: 9px;\r\n    margin-bottom: 0;\r\n\r\n    font-weight: 400;\r\n    line-height: 1.42857143;\r\n    text-align: center;\r\n    white-space: nowrap;\r\n    vertical-align: middle;\r\n    -ms-touch-action: manipulation;\r\n    touch-action: manipulation;\r\n    cursor: pointer;\r\n    -webkit-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    background-color: #38b81c;\r\n    border: 1px solid transparent;\r\n    border-radius: 50px;\r\n}\r\n.ProfileAuthorizitedInMenuRightWeatherItems{\r\n    position: absolute;\r\n    width: 15vh;\r\n    right: 0;\r\n    margin-top: 40px;\r\n}\r\n.currentWeatherIcon{\r\n    height: 30px;\r\n    position: initial;\r\n    width: 30px;\r\n    border-radius: 50%;\r\n    margin: 0 auto;\r\n    background-position: center;\r\n    background-size: auto 100%;\r\n}\r\n.IconOfMissingAlerts1{\r\n    border-width: 1.15px;\r\n    border-color: rgb(40, 164, 201);\r\n    border-style: solid;\r\n    border-radius: 50%;\r\n    background-color: rgb(60, 52, 52);\r\n    color: lightgreen;\r\n    width: 25px !important;\r\n    height: 25px !important;\r\n    text-align: center;\r\n    display: inline-block;\r\n    vertical-align: middle;\r\n    font-size: 15px;\r\n    padding-top: 4px;\r\n    padding-left: 2px;\r\n\r\n}\r\n.DvigLup{\r\n    margin-left: -37px;\r\n    height: 33px;\r\n    width: 33px;\r\n    background: black;\r\n    border: 2.5px solid #28a4c9;\r\n    border-radius: 50%;\r\n    position: absolute;\r\n    display: inline-block;\r\n}\r\n.SearchPanelinMenu>svg{\r\n    margin-left: -36px;\r\n    margin-top: 2px;\r\n}\r\n.AutoLabel{\r\n    font-family: \"Arial\";\r\n    color: rgb(40, 164, 201);\r\n    font-weight: bold;\r\n\r\n    font-size: 170%;\r\n}\r\n@media screen and (max-width: 768px) {\r\n    .ProfileAuthorizitedInMenu{\r\n        height: 20%;\r\n    }\r\n    .lvlFix{\r\n        margin-top: -25px !important;\r\n        margin-left: 75px !important;\r\n        position: relative;\r\n        z-index: 3;\r\n    }\r\n    .IconOfMissingAlerts1{\r\n        font-size: 2.5vw;\r\n        width: 15px !important;\r\n        height: 15px !important;\r\n        padding-top: 2px;\r\n        padding-left: 0px;\r\n    }\r\n    .ShtorkaMobileMenuButtonDowned{\r\n        top: 80vh;\r\n    }\r\n    .ShtorkaMobileMenu{\r\n        width: 100%;\r\n    }\r\n    .SearchPanel{\r\n        width: 100%;\r\n    }\r\n    .ProfileNotAuthorizitedInMenu {\r\n        height: 70%;\r\n    }\r\n    .LoginForm{\r\n        width: 95%;\r\n\r\n    }\r\n\r\n    .vk_vhod{\r\n        width: 3.5vh;\r\n        height: 3.5vh;\r\n        margin-top: 10px;\r\n    }\r\n    .LoginBtn1{\r\n        margin-left: 25px;\r\n\r\n    }\r\n    .LoginBtn{\r\n\r\n    }\r\n    .ProfileAuthorizitedInMenuLeftItemsAvatarBlockAvatar{\r\n        height: 12vh;\r\n        width: 12vh;\r\n    }\r\n    .LoginPresentationPhotoBlockRight{\r\n          height: 12vh;\r\n          width: 12vh;\r\n      }\r\n    .LoginPresentationPhotoBlockLeft{\r\n        height: 12vh;\r\n        width: 12vh;\r\n    }\r\n    .ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevel{\r\n        margin-left: 63px;\r\n        margin-top: -24px;\r\n        padding-top: 3px;\r\n        padding-bottom: 3px;\r\n        font-size: 3.5vw;\r\n        /* margin-top: -10px; */\r\n        width: 50px;\r\n        height: 100%;\r\n\r\n    }\r\n    .ProfileAuthorizitedInMenuRightItemsCity{\r\n        font-size: 3.5vw;\r\n    }\r\n    .ProfileAuthorizitedInMenuRightItemsMissedNoth{\r\n        margin-top: 5px;\r\n        font-size: 3.5vw;\r\n        height: 70px;\r\n        width: 250px;\r\n        margin-left: -106px;\r\n        padding-left: 83px;\r\n        padding-right: 36px;\r\n    }\r\n\r\n    .ProfileAuthorizitedInMenuRightItemsOpenProfile{\r\n        font-size: 3.5vw;\r\n        width: 219px;\r\n        height: 31px;\r\n\r\n        margin-left: -150px;\r\n    }\r\n    .ProfileAuthorizitedInMenuLeftItemsAvatarBlockLevelLabel{\r\n        margin-left: 54px;\r\n        font-size: 2.5vw;\r\n    }\r\n    .LogoVnutN:after {\r\n        margin-top: -8px;\r\n        font-weight: bold;\r\n        content: \".ru\";\r\n        font-size: 23pt;\r\n    }\r\n    .MenuItemsEvents{\r\n        height: 15vh;\r\n    }\r\n    .MenuItemsEvents>p{\r\n        line-height: 2em;\r\n        font-size: 25PX;\r\n    }\r\n    .MenuItemsExit{\r\n        height: 15vh;\r\n    }\r\n    .MenuItemsExit>p{\r\n        line-height: 2em;\r\n        font-size: 25PX;\r\n    }\r\n    .MenuItemsCreateEvent{\r\n        height: 14vh;\r\n    }\r\n    .MenuItemsCreateChat{\r\n        height: 14vh;\r\n    }\r\n    .MenuItemsCreateEvent>p{\r\n        line-height: 2em;\r\n        font-size: 20px;\r\n    }\r\n    .MenuItemsCreateChat>p{\r\n        line-height: 2em;\r\n        font-size: 20px;\r\n    }\r\n    .DisplayInline{\r\n        height: 13.5vh;\r\n    }\r\n    .CrugRamka{\r\n        display: none;\r\n    }\r\n    .LabelMenu{\r\n        margin-left: 63px;\r\n        margin-top: -13px;\r\n        color: #c0c0c0;\r\n        vertical-align: center;\r\n        font-size: 100%;\r\n        font-weight: bold;\r\n        font-family: Arial;\r\n    }\r\n    .LabelMenu1{\r\n        position: absolute;\r\n        margin-top: -50px;\r\n        margin-left: -13px;\r\n        color: #c0c0c0;\r\n        vertical-align: center;\r\n        font-size: 80%;\r\n        font-weight: bold;\r\n        font-family: Arial;\r\n    }\r\n}\r\n\r\n@media screen and (min-width: 1024px) {\r\n    .ProfileAuthorizitedInMenuLeftItemsName {\r\n        font-size: 36px;\r\n    }\r\n\r\n}", ""]);

// exports


/***/ }),

/***/ 613:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(600);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./CreateEventContent.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./CreateEventContent.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 614:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(601);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./ChatList.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./ChatList.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 615:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(603);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./CreateChatContent.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./CreateChatContent.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 616:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(604);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./EventContent.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./EventContent.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 617:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(606);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./FriendsTab.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./FriendsTab.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 618:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(607);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Messages.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Messages.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 619:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(608);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Prievewreset.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Prievewreset.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 620:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(609);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./Prievewstyle.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./Prievewstyle.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 621:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(610);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./SearchPageContnent.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./SearchPageContnent.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 622:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(611);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./UserProfile.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./UserProfile.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 623:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(612);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./headerMenu.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./headerMenu.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 624:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(613);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(24)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/style-loader/index.js!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./CreateEventContent.scss", function() {
			var newContent = require("!!../../node_modules/style-loader/index.js!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./CreateEventContent.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 625:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (a, b) {
  var fn = function fn() {};
  fn.prototype = b.prototype;
  a.prototype = new fn();
  a.prototype.constructor = a;
};

/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(330);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function (qs) {
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(575);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

/**
 * Colors.
 */

exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ })

},[586]);
//# sourceMappingURL=app.bundle.js.map