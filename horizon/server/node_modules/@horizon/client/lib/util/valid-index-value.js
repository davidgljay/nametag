'use strict';

exports.__esModule = true;

var _typeof2 = require('babel-runtime/helpers/typeof');

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
//# sourceMappingURL=valid-index-value.js.map