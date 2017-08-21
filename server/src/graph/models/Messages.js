const {db} = require('../../db')
const errors = require('../../errors')
const notification = require('../../notifications')
const email = require('../../email')

const messagesTable = db.table('messages')

/**
 * Returns a messages by ID.
 * @param {Object} context  graph context
 * @param {String} id       the ID of the message to be retrieved
 */
const get = ({conn}, id) => messagesTable.get(id).run(conn)

/**
 * Returns the messages from a particular room to display to a user. Also displays
 * direct messages to that user.
 * @param {Object} context     graph context
 * @param {String} room   the id of the room whose messages will be retrieved
 * @param {String} nametag the id of the nametag of the currently logged in user for this room
 */

const getRoomMessages = ({user, conn}, room, nametag) => Promise.all([
  messagesTable.getAll([room, false], {index: 'room_recipient'}).run(conn),
  messagesTable.getAll([room, nametag], {index: 'room_recipient'}).run(conn),
  messagesTable.getAll([room, user.nametags[room], true], {index: 'room_author_isDM'}).run(conn)
])
 .then(([messageCursor, dmToCursor, dmFromCursor]) => Promise.all([
   messageCursor.toArray(),
   dmToCursor.toArray(),
   dmFromCursor.toArray()
 ]))
 .then(([messages, dmsTo, dmsFrom]) => messages
    .concat(dmsTo).concat(dmsFrom)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  )

 /**
  * Returns the messages from a particular author.
  * @param {Object} context  graph context
  * @param {String} nametag  the id of the nametag of the messages' author
  */

const getNametagMessages = ({conn}, nametag) =>
  messagesTable.filter({author: nametag}).run(conn)

/**
 * Toggles the save boolean on a message.
 * @param {Object} context  graph context
 * @param {String} nametag  the id of the nametag of the messages' author
 */

const toggleSaved = ({conn}, id, saved) =>
 messagesTable.get(id).update({saved}).run(conn)

/**
 * Creates a message
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be created
 *
 **/

const create = (context, msg) => {
  const {conn, models: {Rooms}} = context
  const messageObj = Object.assign(
    {},
    msg,
    {createdAt: new Date(), reactions: []},
    {recipient: msg.recipient ? msg.recipient : false}
  )
  return messagesTable.insert(messageObj).run(conn)
  .then((res) => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating message')
    }
    const message = Object.assign({}, messageObj, {id: res.generated_keys[0]})
    return message
  })
  .then(message => Promise.all([
    checkMentions(context, message),
    message,
    Rooms.updateLatestMessage(message.room)
  ])
  )
  .then(([updates = {}, message]) => Object.assign({}, message, updates))
}

/**
 * Deletes a message
 *
 * @param {Object} context     graph context
 * @param {Object} messageId   the id of the message to be deleted
 *
 **/

const deleteMessage = (context, messageId) => messagesTable.get(messageId).delete().run(context.conn)

/**
 * Checks a message for mentions and dms
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be checked
 *
 **/

const checkMentions = (context, message) => {
  const {Nametags, Rooms} = context.models
  const mentions = message.text.indexOf('@') > -1
  if (!mentions) {
    return null
  }

  const splitMsg = message.text.split('@')

  return Promise.all([
    Nametags.getRoomNametags(message.room),
    Rooms.get(message.room)
  ])
  .then(([nametags, room]) => {
    let newText = message.text
    let promises = []
    for (let i = 0; i < splitMsg.length; i++) {
      const section = splitMsg[i]
      for (let j = 0; j < nametags.length; j++) {
        const {name, id} = nametags[j]
        if (section.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
          newText = newText.replace(new RegExp(`@${name}+`, 'g'), (mention) => `*${mention}*`)
          promises.push(
              Nametags.addMention(id)
              .then(() => mentionNotif(context, id, message, 'MENTION'))
              .then(() => mentionEmail(context, id, message))
            )
        }
      }
    }
    promises.push(messagesTable.get(message.id).update({text: newText}).run(context.conn))
    return Promise.all(promises).then(() => ({text: newText}))
  })
}

