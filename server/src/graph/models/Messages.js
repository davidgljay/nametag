const r = require('rethinkdb')
const errors = require('../../errors')
const notification = require('../../notifications')

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

const create = (context, msg) => {
  const {conn, models: {Nametags}} = context
  const messageObj = Object.assign({}, msg, {createdAt: Date.now()})
  return r.db('nametag').table('messages').insert(messageObj).run(conn)
  .then((res) => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating message')
    }
    const message = Object.assign({}, message, {id: res.generated_keys[0]})
    return message
  })
  .then(message => Promise.all([
    checkMentions({conn}, message),
    message
  ])
  )
  .then(([res, message]) => {
    if (message.recipient) {
      return Nametags.addMention(message.recipient)
        .then(() => mentionNotif(context, message.recipient, message, 'DM'))
        .then(() => message)
    }
    return message
  })
}

/**
 * Checks a message for mentions
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be checked
 *
 **/

const checkMentions = ({conn, models: {Nametags}}, message) => {
  if (message.text.indexOf('@') === -1) { return null }

  return Nametags.getRoomNametags(message.room)
  .then((roomNametags) => {
    const splitMsg = message.text.split('@')
    let promises = []
    // For every mention, check every nametag in the room to see if it matches the name.
    roomNametags.toArray((err, nametags) => {
      if (err) { return false }
      for (let i = 0; i < splitMsg.length; i++) {
        const msg = splitMsg[i]
        for (let j = 0; j < nametags.length; j++) {
          const {name, id} = nametags[j]
          if (msg.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
            promises.push(
              Nametags.addMention(id)
              .then(() => mentionNotif({conn}, id, message, 'MENTION'))
            )
          }
        }
      }
      return true
    })

    return Promise.all(promises)
  })
}

/**
 * Sends a notification based on a mention
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be checked
 *
 **/

const mentionNotif = ({conn}, to, message, reason) => Promise.all([
  r.db('nametag').table('nametags').get(to).run(conn)
    .then(cursor => new Promise((resolve, reject) =>
      cursor.toArray((err, userNametags) => {
        if (err) { reject(err) }
        resolve(userNametags[0].user)
      })
    ))
    .then(user => r.db('nametag').table('users').get(user).run(conn)),
  r.db('nametag').table('rooms').get(message.room).run(conn),
  r.db('nametag').table('nametags').get(message.author).run(conn),
  message
])
.then(([user, room, sender, message]) => notification({
  reason,
  roomTitle: room.title,
  roomId: room.id,
  text: message.text.replace(/\*/g, ''),
  senderName: sender.name,
  icon: sender.icon
}, user.data.fcmToken)
)

module.exports = (context) => ({
  Messages: {
    getRoomMessages: (room, nametag) => getRoomMessages(context, room, nametag),
    getNametagMessages: (nametag) => getNametagMessages(context, nametag),
    create: (message) => create(context, message)
  }
})
