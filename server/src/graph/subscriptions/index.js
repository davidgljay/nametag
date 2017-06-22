const Nametags = require('./Nametags')
const Messages = require('./Messages')
const Rooms = require('./Rooms')
const Context = require('../context')

module.exports.activate = (conn) => {
  const context = new Context({}, conn)
  Nametags(context)
  Messages(context)
  Rooms(context)
}
