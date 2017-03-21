const r = require('rethinkdb')

/**
 * Returns the messages from a particular room to display to a user. Also displays
 * direct messages to that user.
 * @param {Object} context     graph context
 * @param {String} room   the id of the room whose messages will be retrieved
 * @param {String} nametag the id of the nametag of the currently logged in user for this room
 */

const getRoomMessages = ({conn}, room, nametag) => Promise.all([
  r.db('nametag').table('messages').filter({room, recipient: null}).run(conn),
  r.db('nametag').table('messages').filter({room, recipient: nametag}).run(conn)
])
   .then(([messageCursor, dmCursor]) => Promise.all([
     messageCursor.toArray(),
     dmCursor.toArray()
   ]))
   .then(([messages, dms]) =>
      messages.concat(dms).sort((a, b) => b.created_at - a.created_at)
    )

 /**
  * Returns the messages from a particular author.
  * @param {Object} context  graph context
  * @param {String} nametag  the id of the nametag of the messages' author
  */

const getNametagMessages = ({conn}, nametag) =>
  r.db('nametag').table('messages').filter({author: nametag}).run(conn)

/**
 * Creates a message
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be created
 *
 **/

const create = ({conn}, msg) => {
  const message = Object.assign({}, msg, {createdAt: Date.now()})
  return r.db('nametag').table('messages').insert(message).run(conn)
}

module.exports = (context) => ({
  Messages: {
    getRoomMessages: (room, nametag) => getRoomMessages(context, room, nametag),
    getNametagMessages: (nametag) => getNametagMessages(context, nametag),
    create: (message) => create(context, message)
  }
})
