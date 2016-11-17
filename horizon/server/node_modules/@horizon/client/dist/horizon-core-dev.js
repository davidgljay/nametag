/*! __LICENSE__ */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rxjs"));
	else if(typeof define === 'function' && define.amd)
		define(["rxjs"], factory);
	else if(typeof exports === 'object')
		exports["Horizon"] = factory(require("rxjs"));
	else
		root["Horizon"] = factory(root["Rx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(/*! rxjs/add/observable/of */ 1);
	
	__webpack_require__(/*! rxjs/add/observable/from */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/catch */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/concatMap */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/map */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/filter */ 1);
	
	var _ast = __webpack_require__(/*! ./ast */ 2);
	
	var _socket = __webpack_require__(/*! ./socket */ 95);
	
	var _auth = __webpack_require__(/*! ./auth */ 96);
	
	var _model = __webpack_require__(/*! ./model */ 98);
	
	var defaultHost = typeof window !== 'undefined' && window.location && '' + window.location.host || 'localhost:8181';
	var defaultSecure = typeof window !== 'undefined' && window.location && window.location.protocol === 'https:' || false;
	
	function Horizon() {
	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var _ref$host = _ref.host;
	  var host = _ref$host === undefined ? defaultHost : _ref$host;
	  var _ref$secure = _ref.secure;
	  var secure = _ref$secure === undefined ? defaultSecure : _ref$secure;
	  var _ref$path = _ref.path;
	  var path = _ref$path === undefined ? 'horizon' : _ref$path;
	  var _ref$lazyWrites = _ref.lazyWrites;
	  var lazyWrites = _ref$lazyWrites === undefined ? false : _ref$lazyWrites;
	  var _ref$authType = _ref.authType;
	  var authType = _ref$authType === undefined ? 'unauthenticated' : _ref$authType;
	  var _ref$keepalive = _ref.keepalive;
	  var keepalive = _ref$keepalive === undefined ? 60 : _ref$keepalive;
	  var _ref$WebSocketCtor = _ref.WebSocketCtor;
	  var WebSocketCtor = _ref$WebSocketCtor === undefined ? WebSocket : _ref$WebSocketCtor;
	
	  // If we're in a redirection from OAuth, store the auth token for
	  // this user in localStorage.
	
	  var tokenStorage = new _auth.TokenStorage({ authType: authType, path: path });
	  tokenStorage.setAuthFromQueryParams();
	
	  var url = 'ws' + (secure ? 's' : '') + '://' + host + '/' + path;
	  var socket = new _socket.HorizonSocket({
	    url: url,
	    handshakeMaker: tokenStorage.handshake.bind(tokenStorage),
	    keepalive: keepalive,
	    WebSocketCtor: WebSocketCtor
	  });
	
	  // Store whatever token we get back from the server when we get a
	  // handshake response
	  socket.handshake.subscribe({
	    next: function next(handshake) {
	      if (authType !== 'unauthenticated') {
	        tokenStorage.set(handshake.token);
	      }
	    },
	    error: function error(err) {
	      if (/JsonWebTokenError|TokenExpiredError/.test(err.message)) {
	        console.error('Horizon: clearing token storage since auth failed');
	        tokenStorage.remove();
	      }
	    }
	  });
	
	  // This is the object returned by the Horizon function. It's a
	  // function so we can construct a collection simply by calling it
	  // like horizon('my_collection')
	  function horizon(name) {
	    return new _ast.Collection(sendRequest, name, lazyWrites);
	  }
	
	  horizon.currentUser = function () {
	    return new _ast.UserDataTerm(horizon, socket.handshake, socket);
	  };
	
	  horizon.disconnect = function () {
	    socket.complete();
	  };
	
	  // Dummy subscription to force it to connect to the
	  // server. Optionally provide an error handling function if the
	  // socket experiences an error.
	  // Note: Users of the Observable interface shouldn't need this
	  horizon.connect = function () {
	    var onError = arguments.length <= 0 || arguments[0] === undefined ? function (err) {
	      console.error('Received an error: ' + err);
	    } : arguments[0];
	
	    socket.subscribe(function () {}, onError);
	  };
	
	  // Either subscribe to status updates, or return an observable with
	  // the current status and all subsequent status changes.
	  horizon.status = subscribeOrObservable(socket.status);
	
	  // Convenience method for finding out when disconnected
	  horizon.onDisconnected = subscribeOrObservable(socket.status.filter(function (x) {
	    return x.type === 'disconnected';
	  }));
	
	  // Convenience method for finding out when ready
	  horizon.onReady = subscribeOrObservable(socket.status.filter(function (x) {
	    return x.type === 'ready';
	  }));
	
	  // Convenience method for finding out when an error occurs
	  horizon.onSocketError = subscribeOrObservable(socket.status.filter(function (x) {
	    return x.type === 'error';
	  }));
	
	  horizon.utensils = {
	    sendRequest: sendRequest,
	    tokenStorage: tokenStorage,
	    handshake: socket.handshake
	  };
	  Object.freeze(horizon.utensils);
	
	  horizon._authMethods = null;
	  horizon._root = 'http' + (secure ? 's' : '') + '://' + host;
	  horizon._horizonPath = horizon._root + '/' + path;
	  horizon.authEndpoint = _auth.authEndpoint;
	  horizon.hasAuthToken = tokenStorage.hasAuthToken.bind(tokenStorage);
	  horizon.aggregate = _model.aggregate;
	  horizon.model = _model.model;
	
	  return horizon;
	
	  // Sends a horizon protocol request to the server, and pulls the data
	  // portion of the response out.
	  function sendRequest(type, options) {
	    // Both remove and removeAll use the type 'remove' in the protocol
	    var normalizedType = type === 'removeAll' ? 'remove' : type;
	    return socket.hzRequest({ type: normalizedType, options: options }) // send the raw request
	    .takeWhile(function (resp) {
	      return resp.state !== 'complete';
	    });
	  }
	}
	
	function subscribeOrObservable(observable) {
	  return function () {
	    if (arguments.length > 0) {
	      return observable.subscribe.apply(observable, arguments);
	    } else {
	      return observable;
	    }
	  };
	}
	
	Horizon.Socket = _socket.HorizonSocket;
	Horizon.clearAuthTokens = _auth.clearAuthTokens;
	
	module.exports = Horizon;

/***/ },
/* 1 */
/*!********************************************************************************!*\
  !*** external {"root":"Rx","commonjs":"rxjs","commonjs2":"rxjs","amd":"rxjs"} ***!
  \********************************************************************************/
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/*!********************!*\
  !*** ./src/ast.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.UserDataTerm = exports.Limit = exports.Order = exports.Below = exports.Above = exports.FindAll = exports.Find = exports.Collection = exports.TermBase = undefined;
	
	var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 3);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 72);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 4);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 80);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	exports.applyChange = applyChange;
	
	var _Observable = __webpack_require__(/*! rxjs/Observable */ 1);
	
	__webpack_require__(/*! rxjs/add/observable/empty */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/publishReplay */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/scan */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/filter */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/map */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/toArray */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/defaultIfEmpty */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/ignoreElements */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/merge */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/mergeMap */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/take */ 1);
	
	var _snakeCase = __webpack_require__(/*! snake-case */ 81);
	
	var _snakeCase2 = _interopRequireDefault(_snakeCase);
	
	var _deepEqual = __webpack_require__(/*! deep-equal */ 87);
	
	var _deepEqual2 = _interopRequireDefault(_deepEqual);
	
	var _checkArgs = __webpack_require__(/*! ./util/check-args */ 90);
	
	var _checkArgs2 = _interopRequireDefault(_checkArgs);
	
	var _validIndexValue = __webpack_require__(/*! ./util/valid-index-value.js */ 92);
	
	var _validIndexValue2 = _interopRequireDefault(_validIndexValue);
	
	var _serialization = __webpack_require__(/*! ./serialization.js */ 93);
	
	var _watchRewrites = __webpack_require__(/*! ./hacks/watch-rewrites */ 94);
	
	var _watchRewrites2 = _interopRequireDefault(_watchRewrites);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 @this TermBase
	
	 Validation check to throw an exception if a method is chained onto a
	 query that already has it. It belongs to TermBase, but we don't want
	 to pollute the objects with it (since it isn't useful to api users),
	 so it's dynamically bound with .call inside methods that use it.
	*/
	function checkIfLegalToChain(key) {
	  if (this._legalMethods.indexOf(key) === -1) {
	    throw new Error(key + ' cannot be called on the current query');
	  }
	  if ((0, _snakeCase2.default)(key) in this._query) {
	    throw new Error(key + ' has already been called on this query');
	  }
	}
	
	// Abstract base class for terms
	
	var TermBase = exports.TermBase = function () {
	  function TermBase(sendRequest, query, legalMethods) {
	    (0, _classCallCheck3.default)(this, TermBase);
	
	    this._sendRequest = sendRequest;
	    this._query = query;
	    this._legalMethods = legalMethods;
	  }
	
	  TermBase.prototype.toString = function toString() {
	    var string = 'Collection(\'' + this._query.collection + '\')';
	    if (this._query.find) {
	      string += '.find(' + JSON.stringify(this._query.find) + ')';
	    }
	    if (this._query.find_all) {
	      string += '.findAll(' + JSON.stringify(this._query.find_all) + ')';
	    }
	    if (this._query.order) {
	      string += '.order(' + JSON.stringify(this._query.order[0]) + ', ' + (JSON.stringify(this._query.order[1]) + ')');
	    }
	    if (this._query.above) {
	      string += '.above(' + JSON.stringify(this.query.above[0]) + ', ' + (JSON.stringify(this.query.above[1]) + ')');
	    }
	    if (this._query.below) {
	      string += '.below(' + JSON.stringify(this.query.below[0]) + ', ' + (JSON.stringify(this.query.below[1]) + ')');
	    }
	    if (this._query.limit) {
	      string += '.limit(this._query.limit))';
	    }
	    return string;
	  };
	  // Returns a sequence of the result set. Every time it changes the
	  // updated sequence will be emitted. If raw change objects are
	  // needed, pass the option 'rawChanges: true'. An observable is
	  // returned which will lazily emit the query when it is subscribed
	  // to
	
	
	  TermBase.prototype.watch = function watch() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$rawChanges = _ref.rawChanges;
	    var rawChanges = _ref$rawChanges === undefined ? false : _ref$rawChanges;
	
	    var query = (0, _watchRewrites2.default)(this, this._query);
	    var raw = this._sendRequest('subscribe', query);
	    if (rawChanges) {
	      return raw;
	    } else {
	      return makePresentable(raw, this._query);
	    }
	  };
	  // Grab a snapshot of the current query (non-changefeed). Emits an
	  // array with all results. An observable is returned which will
	  // lazily emit the query when subscribed to
	
	
	  TermBase.prototype.fetch = function fetch() {
	    var raw = this._sendRequest('query', this._query).map(function (val) {
	      delete val.$hz_v$;
	      return val;
	    });
	    if (this._query.find) {
	      return raw.defaultIfEmpty(null);
	    } else {
	      return raw.toArray();
	    }
	  };
	
	  TermBase.prototype.findAll = function findAll() {
	    for (var _len = arguments.length, fieldValues = Array(_len), _key = 0; _key < _len; _key++) {
	      fieldValues[_key] = arguments[_key];
	    }
	
	    checkIfLegalToChain.call(this, 'findAll');
	    (0, _checkArgs2.default)('findAll', arguments, { maxArgs: 100 });
	    return new FindAll(this._sendRequest, this._query, fieldValues);
	  };
	
	  TermBase.prototype.find = function find(idOrObject) {
	    checkIfLegalToChain.call(this, 'find');
	    (0, _checkArgs2.default)('find', arguments);
	    return new Find(this._sendRequest, this._query, idOrObject);
	  };
	
	  TermBase.prototype.order = function order(fields) {
	    var direction = arguments.length <= 1 || arguments[1] === undefined ? 'ascending' : arguments[1];
	
	    checkIfLegalToChain.call(this, 'order');
	    (0, _checkArgs2.default)('order', arguments, { minArgs: 1, maxArgs: 2 });
	    return new Order(this._sendRequest, this._query, fields, direction);
	  };
	
	  TermBase.prototype.above = function above(aboveSpec) {
	    var bound = arguments.length <= 1 || arguments[1] === undefined ? 'closed' : arguments[1];
	
	    checkIfLegalToChain.call(this, 'above');
	    (0, _checkArgs2.default)('above', arguments, { minArgs: 1, maxArgs: 2 });
	    return new Above(this._sendRequest, this._query, aboveSpec, bound);
	  };
	
	  TermBase.prototype.below = function below(belowSpec) {
	    var bound = arguments.length <= 1 || arguments[1] === undefined ? 'open' : arguments[1];
	
	    checkIfLegalToChain.call(this, 'below');
	    (0, _checkArgs2.default)('below', arguments, { minArgs: 1, maxArgs: 2 });
	    return new Below(this._sendRequest, this._query, belowSpec, bound);
	  };
	
	  TermBase.prototype.limit = function limit(size) {
	    checkIfLegalToChain.call(this, 'limit');
	    (0, _checkArgs2.default)('limit', arguments);
	    return new Limit(this._sendRequest, this._query, size);
	  };
	
	  return TermBase;
	}();
	
	// Turn a raw observable of server responses into user-presentable events
	//
	// `observable` is the base observable with full responses coming from
	//              the HorizonSocket
	// `query` is the value of `options` in the request
	
	
	function makePresentable(observable, query) {
	  // Whether the entire data structure is in each change
	  var pointQuery = Boolean(query.find);
	
	  if (pointQuery) {
	    var _ret = function () {
	      var hasEmitted = false;
	      var seedVal = null;
	      // Simplest case: just pass through new_val
	      return {
	        v: observable.filter(function (change) {
	          return !hasEmitted || change.type !== 'state';
	        }).scan(function (previous, change) {
	          hasEmitted = true;
	          if (change.new_val != null) {
	            delete change.new_val.$hz_v$;
	          }
	          if (change.old_val != null) {
	            delete change.old_val.$hz_v$;
	          }
	          if (change.state === 'synced') {
	            return previous;
	          } else {
	            return change.new_val;
	          }
	        }, seedVal)
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
	  } else {
	    var _seedVal = { emitted: false, val: [] };
	    return observable.scan(function (state, change) {
	      if (change.new_val != null) {
	        delete change.new_val.$hz_v$;
	      }
	      if (change.old_val != null) {
	        delete change.old_val.$hz_v$;
	      }
	      if (change.state === 'synced') {
	        state.emitted = true;
	      }
	      state.val = applyChange(state.val.slice(), change);
	      return state;
	    }, _seedVal).filter(function (state) {
	      return state.emitted;
	    }).map(function (x) {
	      return x.val;
	    });
	  }
	}
	
	function applyChange(arr, change) {
	  switch (change.type) {
	    case 'remove':
	    case 'uninitial':
	      {
	        // Remove old values from the array
	        if (change.old_offset != null) {
	          arr.splice(change.old_offset, 1);
	        } else {
	          var index = arr.findIndex(function (x) {
	            return (0, _deepEqual2.default)(x.id, change.old_val.id);
	          });
	          if (index === -1) {
	            // Programming error. This should not happen
	            throw new Error('change couldn\'t be applied: ' + JSON.stringify(change));
	          }
	          arr.splice(index, 1);
	        }
	        break;
	      }
	    case 'add':
	    case 'initial':
	      {
	        // Add new values to the array
	        if (change.new_offset != null) {
	          // If we have an offset, put it in the correct location
	          arr.splice(change.new_offset, 0, change.new_val);
	        } else {
	          // otherwise for unordered results, push it on the end
	          arr.push(change.new_val);
	        }
	        break;
	      }
	    case 'change':
	      {
	        // Modify in place if a change is happening
	        if (change.old_offset != null) {
	          // Remove the old document from the results
	          arr.splice(change.old_offset, 1);
	        }
	        if (change.new_offset != null) {
	          // Splice in the new val if we have an offset
	          arr.splice(change.new_offset, 0, change.new_val);
	        } else {
	          // If we don't have an offset, find the old val and
	          // replace it with the new val
	          var _index = arr.findIndex(function (x) {
	            return (0, _deepEqual2.default)(x.id, change.old_val.id);
	          });
	          if (_index === -1) {
	            // indicates a programming bug. The server gives us the
	            // ordering, so if we don't find the id it means something is
	            // buggy.
	            throw new Error('change couldn\'t be applied: ' + JSON.stringify(change));
	          }
	          arr[_index] = change.new_val;
	        }
	        break;
	      }
	    case 'state':
	      {
	        // This gets hit if we have not emitted yet, and should
	        // result in an empty array being output.
	        break;
	      }
	    default:
	      throw new Error('unrecognized \'type\' field from server ' + JSON.stringify(change));
	  }
	  return arr;
	}
	
	/** @this Collection
	 Implements writeOps for the Collection class
	*/
	function writeOp(name, args, documents) {
	  (0, _checkArgs2.default)(name, args);
	  var isBatch = true;
	  var wrappedDocs = documents;
	  if (!Array.isArray(documents)) {
	    // Wrap in an array if we need to
	    wrappedDocs = [documents];
	    isBatch = false;
	  } else if (documents.length === 0) {
	    // Don't bother sending no-ops to the server
	    return _Observable.Observable.empty();
	  }
	  var options = Object.assign({}, this._query, { data: (0, _serialization.serialize)(wrappedDocs) });
	  var observable = this._sendRequest(name, options);
	  if (isBatch) {
	    // If this is a batch writeOp, each document may succeed or fail
	    // individually.
	    observable = observable.map(function (resp) {
	      return resp.error ? new Error(resp.error) : resp;
	    });
	  } else {
	    (function () {
	      // If this is a single writeOp, the entire operation should fail
	      // if any fails.
	      var _prevOb = observable;
	      observable = _Observable.Observable.create(function (subscriber) {
	        _prevOb.subscribe({
	          next: function next(resp) {
	            if (resp.error) {
	              // TODO: handle error ids when we get them
	              subscriber.error(new Error(resp.error));
	            } else {
	              subscriber.next(resp);
	            }
	          },
	          error: function error(err) {
	            subscriber.error(err);
	          },
	          complete: function complete() {
	            subscriber.complete();
	          }
	        });
	      });
	    })();
	  }
	  if (!this._lazyWrites) {
	    // Need to buffer response since this becomes a hot observable and
	    // when we subscribe matters
	    observable = observable.publishReplay().refCount();
	    observable.subscribe();
	  }
	  return observable;
	}
	
	var Collection = exports.Collection = function (_TermBase) {
	  (0, _inherits3.default)(Collection, _TermBase);
	
	  function Collection(sendRequest, collectionName, lazyWrites) {
	    (0, _classCallCheck3.default)(this, Collection);
	
	    var query = { collection: collectionName };
	    var legalMethods = ['find', 'findAll', 'order', 'above', 'below', 'limit'];
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, _TermBase.call(this, sendRequest, query, legalMethods));
	
	    _this._lazyWrites = lazyWrites;
	    return _this;
	  }
	
	  Collection.prototype.store = function store(documents) {
	    return writeOp.call(this, 'store', arguments, documents);
	  };
	
	  Collection.prototype.upsert = function upsert(documents) {
	    return writeOp.call(this, 'upsert', arguments, documents);
	  };
	
	  Collection.prototype.insert = function insert(documents) {
	    return writeOp.call(this, 'insert', arguments, documents);
	  };
	
	  Collection.prototype.replace = function replace(documents) {
	    return writeOp.call(this, 'replace', arguments, documents);
	  };
	
	  Collection.prototype.update = function update(documents) {
	    return writeOp.call(this, 'update', arguments, documents);
	  };
	
	  Collection.prototype.remove = function remove(documentOrId) {
	    var wrapped = (0, _validIndexValue2.default)(documentOrId) ? { id: documentOrId } : documentOrId;
	    return writeOp.call(this, 'remove', arguments, wrapped);
	  };
	
	  Collection.prototype.removeAll = function removeAll(documentsOrIds) {
	    if (!Array.isArray(documentsOrIds)) {
	      throw new Error('removeAll takes an array as an argument');
	    }
	    var wrapped = documentsOrIds.map(function (item) {
	      if ((0, _validIndexValue2.default)(item)) {
	        return { id: item };
	      } else {
	        return item;
	      }
	    });
	    return writeOp.call(this, 'removeAll', arguments, wrapped);
	  };
	
	  return Collection;
	}(TermBase);
	
	var Find = exports.Find = function (_TermBase2) {
	  (0, _inherits3.default)(Find, _TermBase2);
	
	  function Find(sendRequest, previousQuery, idOrObject) {
	    (0, _classCallCheck3.default)(this, Find);
	
	    var findObject = (0, _validIndexValue2.default)(idOrObject) ? { id: idOrObject } : idOrObject;
	    var query = Object.assign({}, previousQuery, { find: findObject });
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase2.call(this, sendRequest, query, []));
	  }
	
	  return Find;
	}(TermBase);
	
	var FindAll = exports.FindAll = function (_TermBase3) {
	  (0, _inherits3.default)(FindAll, _TermBase3);
	
	  function FindAll(sendRequest, previousQuery, fieldValues) {
	    (0, _classCallCheck3.default)(this, FindAll);
	
	    var wrappedFields = fieldValues.map(function (item) {
	      return (0, _validIndexValue2.default)(item) ? { id: item } : item;
	    });
	    var options = { find_all: wrappedFields };
	    var findAllQuery = Object.assign({}, previousQuery, options);
	    var legalMethods = void 0;
	    if (wrappedFields.length === 1) {
	      legalMethods = ['order', 'above', 'below', 'limit'];
	    } else {
	      // The vararg version of findAll cannot have anything chained to it
	      legalMethods = [];
	    }
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase3.call(this, sendRequest, findAllQuery, legalMethods));
	  }
	
	  return FindAll;
	}(TermBase);
	
	var Above = exports.Above = function (_TermBase4) {
	  (0, _inherits3.default)(Above, _TermBase4);
	
	  function Above(sendRequest, previousQuery, aboveSpec, bound) {
	    (0, _classCallCheck3.default)(this, Above);
	
	    var option = { above: [aboveSpec, bound] };
	    var query = Object.assign({}, previousQuery, option);
	    var legalMethods = ['findAll', 'order', 'below', 'limit'];
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase4.call(this, sendRequest, query, legalMethods));
	  }
	
	  return Above;
	}(TermBase);
	
	var Below = exports.Below = function (_TermBase5) {
	  (0, _inherits3.default)(Below, _TermBase5);
	
	  function Below(sendRequest, previousQuery, belowSpec, bound) {
	    (0, _classCallCheck3.default)(this, Below);
	
	    var options = { below: [belowSpec, bound] };
	    var query = Object.assign({}, previousQuery, options);
	    var legalMethods = ['findAll', 'order', 'above', 'limit'];
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase5.call(this, sendRequest, query, legalMethods));
	  }
	
	  return Below;
	}(TermBase);
	
	var Order = exports.Order = function (_TermBase6) {
	  (0, _inherits3.default)(Order, _TermBase6);
	
	  function Order(sendRequest, previousQuery, fields, direction) {
	    (0, _classCallCheck3.default)(this, Order);
	
	    var wrappedFields = Array.isArray(fields) ? fields : [fields];
	    var options = { order: [wrappedFields, direction] };
	    var query = Object.assign({}, previousQuery, options);
	    var legalMethods = ['findAll', 'above', 'below', 'limit'];
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase6.call(this, sendRequest, query, legalMethods));
	  }
	
	  return Order;
	}(TermBase);
	
	var Limit = exports.Limit = function (_TermBase7) {
	  (0, _inherits3.default)(Limit, _TermBase7);
	
	  function Limit(sendRequest, previousQuery, size) {
	    (0, _classCallCheck3.default)(this, Limit);
	
	    var query = Object.assign({}, previousQuery, { limit: size });
	    // Nothing is legal to chain after .limit
	    return (0, _possibleConstructorReturn3.default)(this, _TermBase7.call(this, sendRequest, query, []));
	  }
	
	  return Limit;
	}(TermBase);
	
	var UserDataTerm = exports.UserDataTerm = function () {
	  function UserDataTerm(hz, handshake, socket) {
	    (0, _classCallCheck3.default)(this, UserDataTerm);
	
	    this._hz = hz;
	    this._before = socket.ignoreElements().merge(handshake);
	  }
	
	  UserDataTerm.prototype._query = function _query(userId) {
	    return this._hz('users').find(userId);
	  };
	
	  UserDataTerm.prototype.fetch = function fetch() {
	    var _this8 = this;
	
	    return this._before.mergeMap(function (handshake) {
	      if (handshake.id == null) {
	        throw new Error('Unauthenticated users have no user document');
	      } else {
	        return _this8._query(handshake.id).fetch();
	      }
	    }).take(1); // necessary so that we complete, since _before is
	    // infinite
	  };
	
	  UserDataTerm.prototype.watch = function watch() {
	    var _this9 = this;
	
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }
	
	    return this._before.mergeMap(function (handshake) {
	      if (handshake.id === null) {
	        throw new Error('Unauthenticated users have no user document');
	      } else {
	        var _query2;
	
	        return (_query2 = _this9._query(handshake.id)).watch.apply(_query2, args);
	      }
	    });
	  };
	
	  return UserDataTerm;
	}();

