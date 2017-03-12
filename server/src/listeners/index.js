const r = require('../../horizon/server/src/horizon.js').r
const profileInfo = require('./profileInfo')
const {messageNotifs, dmNotifs} = require('./notifications')
const presence = require('./presence')

module.exports = (reqlOptions) => {
  r.connect(reqlOptions).then((conn) => {
    profileInfo(conn)
    messageNotifs(conn)
    dmNotifs(conn)
    presence(conn)
  })
}
