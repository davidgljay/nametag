const horizon = require('../../horizon/server/src/horizon.js')

module.exports = (reqlOptions) => {
  const r = horizon.r
  r.connection(reqlOptions).then((conn) => {
    require('./profileInfo')(conn)
  })
}