/***/ },
/* 3 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 4);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 4 */
/*!*******************************************!*\
  !*** ./~/babel-runtime/helpers/typeof.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ 5);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(/*! ../core-js/symbol */ 56);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 5 */
/*!****************************************************!*\
  !*** ./~/babel-runtime/core-js/symbol/iterator.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ 6), __esModule: true };

/***/ },
/* 6 */
/*!*************************************************!*\
  !*** ./~/core-js/library/fn/symbol/iterator.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.string.iterator */ 7);
	__webpack_require__(/*! ../../modules/web.dom.iterable */ 51);
	module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ 55).f('iterator');

/***/ },
/* 7 */
/*!**********************************************************!*\
  !*** ./~/core-js/library/modules/es6.string.iterator.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(/*! ./_string-at */ 8)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(/*! ./_iter-define */ 11)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 8 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_string-at.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(/*! ./_to-integer */ 9)
	  , defined   = __webpack_require__(/*! ./_defined */ 10);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 9 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_to-integer.js ***!
  \**************************************************/
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 10 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_defined.js ***!
  \***********************************************/
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 11 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_iter-define.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(/*! ./_library */ 12)
	  , $export        = __webpack_require__(/*! ./_export */ 13)
	  , redefine       = __webpack_require__(/*! ./_redefine */ 28)
	  , hide           = __webpack_require__(/*! ./_hide */ 18)
	  , has            = __webpack_require__(/*! ./_has */ 29)
	  , Iterators      = __webpack_require__(/*! ./_iterators */ 30)
	  , $iterCreate    = __webpack_require__(/*! ./_iter-create */ 31)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 47)
	  , getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 49)
	  , ITERATOR       = __webpack_require__(/*! ./_wks */ 48)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 12 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_library.js ***!
  \***********************************************/
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 13 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_export.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(/*! ./_global */ 14)
	  , core      = __webpack_require__(/*! ./_core */ 15)
	  , ctx       = __webpack_require__(/*! ./_ctx */ 16)
	  , hide      = __webpack_require__(/*! ./_hide */ 18)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 14 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_global.js ***!
  \**********************************************/
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 15 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_core.js ***!
  \********************************************/
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 16 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_ctx.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(/*! ./_a-function */ 17);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 17 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_a-function.js ***!
  \**************************************************/
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 18 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_hide.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(/*! ./_object-dp */ 19)
	  , createDesc = __webpack_require__(/*! ./_property-desc */ 27);
	module.exports = __webpack_require__(/*! ./_descriptors */ 23) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 19 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_object-dp.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(/*! ./_an-object */ 20)
	  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 22)
	  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 26)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(/*! ./_descriptors */ 23) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 20 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_an-object.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 21);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 21 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_is-object.js ***!
  \*************************************************/
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 22 */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/_ie8-dom-define.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(/*! ./_descriptors */ 23) && !__webpack_require__(/*! ./_fails */ 24)(function(){
	  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ 25)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 23 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_descriptors.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(/*! ./_fails */ 24)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 24 */
/*!*********************************************!*\
  !*** ./~/core-js/library/modules/_fails.js ***!
  \*********************************************/
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 25 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_dom-create.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 21)
	  , document = __webpack_require__(/*! ./_global */ 14).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 26 */
