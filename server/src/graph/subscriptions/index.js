const Nametags = require('./Nametags')
const Messages = require('./Messages')

module.exports.activate = (conn) => {
  Nametags(conn)
  Messages(conn)
}
