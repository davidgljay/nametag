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
//# sourceMappingURL=query-parse.js.map