/*!****************************************************!*\
  !*** ./~/core-js/library/modules/_to-primitive.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(/*! ./_is-object */ 21);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 27 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_property-desc.js ***!
  \*****************************************************/
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 28 */
/*!************************************************!*\
  !*** ./~/core-js/library/modules/_redefine.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./_hide */ 18);

/***/ },
/* 29 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_has.js ***!
  \*******************************************/
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 30 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_iterators.js ***!
  \*************************************************/
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 31 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_iter-create.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(/*! ./_object-create */ 32)
	  , descriptor     = __webpack_require__(/*! ./_property-desc */ 27)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 47)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(/*! ./_hide */ 18)(IteratorPrototype, __webpack_require__(/*! ./_wks */ 48)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 32 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_object-create.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(/*! ./_an-object */ 20)
	  , dPs         = __webpack_require__(/*! ./_object-dps */ 33)
	  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 45)
	  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 42)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(/*! ./_dom-create */ 25)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(/*! ./_html */ 46).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 33 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-dps.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(/*! ./_object-dp */ 19)
	  , anObject = __webpack_require__(/*! ./_an-object */ 20)
	  , getKeys  = __webpack_require__(/*! ./_object-keys */ 34);
	
	module.exports = __webpack_require__(/*! ./_descriptors */ 23) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 34 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-keys.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(/*! ./_object-keys-internal */ 35)
	  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 45);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 35 */
