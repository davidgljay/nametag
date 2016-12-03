const r = require('../../horizon/server/src/horizon.js').r

module.exports = (reqlOptions) => {
  r.connect(reqlOptions).then((conn) => {
    require('./profileInfo')(conn)
  })
}
