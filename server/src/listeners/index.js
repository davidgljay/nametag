const r = require('../../horizon/server/src/horizon.js').r
const {messageNotifs, dmNotifs} = require('./notifications')

module.exports = (reqlOptions) => {
  r.connect(reqlOptions).then((conn) => {
    require('./profileInfo')(conn)
    messageNotifs(conn)
    dmNotifs(conn)
  })
}