/*!************************************************************!*\
  !*** ./~/core-js/library/modules/_object-keys-internal.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(/*! ./_has */ 29)
	  , toIObject    = __webpack_require__(/*! ./_to-iobject */ 36)
	  , arrayIndexOf = __webpack_require__(/*! ./_array-includes */ 39)(false)
	  , IE_PROTO     = __webpack_require__(/*! ./_shared-key */ 42)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 36 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_to-iobject.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(/*! ./_iobject */ 37)
	  , defined = __webpack_require__(/*! ./_defined */ 10);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 37 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_iobject.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(/*! ./_cof */ 38);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 38 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_cof.js ***!
  \*******************************************/
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 39 */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/_array-includes.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 36)
	  , toLength  = __webpack_require__(/*! ./_to-length */ 40)
	  , toIndex   = __webpack_require__(/*! ./_to-index */ 41);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 40 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_to-length.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(/*! ./_to-integer */ 9)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 41 */
/*!************************************************!*\
  !*** ./~/core-js/library/modules/_to-index.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(/*! ./_to-integer */ 9)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 42 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_shared-key.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(/*! ./_shared */ 43)('keys')
	  , uid    = __webpack_require__(/*! ./_uid */ 44);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 43 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_shared.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(/*! ./_global */ 14)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 44 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_uid.js ***!
  \*******************************************/
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 45 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_enum-bug-keys.js ***!
  \*****************************************************/
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 46 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_html.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./_global */ 14).document && document.documentElement;

/***/ },
/* 47 */
/*!*********************************************************!*\
  !*** ./~/core-js/library/modules/_set-to-string-tag.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(/*! ./_object-dp */ 19).f
	  , has = __webpack_require__(/*! ./_has */ 29)
	  , TAG = __webpack_require__(/*! ./_wks */ 48)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 48 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_wks.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(/*! ./_shared */ 43)('wks')
	  , uid        = __webpack_require__(/*! ./_uid */ 44)
	  , Symbol     = __webpack_require__(/*! ./_global */ 14).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 49 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-gpo.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(/*! ./_has */ 29)
	  , toObject    = __webpack_require__(/*! ./_to-object */ 50)
	  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 42)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 50 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_to-object.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(/*! ./_defined */ 10);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 51 */
/*!*******************************************************!*\
  !*** ./~/core-js/library/modules/web.dom.iterable.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./es6.array.iterator */ 52);
	var global        = __webpack_require__(/*! ./_global */ 14)
	  , hide          = __webpack_require__(/*! ./_hide */ 18)
	  , Iterators     = __webpack_require__(/*! ./_iterators */ 30)
	  , TO_STRING_TAG = __webpack_require__(/*! ./_wks */ 48)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 52 */
/*!*********************************************************!*\
  !*** ./~/core-js/library/modules/es6.array.iterator.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ 53)
	  , step             = __webpack_require__(/*! ./_iter-step */ 54)
	  , Iterators        = __webpack_require__(/*! ./_iterators */ 30)
	  , toIObject        = __webpack_require__(/*! ./_to-iobject */ 36);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(/*! ./_iter-define */ 11)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 53 */
/*!**********************************************************!*\
  !*** ./~/core-js/library/modules/_add-to-unscopables.js ***!
  \**********************************************************/
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 54 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_iter-step.js ***!
  \*************************************************/
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 55 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_wks-ext.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(/*! ./_wks */ 48);

/***/ },
/* 56 */
/*!*******************************************!*\
  !*** ./~/babel-runtime/core-js/symbol.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ 57), __esModule: true };

/***/ },
/* 57 */
/*!**********************************************!*\
  !*** ./~/core-js/library/fn/symbol/index.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.symbol */ 58);
	__webpack_require__(/*! ../../modules/es6.object.to-string */ 69);
	__webpack_require__(/*! ../../modules/es7.symbol.async-iterator */ 70);
	__webpack_require__(/*! ../../modules/es7.symbol.observable */ 71);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 15).Symbol;

/***/ },
/* 58 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/es6.symbol.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(/*! ./_global */ 14)
	  , has            = __webpack_require__(/*! ./_has */ 29)
	  , DESCRIPTORS    = __webpack_require__(/*! ./_descriptors */ 23)
	  , $export        = __webpack_require__(/*! ./_export */ 13)
	  , redefine       = __webpack_require__(/*! ./_redefine */ 28)
	  , META           = __webpack_require__(/*! ./_meta */ 59).KEY
	  , $fails         = __webpack_require__(/*! ./_fails */ 24)
	  , shared         = __webpack_require__(/*! ./_shared */ 43)
	  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 47)
	  , uid            = __webpack_require__(/*! ./_uid */ 44)
	  , wks            = __webpack_require__(/*! ./_wks */ 48)
	  , wksExt         = __webpack_require__(/*! ./_wks-ext */ 55)
	  , wksDefine      = __webpack_require__(/*! ./_wks-define */ 60)
	  , keyOf          = __webpack_require__(/*! ./_keyof */ 61)
	  , enumKeys       = __webpack_require__(/*! ./_enum-keys */ 62)
	  , isArray        = __webpack_require__(/*! ./_is-array */ 65)
	  , anObject       = __webpack_require__(/*! ./_an-object */ 20)
	  , toIObject      = __webpack_require__(/*! ./_to-iobject */ 36)
	  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 26)
	  , createDesc     = __webpack_require__(/*! ./_property-desc */ 27)
	  , _create        = __webpack_require__(/*! ./_object-create */ 32)
	  , gOPNExt        = __webpack_require__(/*! ./_object-gopn-ext */ 66)
	  , $GOPD          = __webpack_require__(/*! ./_object-gopd */ 68)
	  , $DP            = __webpack_require__(/*! ./_object-dp */ 19)
	  , $keys          = __webpack_require__(/*! ./_object-keys */ 34)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(/*! ./_object-gopn */ 67).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(/*! ./_object-pie */ 64).f  = $propertyIsEnumerable;
	  __webpack_require__(/*! ./_object-gops */ 63).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(/*! ./_library */ 12)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ 18)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 59 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_meta.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(/*! ./_uid */ 44)('meta')
	  , isObject = __webpack_require__(/*! ./_is-object */ 21)
	  , has      = __webpack_require__(/*! ./_has */ 29)
	  , setDesc  = __webpack_require__(/*! ./_object-dp */ 19).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(/*! ./_fails */ 24)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 60 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_wks-define.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(/*! ./_global */ 14)
	  , core           = __webpack_require__(/*! ./_core */ 15)
	  , LIBRARY        = __webpack_require__(/*! ./_library */ 12)
	  , wksExt         = __webpack_require__(/*! ./_wks-ext */ 55)
	  , defineProperty = __webpack_require__(/*! ./_object-dp */ 19).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 61 */
/*!*********************************************!*\
  !*** ./~/core-js/library/modules/_keyof.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(/*! ./_object-keys */ 34)
	  , toIObject = __webpack_require__(/*! ./_to-iobject */ 36);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 62 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_enum-keys.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(/*! ./_object-keys */ 34)
	  , gOPS    = __webpack_require__(/*! ./_object-gops */ 63)
	  , pIE     = __webpack_require__(/*! ./_object-pie */ 64);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 63 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-gops.js ***!
  \***************************************************/
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 64 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-pie.js ***!
  \**************************************************/
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 65 */
/*!************************************************!*\
  !*** ./~/core-js/library/modules/_is-array.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(/*! ./_cof */ 38);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 66 */
/*!*******************************************************!*\
  !*** ./~/core-js/library/modules/_object-gopn-ext.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 36)
	  , gOPN      = __webpack_require__(/*! ./_object-gopn */ 67).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 67 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-gopn.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(/*! ./_object-keys-internal */ 35)
	  , hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ 45).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 68 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-gopd.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(/*! ./_object-pie */ 64)
	  , createDesc     = __webpack_require__(/*! ./_property-desc */ 27)
	  , toIObject      = __webpack_require__(/*! ./_to-iobject */ 36)
	  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 26)
	  , has            = __webpack_require__(/*! ./_has */ 29)
	  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 22)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(/*! ./_descriptors */ 23) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 69 */
