const profileInfo = require('./profileInfo')
const {messageNotifs, dmNotifs} = require('./notifications')
const presence = require('./presence')

module.exports = (conn) => {
  profileInfo(conn)
  messageNotifs(conn)
  dmNotifs(conn)
  presence(conn)
}
