const facebook = require('./facebook')
const twitter = require('./twitter')
const local = require('./local')
const hash = require('./hash')
const google = require('./google')
const authCallback = require('./authCallBack')

module.exports = {
  facebook,
  local,
  twitter,
  google,
  hash,
  authCallback
}