/*!***********************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.to-string.js ***!
  \***********************************************************/
/***/ function(module, exports) {



/***/ },
/* 70 */
/*!****************************************************************!*\
  !*** ./~/core-js/library/modules/es7.symbol.async-iterator.js ***!
  \****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./_wks-define */ 60)('asyncIterator');

/***/ },
/* 71 */
/*!************************************************************!*\
  !*** ./~/core-js/library/modules/es7.symbol.observable.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./_wks-define */ 60)('observable');

/***/ },
/* 72 */
/*!*********************************************!*\
  !*** ./~/babel-runtime/helpers/inherits.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ 73);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(/*! ../core-js/object/create */ 77);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 4);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 73 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/core-js/object/set-prototype-of.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ 74), __esModule: true };

/***/ },
/* 74 */
/*!*********************************************************!*\
  !*** ./~/core-js/library/fn/object/set-prototype-of.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.set-prototype-of */ 75);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 15).Object.setPrototypeOf;

/***/ },
/* 75 */
/*!******************************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.set-prototype-of.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(/*! ./_export */ 13);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(/*! ./_set-proto */ 76).set});

/***/ },
/* 76 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_set-proto.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(/*! ./_is-object */ 21)
	  , anObject = __webpack_require__(/*! ./_an-object */ 20);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(/*! ./_ctx */ 16)(Function.call, __webpack_require__(/*! ./_object-gopd */ 68).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 77 */
/*!**************************************************!*\
  !*** ./~/babel-runtime/core-js/object/create.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ 78), __esModule: true };

/***/ },
/* 78 */
/*!***********************************************!*\
  !*** ./~/core-js/library/fn/object/create.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.create */ 79);
	var $Object = __webpack_require__(/*! ../../modules/_core */ 15).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 79 */
/*!********************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.create.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(/*! ./_export */ 13)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(/*! ./_object-create */ 32)});

/***/ },
/* 80 */
/*!***************************************************!*\
  !*** ./~/babel-runtime/helpers/classCallCheck.js ***!
  \***************************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 81 */
/*!************************************!*\
  !*** ./~/snake-case/snake-case.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var noCase = __webpack_require__(/*! no-case */ 82)
	
	/**
	 * Snake case a string.
	 *
	 * @param  {string} value
	 * @param  {string} [locale]
	 * @return {string}
	 */
	module.exports = function (value, locale) {
	  return noCase(value, locale, '_')
	}


/***/ },
/* 82 */
/*!******************************!*\
  !*** ./~/no-case/no-case.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var lowerCase = __webpack_require__(/*! lower-case */ 83)
	
	var NON_WORD_REGEXP = __webpack_require__(/*! ./vendor/non-word-regexp */ 84)
	var CAMEL_CASE_REGEXP = __webpack_require__(/*! ./vendor/camel-case-regexp */ 85)
	var CAMEL_CASE_UPPER_REGEXP = __webpack_require__(/*! ./vendor/camel-case-upper-regexp */ 86)
	
	/**
	 * Sentence case a string.
	 *
	 * @param  {string} str
	 * @param  {string} locale
	 * @param  {string} replacement
	 * @return {string}
	 */
	module.exports = function (str, locale, replacement) {
	  if (str == null) {
	    return ''
	  }
	
	  replacement = replacement || ' '
	
	  function replace (match, index, value) {
	    if (index === 0 || index === (value.length - match.length)) {
	      return ''
	    }
	
	    return replacement
	  }
	
	  str = String(str)
	    // Support camel case ("camelCase" -> "camel Case").
	    .replace(CAMEL_CASE_REGEXP, '$1 $2')
	    // Support odd camel case ("CAMELCase" -> "CAMEL Case").
	    .replace(CAMEL_CASE_UPPER_REGEXP, '$1 $2')
	    // Remove all non-word characters and replace with a single space.
	    .replace(NON_WORD_REGEXP, replace)
	
	  // Lower case the entire string.
	  return lowerCase(str, locale)
	}


/***/ },
/* 83 */
/*!************************************!*\
  !*** ./~/lower-case/lower-case.js ***!
  \************************************/
/***/ function(module, exports) {

	/**
	 * Special language-specific overrides.
	 *
	 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
	 *
	 * @type {Object}
	 */
	var LANGUAGES = {
	  tr: {
	    regexp: /\u0130|\u0049|\u0049\u0307/g,
	    map: {
	      '\u0130': '\u0069',
	      '\u0049': '\u0131',
	      '\u0049\u0307': '\u0069'
	    }
	  },
	  az: {
	    regexp: /[\u0130]/g,
	    map: {
	      '\u0130': '\u0069',
	      '\u0049': '\u0131',
	      '\u0049\u0307': '\u0069'
	    }
	  },
	  lt: {
	    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
	    map: {
	      '\u0049': '\u0069\u0307',
	      '\u004A': '\u006A\u0307',
	      '\u012E': '\u012F\u0307',
	      '\u00CC': '\u0069\u0307\u0300',
	      '\u00CD': '\u0069\u0307\u0301',
	      '\u0128': '\u0069\u0307\u0303'
	    }
	  }
	}
	
	/**
	 * Lowercase a string.
	 *
	 * @param  {String} str
	 * @return {String}
	 */
	module.exports = function (str, locale) {
	  var lang = LANGUAGES[locale]
	
	  str = str == null ? '' : String(str)
	
	  if (lang) {
	    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
	  }
	
	  return str.toLowerCase()
	}


/***/ },
/* 84 */
/*!*********************************************!*\
  !*** ./~/no-case/vendor/non-word-regexp.js ***!
  \*********************************************/
/***/ function(module, exports) {

	module.exports = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g


/***/ },
/* 85 */
/*!***********************************************!*\
  !*** ./~/no-case/vendor/camel-case-regexp.js ***!
  \***********************************************/
/***/ function(module, exports) {

	module.exports = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g


/***/ },
/* 86 */
/*!*****************************************************!*\
  !*** ./~/no-case/vendor/camel-case-upper-regexp.js ***!
  \*****************************************************/
/***/ function(module, exports) {

	module.exports = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A]+)([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g


/***/ },
/* 87 */
/*!*******************************!*\
  !*** ./~/deep-equal/index.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(/*! ./lib/keys.js */ 88);
	var isArguments = __webpack_require__(/*! ./lib/is_arguments.js */ 89);
	
	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	
	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();
	
	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;
	
	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	}
	
	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}
	
	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}
	
	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return typeof a === typeof b;
	}


/***/ },
/* 88 */
/*!**********************************!*\
  !*** ./~/deep-equal/lib/keys.js ***!
  \**********************************/
/***/ function(module, exports) {

	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;
	
	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}


/***/ },
/* 89 */
/*!******************************************!*\
  !*** ./~/deep-equal/lib/is_arguments.js ***!
  \******************************************/
/***/ function(module, exports) {

	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';
	
	exports = module.exports = supportsArgumentsClass ? supported : unsupported;
	
	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};
	
	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	};


