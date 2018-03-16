const passwordReset = require('./password-reset')
const emailConfirm = require('./email-confirm')
const badgeRequest = require('./badge-request')
const mention = require('./mention')
const dm = require('./dm')
const reply = require('./reply')
const announcement = require('./announcement')
const publicRoom = require('./public-room')
const hashLogin = require('./hash-login')
const roomApproval = require('./room-approval')
const volAction = require('./vol-action')
const contactForm = require('./contact-form')
const demoRequest = require('./demo-request')
const digest = require('./digest')
const donation = require('./donation')
const roomClone = require('./room-clone')
const modRoomJoin = require('./mod-room-join')

module.exports = {
  passwordReset,
  emailConfirm,
  badgeRequest,
  mention,
  reply,
  dm,
  publicRoom,
  roomApproval,
  hashLogin,
  announcement,
  digest,
  donation,
  volAction,
  contactForm,
  demoRequest,
  roomClone,
  modRoomJoin
}
