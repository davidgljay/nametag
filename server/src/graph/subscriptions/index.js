const Nametags = require('./Nametags')
const Messages = require('./Messages')
const Rooms = require('./Rooms')

module.exports.activate = (conn) => {
  Nametags(conn)
  Messages(conn)
  Rooms(conn)
}