/***/ },
/* 90 */
/*!********************************!*\
  !*** ./src/util/check-args.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = checkArgs;
	
	var _ordinal = __webpack_require__(/*! ./ordinal.js */ 91);
	
	var _ordinal2 = _interopRequireDefault(_ordinal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Validation helper
	function checkArgs(name, args) {
	  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  var _ref$nullable = _ref.nullable;
	  var nullable = _ref$nullable === undefined ? false : _ref$nullable;
	  var _ref$minArgs = _ref.minArgs;
	  var minArgs = _ref$minArgs === undefined ? 1 : _ref$minArgs;
	  var _ref$maxArgs = _ref.maxArgs;
	  var maxArgs = _ref$maxArgs === undefined ? 1 : _ref$maxArgs;
	
	  if (minArgs === maxArgs && args.length !== minArgs) {
	    var plural = minArgs === 1 ? '' : 's';
	    throw new Error(name + ' must receive exactly ' + minArgs + ' argument' + plural);
	  }
	  if (args.length < minArgs) {
	    var plural1 = minArgs === 1 ? '' : 's';
	    throw new Error(name + ' must receive at least ' + minArgs + ' argument' + plural1 + '.');
	  }
	  if (args.length > maxArgs) {
	    var plural2 = maxArgs === 1 ? '' : 's';
	    throw new Error(name + ' accepts at most ' + maxArgs + ' argument' + plural2 + '.');
	  }
	  for (var i = 0; i < args.length; i++) {
	    if (!nullable && args[i] === null) {
	      var ordinality = maxArgs !== 1 ? ' ' + (0, _ordinal2.default)(i + 1) : '';
	      throw new Error('The' + ordinality + ' argument to ' + name + ' must be non-null');
	    }
	    if (args[i] === undefined) {
	      throw new Error('The ' + (0, _ordinal2.default)(i + 1) + ' argument to ' + name + ' must be defined');
	    }
	  }
	}

/***/ },
/* 91 */
/*!*****************************!*\
  !*** ./src/util/ordinal.js ***!
  \*****************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.default = ordinal;
	function ordinal(x) {
	  if ([11, 12, 13].indexOf(x) !== -1) {
	    return x + "th";
	  } else if (x % 10 === 1) {
	    return x + "st";
	  } else if (x % 10 === 2) {
	    return x + "nd";
	  } else if (x % 10 === 3) {
	    return x + "rd";
	  }
	  return x + "th";
	}

/***/ },
/* 92 */
/*!***************************************!*\
  !*** ./src/util/valid-index-value.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 4);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	exports.default = validIndexValue;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Checks whether the return value is a valid primary or secondary
	// index value in RethinkDB.
	function validIndexValue(val) {
	  if (val === null) {
	    return false;
	  }
	  if (['boolean', 'number', 'string'].indexOf(typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) !== -1) {
	    return true;
	  }
	  if (val instanceof ArrayBuffer) {
	    return true;
	  }
	  if (val instanceof Date) {
	    return true;
	  }
	  if (Array.isArray(val)) {
	    var _ret = function () {
	      var isValid = true;
	      val.forEach(function (v) {
	        isValid = isValid && validIndexValue(v);
	      });
	      return {
	        v: isValid
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
	  }
	  return false;
	}

/***/ },
/* 93 */
/*!******************************!*\
  !*** ./src/serialization.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 4);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	exports.deserialize = deserialize;
	exports.serialize = serialize;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var PRIMITIVES = ['string', 'number', 'boolean', 'function', 'symbol'];
	
	function modifyObject(doc) {
	  Object.keys(doc).forEach(function (key) {
	    doc[key] = deserialize(doc[key]);
	  });
	  return doc;
	}
	
	function deserialize(value) {
	  if (value == null) {
	    return value;
	  } else if (PRIMITIVES.indexOf(typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) !== -1) {
	    return value;
	  } else if (Array.isArray(value)) {
	    return value.map(deserialize);
	  } else if (value.$reql_type$ === 'TIME') {
	    var date = new Date();
	    date.setTime(value.epoch_time * 1000);
	    return date;
	  } else {
	    return modifyObject(value);
	  }
	}
	
	function jsonifyObject(doc) {
	  Object.keys(doc).forEach(function (key) {
	    doc[key] = serialize(doc[key]);
	  });
	  return doc;
	}
	
	function serialize(value) {
	  if (value == null) {
	    return value;
	  } else if (PRIMITIVES.indexOf(typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) !== -1) {
	    return value;
	  } else if (Array.isArray(value)) {
	    return value.map(serialize);
	  } else if (value instanceof Date) {
	    return {
	      $reql_type$: 'TIME',
	      epoch_time: value.getTime() / 1000,
	      // Rethink will serialize this as "+00:00", but accepts Z
	      timezone: 'Z'
	    };
	  } else {
	    return jsonifyObject(value);
	  }
	}

/***/ },
/* 94 */
/*!*************************************!*\
  !*** ./src/hacks/watch-rewrites.js ***!
  \*************************************/
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.default = watchRewrites;
	/*
	 Some common queries run on an entire collection or on a collection of
	 indeterminate size. RethinkDB doesn't actually keep track of the
	 ordering of these queries when sending changes. The initial changes
	 will be ordered, but subsequent changes come in arbitrary order and
	 don't respect the ordering of the query. So, for convenience, we add
	 a very high limit so that the server will keep track of the order for
	 us.
	
	 Note: queries like collection.order(field).watch are not reasonable
	 in production systems. You should add an explicit limit.
	*/
	
	function watchRewrites(self, query) {
	  // The only query type at the moment that doesn't get these rewrites
	  // is find, since it returns a single document
	  if (query.find === undefined && query.order !== undefined && query.limit === undefined) {
	    var limit = self.constructor.IMPLICIT_LIMIT || 100000;
	    // Need to copy the object, since it could be reused
	    return Object.assign({ limit: limit }, query);
	  } else {
	    return query;
	  }
	}

/***/ },
/* 95 */
/*!***********************!*\
  !*** ./src/socket.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.HorizonSocket = undefined;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 80);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 3);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 72);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _AsyncSubject = __webpack_require__(/*! rxjs/AsyncSubject */ 1);
	
	var _BehaviorSubject = __webpack_require__(/*! rxjs/BehaviorSubject */ 1);
	
	var _WebSocketSubject2 = __webpack_require__(/*! rxjs/observable/dom/WebSocketSubject */ 1);
	
	var _Observable = __webpack_require__(/*! rxjs/Observable */ 1);
	
	var _Subscription = __webpack_require__(/*! rxjs/Subscription */ 1);
	
	__webpack_require__(/*! rxjs/add/observable/merge */ 1);
	
	__webpack_require__(/*! rxjs/add/observable/timer */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/filter */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/share */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/ignoreElements */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/concat */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/takeWhile */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/publish */ 1);
	
	var _serialization = __webpack_require__(/*! ./serialization.js */ 93);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var PROTOCOL_VERSION = 'rethinkdb-horizon-v0';
	
	// Before connecting the first time
	var STATUS_UNCONNECTED = { type: 'unconnected' };
	// After the websocket is opened and handshake is completed
	var STATUS_READY = { type: 'ready' };
	// After unconnected, maybe before or after connected. Any socket level error
	var STATUS_ERROR = { type: 'error' };
	// Occurs when the socket closes
	var STATUS_DISCONNECTED = { type: 'disconnected' };
	
	var ProtocolError = function (_Error) {
	  (0, _inherits3.default)(ProtocolError, _Error);
	
	  function ProtocolError(msg, errorCode) {
	    (0, _classCallCheck3.default)(this, ProtocolError);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, _Error.call(this, msg));
	
	    _this.errorCode = errorCode;
	    return _this;
	  }
	
	  ProtocolError.prototype.toString = function toString() {
	    return this.message + ' (Code: ' + this.errorCode + ')';
	  };
	
	  return ProtocolError;
	}(Error);
	
	// Wraps native websockets with a Subject, which is both an Subscriber
	// and an Observable (it is bi-directional after all!). This version
	// is based on the rxjs.observable.dom.WebSocketSubject implementation.
	
	
	var HorizonSocket = exports.HorizonSocket = function (_WebSocketSubject) {
	  (0, _inherits3.default)(HorizonSocket, _WebSocketSubject);
	
	  // Deserializes a message from a string. Overrides the version
	  // implemented in WebSocketSubject
	  HorizonSocket.prototype.resultSelector = function resultSelector(e) {
	    return (0, _serialization.deserialize)(JSON.parse(e.data));
	  };
	
	  // We're overriding the next defined in AnonymousSubject so we
	  // always serialize the value. When this is called a message will be
	  // sent over the socket to the server.
	
	
	  HorizonSocket.prototype.next = function next(value) {
	    var request = JSON.stringify((0, _serialization.serialize)(value));
	    _WebSocketSubject.prototype.next.call(this, request);
	  };
	
	  function HorizonSocket() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var url = _ref.url;
	    var handshakeMaker = _ref.handshakeMaker;
	    var _ref$keepalive = _ref.keepalive;
	    var keepalive = _ref$keepalive === undefined ? 60 : _ref$keepalive;
	    var _ref$WebSocketCtor = _ref.WebSocketCtor;
	    var WebSocketCtor = _ref$WebSocketCtor === undefined ? WebSocket : _ref$WebSocketCtor;
	    (0, _classCallCheck3.default)(this, HorizonSocket);
	
	    // Completes or errors based on handshake success. Buffers
	    // handshake response for later subscribers (like a Promise)
	    var _this2 = (0, _possibleConstructorReturn3.default)(this, _WebSocketSubject.call(this, {
	      url: url,
	      protocol: PROTOCOL_VERSION,
	      WebSocketCtor: WebSocketCtor,
	      openObserver: {
	        next: function next() {
	          return _this2.sendHandshake();
	        }
	      },
	      closeObserver: {
	        next: function next() {
	          if (_this2._handshakeSub) {
	            _this2._handshakeSub.unsubscribe();
	            _this2._handshakeSub = null;
	          }
	          _this2.status.next(STATUS_DISCONNECTED);
	        }
	      }
	    }));
	
	    _this2.handshake = new _AsyncSubject.AsyncSubject();
	    _this2._handshakeMaker = handshakeMaker;
	    _this2._handshakeSub = null;
	
	    _this2.keepalive = _Observable.Observable.timer(keepalive * 1000, keepalive * 1000).map(function (n) {
	      return _this2.makeRequest({ type: 'keepalive' }).subscribe();
	    }).publish();
	
	    // This is used to emit status changes that others can hook into.
	    _this2.status = new _BehaviorSubject.BehaviorSubject(STATUS_UNCONNECTED);
	    // Keep track of subscribers so we's can decide when to
	    // unsubscribe.
	    _this2.requestCounter = 0;
	    // A map from request_ids to an object with metadata about the
	    // request. Eventually, this should allow re-sending requests when
	    // reconnecting.
	    _this2.activeRequests = new Map();
	    _this2._output.subscribe({
	      // This emits if the entire socket errors (usually due to
	      // failure to connect)
	      error: function error() {
	        return _this2.status.next(STATUS_ERROR);
	      }
	    });
	    return _this2;
	  }
	
	  HorizonSocket.prototype.deactivateRequest = function deactivateRequest(req) {
	    var _this3 = this;
	
	    return function () {
	      _this3.activeRequests.delete(req.request_id);
	      return { request_id: req.request_id, type: 'end_subscription' };
	    };
	  };
	
	  HorizonSocket.prototype.activateRequest = function activateRequest(req) {
	    var _this4 = this;
	
	    return function () {
	      _this4.activeRequests.set(req.request_id, req);
	      return req;
	    };
	  };
	
	  HorizonSocket.prototype.filterRequest = function filterRequest(req) {
	    return function (resp) {
	      return resp.request_id === req.request_id;
	    };
	  };
	
	  HorizonSocket.prototype.getRequest = function getRequest(request) {
	    return Object.assign({ request_id: this.requestCounter++ }, request);
	  };
	
	  // This is a trimmed-down version of multiplex that only listens for
	  // the handshake requestId. It also starts the keepalive observable
	  // and cleans up after it when the handshake is cleaned up.
	
	
	  HorizonSocket.prototype.sendHandshake = function sendHandshake() {
	    var _this5 = this;
	
	    if (!this._handshakeSub) {
	      this._handshakeSub = this.makeRequest(this._handshakeMaker()).subscribe({
	        next: function next(n) {
	          if (n.error) {
	            _this5.status.next(STATUS_ERROR);
	            _this5.handshake.error(new ProtocolError(n.error, n.error_code));
	          } else {
	            _this5.status.next(STATUS_READY);
	            _this5.handshake.next(n);
	            _this5.handshake.complete();
	          }
	        },
	        error: function error(e) {
	          _this5.status.next(STATUS_ERROR);
	          _this5.handshake.error(e);
	        }
	      });
	
	      // Start the keepalive and make sure it's
	      // killed when the handshake is cleaned up
	      this._handshakeSub.add(this.keepalive.connect());
	    }
	    return this.handshake;
	  };
	
	  // Incorporates shared logic between the inital handshake request and
	  // all subsequent requests.
	  // * Generates a request id and filters by it
	  // * Send `end_subscription` when observable is unsubscribed
	
	
	  HorizonSocket.prototype.makeRequest = function makeRequest(rawRequest) {
	    var request = this.getRequest(rawRequest);
	
	    return _WebSocketSubject.prototype.multiplex.call(this, this.activateRequest(request), this.deactivateRequest(request), this.filterRequest(request));
	  };
	
	  // Wrapper around the makeRequest with the following additional
	  // features we need for horizon's protocol:
	  // * Sends handshake on subscription if it hasn't happened already
	  // * Wait for the handshake to complete before sending the request
	  // * Errors when a document with an `error` field is received
	  // * Completes when `state: complete` is received
	  // * Emits `state: synced` as a separate document for easy filtering
	  // * Reference counts subscriptions
	
	
	  HorizonSocket.prototype.hzRequest = function hzRequest(rawRequest) {
	    return this.sendHandshake().ignoreElements().concat(this.makeRequest(rawRequest)).concatMap(function (resp) {
	      if (resp.error !== undefined) {
	        throw new ProtocolError(resp.error, resp.error_code);
	      }
	      var data = resp.data || [];
	
	      if (resp.state !== undefined) {
	        // Create a little dummy object for sync notifications
	        data.push({
	          type: 'state',
	          state: resp.state
	        });
	      }
	
	      return data;
	    }).share();
	  };
	
	  return HorizonSocket;
	}(_WebSocketSubject2.WebSocketSubject);

