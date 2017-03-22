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
    messages.concat(dms).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  )

 /**
  * Returns the messages from a particular author.
  * @param {Object} context  graph context
  * @param {String} nametag  the id of the nametag of the messages' author
  */

const getNametagMessages = ({conn}, nametag) =>
  r.db('nametag').table('messages').filter({author: nametag}).run(conn)

/**
 * Toggles the save boolean on a message.
 * @param {Object} context  graph context
 * @param {String} nametag  the id of the nametag of the messages' author
 */

const toggleSaved = ({conn}, id, saved) =>
 r.db('nametag').table('messages').get(id).update({saved}).run(conn)


/**
 * Creates a message
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be created
 *
 **/

const create = (context, msg) => {
  const {conn, models: {Nametags}} = context
  const messageObj = Object.assign({}, msg, {createdAt: new Date(), recipient: null})
  return r.db('nametag').table('messages').insert(messageObj).run(conn)
  .then((res) => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating message')
    }
    const message = Object.assign({}, messageObj, {id: res.generated_keys[0]})
    return message
  })
  .then(message => Promise.all([
    checkMentionsAndDMs(context, message),
    message
  ])
  )
  .then(([recipient, message]) => recipient ? Object.assign({}, message, {recipient}) : message)
}

/**
 * Checks a message for mentions and dms
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be checked
 *
 **/

const checkMentionsAndDMs = (context, message) => {
  const {Nametags} = context.models
  const dm = message.text.toLowerCase().slice(0,2) === 'd '
  const mentions = message.text.indexOf('@') > -1
  if ( !dm && !mentions) {
    return null
  }

  return Nametags.getRoomNametags(message.room)
  .then(nametags => {
    if (dm) {
      return setDm(context, nametags, message)
    } else if (mentions) {
      return checkMentions(context, nametags, message)
    }
  })
}

/**
 * Checks a message for mentions and dms
 *
 * @param {Object} nametags     the room's nametags
 * @param {Object} text         the text of the message to be checked
 *
 **/
const checkMentions = (context, nametags, message) =>  {
  const splitMsg = message.text.split('@')
  const {Nametags} = context.models
  let promises = []
  // For every mention, check every nametag in the room to see if it matches the name.
  for (let i = 0; i < splitMsg.length; i++) {
    const section = splitMsg[i]
    for (let j = 0; j < nametags.length; j++) {
      const {name, id} = nametags[j]
      if (section.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
        promises.push(
          Nametags.addMention(id)
          .then(() => mentionNotif(context, id, message, 'MENTION'))
        )
      }
    }
  }
  return Promise.all(promises)
}

/**
 * Checks sets a message recipient if it's a dm
 *
 * @param {Object} nametags     the room's nametags
 * @param {Object} text         the text of the message to be checked
 *
 **/
const setDm = (context, nametags, message) =>  {
  const Nametags = context.models.Nametags
  let promises = []
  // For every mention, check every nametag in the room to see if it matches the name.
  for (let i = 0; i < nametags.length; i++) {
    const {name, id} = nametags[i]
    if (message.text.slice(2, name.length + 2).toLowerCase() === name.toLowerCase()) {
      return Promise.all([
        Nametags.addMention(id)
        .then(() => mentionNotif(context, id, message, 'DM')),
        r.db('nametags').table('messages').get(message.id).update({recipient: id})
      ])
      .then(() => id)
    }
  }
  return
}

/**
 * Sends a notification based on a mention
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be checked
 *
 **/

const mentionNotif = ({conn}, to, message, reason) => null
// Temporarily commenting out until I can implement user token lookups
// Promise.all([
//   r.db('nametag').table('nametags').get(to).run(conn)
//     .then(cursor => new Promise((resolve, reject) =>
//       cursor.toArray((err, userNametags) => {
//         if (err) { reject(err) }
//         resolve(userNametags[0].user)
//       })
//     ))
//     .then(user => r.db('nametag').table('users').get(user).run(conn)),
//   r.db('nametag').table('rooms').get(message.room).run(conn),
//   r.db('nametag').table('nametags').get(message.author).run(conn),
//   message
// ])
// .then(([user, room, sender, message]) => notification({
//   reason,
//   roomTitle: room.title,
//   roomId: room.id,
//   text: message.text.replace(/\*/g, ''),
//   senderName: sender.name,
//   icon: sender.icon
// }, user.data.fcmToken)
// )

module.exports = (context) => ({
  Messages: {
    getRoomMessages: (room, nametag) => getRoomMessages(context, room, nametag),
    getNametagMessages: (nametag) => getNametagMessages(context, nametag),
    create: (message) => create(context, message),
    toggleSaved: (id, saved) => toggleSaved(context, id, saved)
  }
})
