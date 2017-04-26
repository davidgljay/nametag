const facebook = require('./facebook')
const twitter = require('./twitter')
const local = require('./local')
const google = require('./google')
const authCallback = require('./authCallback')

module.exports = {
  facebook,
  local,
  twitter,
  google,
  authCallback
}