/***/ },
/* 96 */
/*!*********************!*\
  !*** ./src/auth.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.TokenStorage = exports.FakeStorage = undefined;
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 4);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 80);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	exports.authEndpoint = authEndpoint;
	exports.clearAuthTokens = clearAuthTokens;
	
	var _queryParse = __webpack_require__(/*! ./util/query-parse */ 97);
	
	var _queryParse2 = _interopRequireDefault(_queryParse);
	
	var _Observable = __webpack_require__(/*! rxjs/Observable */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/do */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/map */ 1);
	
	__webpack_require__(/*! rxjs/add/observable/dom/ajax */ 1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var HORIZON_JWT = 'horizon-jwt';
	
	/** @this Horizon **/
	function authEndpoint(name) {
	  var _this = this;
	
	  var endpointForName = function endpointForName(methods) {
	    if (methods.hasOwnProperty(name)) {
	      return _this._root + methods[name];
	    } else {
	      throw new Error('Unconfigured auth type: ' + name);
	    }
	  };
	  if (!this._authMethods) {
	    return _Observable.Observable.ajax(this._horizonPath + '/auth_methods').map(function (ajax) {
	      return ajax.response;
	    }).do(function (authMethods) {
	      _this._authMethods = authMethods;
	    }).map(endpointForName);
	  } else {
	    return _Observable.Observable.of(this._authMethods).map(endpointForName);
	  }
	}
	
	// Simple shim to make a Map look like local/session storage
	
	var FakeStorage = exports.FakeStorage = function () {
	  function FakeStorage() {
	    (0, _classCallCheck3.default)(this, FakeStorage);
	    this._storage = new Map();
	  }
	
	  FakeStorage.prototype.setItem = function setItem(a, b) {
	    return this._storage.set(a, b);
	  };
	
	  FakeStorage.prototype.getItem = function getItem(a) {
	    return this._storage.get(a);
	  };
	
	  FakeStorage.prototype.removeItem = function removeItem(a) {
	    return this._storage.delete(a);
	  };
	
	  return FakeStorage;
	}();
	
	function getStorage() {
	  var storeLocally = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	  var storage = void 0;
	  try {
	    if (!storeLocally || (typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) !== 'object' || window.localStorage === undefined) {
	      storage = new FakeStorage();
	    } else {
	      // Mobile safari in private browsing has a localStorage, but it
	      // has a size limit of 0
	      window.localStorage.setItem('$$fake', 1);
	      window.localStorage.removeItem('$$fake');
	      storage = window.localStorage;
	    }
	  } catch (error) {
	    if (window.sessionStorage === undefined) {
	      storage = new FakeStorage();
	    } else {
	      storage = window.sessionStorage;
	    }
	  }
	  return storage;
	}
	
	var TokenStorage = exports.TokenStorage = function () {
	  function TokenStorage() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$authType = _ref.authType;
	    var authType = _ref$authType === undefined ? 'token' : _ref$authType;
	    var _ref$storage = _ref.storage;
	    var storage = _ref$storage === undefined ? getStorage(authType.storeLocally) : _ref$storage;
	    var _ref$path = _ref.path;
	    var path = _ref$path === undefined ? 'horizon' : _ref$path;
	    (0, _classCallCheck3.default)(this, TokenStorage);
	
	    this._storage = storage;
	    this._path = path;
	    if (typeof authType === 'string') {
	      this._authType = authType;
	    } else {
	      this._authType = 'token';
	      this.set(authType.token);
	    }
	  }
	
	  TokenStorage.prototype._getHash = function _getHash() {
	    var val = this._storage.getItem(HORIZON_JWT);
	    if (val == null) {
	      return {};
	    } else {
	      return JSON.parse(val);
	    }
	  };
	
	  TokenStorage.prototype._setHash = function _setHash(hash) {
	    this._storage.setItem(HORIZON_JWT, JSON.stringify(hash));
	  };
	
	  TokenStorage.prototype.set = function set(jwt) {
	    var current = this._getHash();
	    current[this._path] = jwt;
	    this._setHash(current);
	  };
	
	  TokenStorage.prototype.get = function get() {
	    return this._getHash()[this._path];
	  };
	
	  TokenStorage.prototype.remove = function remove() {
	    var current = this._getHash();
	    delete current[this._path];
	    this._setHash(current);
	  };
	
	  TokenStorage.prototype.setAuthFromQueryParams = function setAuthFromQueryParams() {
	    var parsed = typeof window !== 'undefined' && typeof window.location !== 'undefined' ? (0, _queryParse2.default)(window.location.search) : {};
	
	    if (parsed.horizon_token != null) {
	      this.set(parsed.horizon_token);
	    }
	  };
	
	  // Handshake types are implemented here
	
	
	  TokenStorage.prototype.handshake = function handshake() {
	    // If we have a token, we should send it rather than requesting a
	    // new one
	    var token = this.get();
	    if (token != null) {
	      return { method: 'token', token: token };
	    } else if (this._authType === 'token') {
	      throw new Error('Attempting to authenticate with a token, but no token is present');
	    } else {
	      return { method: this._authType };
	    }
	  };
	
	  // Whether there is an auth token for the provided authType
	
	
	  TokenStorage.prototype.hasAuthToken = function hasAuthToken() {
	    var token = this.get();
	    if (!token) {
	      return false;
	    }
	    try {
	      var meta = JSON.parse(atob(token.split('.')[1]));
	      var exp = meta.exp;
	      var now = new Date().getTime() / 1000;
	      return now < exp;
	    } catch (e) {
	      return false;
	    }
	  };
	
	  return TokenStorage;
	}();
	
	function clearAuthTokens() {
	  return getStorage().removeItem(HORIZON_JWT);
	}

