const passwordReset = require('./password-reset')
const emailConfirm = require('./email-confirm')
const badgeRequest = require('./badge-request')
const mention = require('./mention')
const publicRoom = require('./public-room')

module.exports = {
  passwordReset,
  emailConfirm,
  badgeRequest,
  mention,
  publicRoom
}
