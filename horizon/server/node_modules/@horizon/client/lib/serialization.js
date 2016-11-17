'use strict';

exports.__esModule = true;

var _typeof2 = require('babel-runtime/helpers/typeof');

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
//# sourceMappingURL=serialization.js.map