/***/ },
/* 97 */
/*!*********************************!*\
  !*** ./src/util/query-parse.js ***!
  \*********************************/
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	exports.default = function (str) {
	  if (typeof str !== 'string') {
	    return {};
	  }
	
	  var str2 = str.trim().replace(/^(\?|#|&)/, '');
	
	  if (!str2) {
	    return {};
	  }
	
	  return str2.split('&').reduce(function (ret, param) {
	    var parts = param.replace(/\+/g, ' ').split('=');
	    // Firefox (pre 40) decodes `%3D` to `=`
	    // https://github.com/sindresorhus/query-string/pull/37
	    var key = parts.shift();
	    var val = parts.length > 0 ? parts.join('=') : undefined;
	
	    var key2 = decodeURIComponent(key);
	
	    // missing `=` should be `null`:
	    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
	    var val2 = val === undefined ? null : decodeURIComponent(val);
	
	    if (!ret.hasOwnProperty(key2)) {
	      ret[key2] = val2;
	    } else if (Array.isArray(ret[key2])) {
	      ret[key2].push(val2);
	    } else {
	      ret[key2] = [ret[key2], val2];
	    }
	
	    return ret;
	  }, {});
	};

/***/ },
/* 98 */
/*!**********************!*\
  !*** ./src/model.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 80);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 4);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	exports.aggregate = aggregate;
	exports.model = model;
	
	var _Observable = __webpack_require__(/*! rxjs/Observable */ 1);
	
	__webpack_require__(/*! rxjs/add/observable/of */ 1);
	
	__webpack_require__(/*! rxjs/add/observable/forkJoin */ 1);
	
	__webpack_require__(/*! rxjs/add/observable/combineLatest */ 1);
	
	__webpack_require__(/*! rxjs/add/operator/map */ 1);
	
	var _isPlainObject = __webpack_require__(/*! is-plain-object */ 99);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Unlike normal queries' .watch(), we don't support rawChanges: true
	// for aggregates
	function checkWatchArgs(args) {
	  if (args.length > 0) {
	    throw new Error(".watch() on aggregates doesn't support arguments!");
	  }
	}
	
	// Other imports
	
	
	function isTerm(term) {
	  return typeof term.fetch === 'function' && typeof term.watch === 'function';
	}
	
	function isPromise(term) {
	  return typeof term.then === 'function';
	}
	
	function isObservable(term) {
	  return typeof term.subscribe === 'function' && typeof term.lift === 'function';
	}
	
	// Whether an object is primitive. We consider functions
	// non-primitives, lump Dates and ArrayBuffers into primitives.
	function isPrimitive(value) {
	  if (value === null) {
	    return true;
	  }
	  if (value === undefined) {
	    return false;
	  }
	  if (typeof value === 'function') {
	    return false;
	  }
	  if (['boolean', 'number', 'string'].indexOf(typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) !== -1) {
	    return true;
	  }
	  if (value instanceof Date || value instanceof ArrayBuffer) {
	    return true;
	  }
	  return false;
	}
	
	// Simple wrapper for primitives. Just emits the primitive
	
	var PrimitiveTerm = function () {
	  function PrimitiveTerm(value) {
	    (0, _classCallCheck3.default)(this, PrimitiveTerm);
	
	    this._value = value;
	  }
	
	  PrimitiveTerm.prototype.toString = function toString() {
	    return this._value.toString();
	  };
	
	  PrimitiveTerm.prototype.fetch = function fetch() {
	    return _Observable.Observable.of(this._value);
	  };
	
	  PrimitiveTerm.prototype.watch = function watch() {
	    for (var _len = arguments.length, watchArgs = Array(_len), _key = 0; _key < _len; _key++) {
	      watchArgs[_key] = arguments[_key];
	    }
	
	    checkWatchArgs(watchArgs);
	    return _Observable.Observable.of(this._value);
	  };
	
	  return PrimitiveTerm;
	}();
	
	// Simple wrapper for observables to normalize the
	// interface. Everything in an aggregate tree should be one of these
	// term-likes
	
	
	var ObservableTerm = function () {
	  function ObservableTerm(value) {
	    (0, _classCallCheck3.default)(this, ObservableTerm);
	
	    this._value = value;
	  }
	
	  ObservableTerm.prototype.toString = function toString() {
	    return this._value.toString();
	  };
	
	  ObservableTerm.prototype.fetch = function fetch() {
	    return _Observable.Observable.from(this._value);
	  };
	
	  ObservableTerm.prototype.watch = function watch() {
	    for (var _len2 = arguments.length, watchArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      watchArgs[_key2] = arguments[_key2];
	    }
	
	    checkWatchArgs(watchArgs);
	    return _Observable.Observable.from(this._value);
	  };
	
	  return ObservableTerm;
	}();
	
	// Handles aggregate syntax like [ query1, query2 ]
	
	
	var ArrayTerm = function () {
	  function ArrayTerm(value) {
	    (0, _classCallCheck3.default)(this, ArrayTerm);
	
	    // Ensure this._value is an array of Term
	    this._value = value.map(function (x) {
	      return aggregate(x);
	    });
	  }
	
	  ArrayTerm.prototype._reducer = function _reducer() {
	    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	      args[_key3] = arguments[_key3];
	    }
	
	    return args;
	  };
	
	  ArrayTerm.prototype._query = function _query(operation) {
	    return this._value.map(function (x) {
	      return x[operation]();
	    });
	  };
	
	  ArrayTerm.prototype.toString = function toString() {
	    return '[ ' + this._query('toString').join(', ') + ' ]';
	  };
	
	  ArrayTerm.prototype.fetch = function fetch() {
	    if (this._value.length === 0) {
	      return _Observable.Observable.empty();
	    }
	
	    var qs = this._query('fetch');
	    return _Observable.Observable.forkJoin.apply(_Observable.Observable, qs.concat([this._reducer]));
	  };
	
	  ArrayTerm.prototype.watch = function watch() {
	    for (var _len4 = arguments.length, watchArgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	      watchArgs[_key4] = arguments[_key4];
	    }
	
	    checkWatchArgs(watchArgs);
	
	    if (this._value.length === 0) {
	      return _Observable.Observable.empty();
	    }
	
	    var qs = this._query('watch');
	    return _Observable.Observable.combineLatest.apply(_Observable.Observable, qs.concat([this._reducer]));
	  };
	
	  return ArrayTerm;
	}();
	
	var AggregateTerm = function () {
	  function AggregateTerm(value) {
	    (0, _classCallCheck3.default)(this, AggregateTerm);
	
	    // Ensure this._value is an array of [ key, Term ] pairs
	    this._value = Object.keys(value).map(function (k) {
	      return [k, aggregate(value[k])];
	    });
	  }
	
	  AggregateTerm.prototype._reducer = function _reducer() {
	    for (var _len5 = arguments.length, pairs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	      pairs[_key5] = arguments[_key5];
	    }
	
	    return pairs.reduce(function (prev, _ref) {
	      var k = _ref[0];
	      var x = _ref[1];
	
	      prev[k] = x;
	      return prev;
	    }, {});
	  };
	
	  AggregateTerm.prototype._query = function _query(operation) {
	    return this._value.map(function (_ref2) {
	      var k = _ref2[0];
	      var term = _ref2[1];
	      return term[operation]().map(function (x) {
	        return [k, x];
	      });
	    });
	  };
	
	  AggregateTerm.prototype.toString = function toString() {
	    var s = this._value.map(function (_ref3) {
	      var k = _ref3[0];
	      var term = _ref3[1];
	      return '\'' + k + '\': ' + term;
	    });
	    return '{ ' + s.join(', ') + ' }';
	  };
	
	  AggregateTerm.prototype.fetch = function fetch() {
	    if (this._value.length === 0) {
	      return _Observable.Observable.of({});
	    }
	
	    var qs = this._query('fetch');
	    return _Observable.Observable.forkJoin.apply(_Observable.Observable, qs.concat([this._reducer]));
	  };
	
	  AggregateTerm.prototype.watch = function watch() {
	    for (var _len6 = arguments.length, watchArgs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	      watchArgs[_key6] = arguments[_key6];
	    }
	
	    checkWatchArgs(watchArgs);
	
	    if (this._value.length === 0) {
	      return _Observable.Observable.of({});
	    }
	
	    var qs = this._query('watch');
	    return _Observable.Observable.combineLatest.apply(_Observable.Observable, qs.concat([this._reducer]));
	  };
	
	  return AggregateTerm;
	}();
	
	function aggregate(spec) {
	  if (isTerm(spec)) {
	    return spec;
	  }
	  if (isObservable(spec) || isPromise(spec)) {
	    return new ObservableTerm(spec);
	  }
	  if (isPrimitive(spec)) {
	    return new PrimitiveTerm(spec);
	  }
	  if (Array.isArray(spec)) {
	    return new ArrayTerm(spec);
	  }
	  if ((0, _isPlainObject2.default)(spec)) {
	    return new AggregateTerm(spec);
	  }
	
	  throw new Error('Can\'t make an aggregate with ' + spec + ' in it');
	}
	
	function model(constructor) {
	  return function () {
	    return aggregate(constructor.apply(undefined, arguments));
	  };
	}

/***/ },
/* 99 */
/*!************************************!*\
  !*** ./~/is-plain-object/index.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	var isObject = __webpack_require__(/*! isobject */ 100);
	
	function isObjectObject(o) {
	  return isObject(o) === true
	    && Object.prototype.toString.call(o) === '[object Object]';
	}
	
	module.exports = function isPlainObject(o) {
	  var ctor,prot;
	  
	  if (isObjectObject(o) === false) return false;
	  
	  // If has modified constructor
	  ctor = o.constructor;
	  if (typeof ctor !== 'function') return false;
	  
	  // If has modified prototype
	  prot = ctor.prototype;
	  if (isObjectObject(prot) === false) return false;
	  
	  // If constructor does not have an Object-specific method
	  if (prot.hasOwnProperty('isPrototypeOf') === false) {
	    return false;
	  }
	  
	  // Most likely a plain Object
	  return true;
	};


/***/ },
/* 100 */
/*!*****************************!*\
  !*** ./~/isobject/index.js ***!
  \*****************************/
/***/ function(module, exports) {

	/*!
	 * isobject <https://github.com/jonschlinkert/isobject>
	 *
	 * Copyright (c) 2014-2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */
	
	'use strict';
	
	module.exports = function isObject(val) {
	  return val != null && typeof val === 'object'
	    && !Array.isArray(val);
	};


/***/ }
/******/ ])
});
;
//# sourceMappingURL=horizon-core-dev.js.map