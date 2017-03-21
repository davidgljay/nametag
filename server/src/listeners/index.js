const profileInfo = require('./profileInfo')
const presence = require('./presence')

module.exports = (conn) => {
  profileInfo(conn)
  presence(conn)
}