// /**
//  * Checks a message for mentions and dms
//  *
//  * @param {Object} nametags     the room's nametags
//  * @param {Object} text         the text of the message to be checked
//  *
//  **/
// const checkMentions = (context, nametags, message) => {
//   const splitMsg = message.text.split('@')
//   const {Nametags} = context.models
//   let newText = message.text
//   let promises = []
//   // For every mention, check every nametag in the room to see if it matches the name.
//   for (let i = 0; i < splitMsg.length; i++) {
//     const section = splitMsg[i]
//     for (let j = 0; j < nametags.length; j++) {
//       const {name, id} = nametags[j]
//       if (section.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
//         newText = newText.replace(new RegExp(`@${name}+`, 'g'), (mention) => `*${mention}*`)
//         promises.push(
//           Nametags.addMention(id)
//           .then(() => mentionNotif(context, id, message, 'MENTION'))
//           .then(() => mentionEmail(context, id, message))
//         )
//       }
//     }
//   }
//   promises.push(messagesTable.get(message.id).update({text: newText}).run(context.conn))
//   return Promise.all(promises).then(() => ({text: newText}))
// }

// /**
//  * Checks sets a message recipient if the message is a dm
//  *
//  * @param {Object} nametags     the room's nametags
//  * @param {Object} text         the text of the message to be checked
//  *
//  **/
// const setDm = (context, nametags, message, room) => {
//   const Nametags = context.models.Nametags
//   // For every mention, check every nametag in the room to see if it matches the name.
//   for (let i = 0; i < nametags.length; i++) {
//     const {name, id} = nametags[i]
//     if (message.text.slice(2, name.length + 2).toLowerCase() === name.toLowerCase()) {
//       // If the room allows mod-only DMing, return if the message is not to or from a mod
//       if (id !== room.mod && message.author !== room.mod && room.modOnlyDMs) {
//         return
//       }
//
//       const newText = message.text.slice(name.length + 2)
//       return Promise.all([
//         Nametags.addMention(id)
//         .then(() => mentionNotif(context, id, Object.assign({}, message, {text: newText}), 'DM')),
//         messagesTable.get(message.id).update({recipient: id, text: newText}).run(context.conn)
//       ])
//       .then(() => ({recipient: id, text: newText}))
//     }
//   }
//   return
// }

/**
 * Sends a notification based on a mention
 *
 * @param {Object} context     graph context
 * @param {Object} message   the message to be checked
 *
 **/

const mentionNotif = ({models: {Users, Rooms, Nametags}}, to, message, reason) =>
  Promise.all([
    Users.getTokens(message.author),
    Rooms.get(message.room),
    Nametags.get(message.author),
    message
  ])
  .then(([[token], room, sender, message]) => token
    ? notification({
      reason,
      params: {
        roomTitle: room.title,
        roomId: room.id,
        text: message.text.replace(/\*/g, ''),
        senderName: sender.name,
        image: sender.image
      }
    }, token)
    : null
  )

  /**
   * Sends an email based on a mention
   *
   * @param {Object} context     graph context
   * @param {String} id        the nametag id of the user being mentioned
   * @param {Object} message   the message to be checked
   *
   **/

const mentionEmail = ({models: {Rooms, Users, Nametags}}, id, message) =>
     Promise.all([
       Users.getByNametag(id),
       Rooms.get(message.room),
       Nametags.get(message.author),
       message
     ])
     .then(([user, room, author, message]) =>
     user.email && !user.unsubscribe.all && !user.unsubscribe[room.id]
     ? email({
       to: user.email,
       from: {name: 'Nametag', email: 'noreply@nametag.chat'},
       template: 'mention',
       params: {
         roomId: room.id,
         roomName: room.title,
         message: message.text,
         author: author.name
       }
     })
        : null
      )

  /**
   * Adds an emoji reaction to a message
   *
   * @param {Object} context     graph context
   * @param {String} messageId   the message being reacted to
   * @param {String} emoji      the emoji of the reaction
   * @param {String} nametagId  the id of the nametag who created the reaction
   *
   **/

const addReaction = ({conn}, messageId, emoji, nametagId) =>
  messagesTable.get(messageId)
    .update(message => ({reactions: message('reactions').setInsert({emoji, nametagId})}))
    .run(conn)

module.exports = (context) => ({
  Messages: {
    get: (id) => get(context, id),
    getRoomMessages: (room, nametag) => getRoomMessages(context, room, nametag),
    getNametagMessages: (nametag) => getNametagMessages(context, nametag),
    create: (message) => create(context, message),
    delete: (messageId) => deleteMessage(context, messageId),
    addReaction: (messageId, emoji, nametagId) => addReaction(context, messageId, emoji, nametagId),
    toggleSaved: (id, saved) => toggleSaved(context, id, saved)
  }
})
