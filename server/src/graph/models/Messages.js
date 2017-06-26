const {db} = require('../../db')
const errors = require('../../errors')
const notification = require('../../notifications')

const messagesTable = db.table('messages')

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
  const messageObj = Object.assign({}, msg, {createdAt: new Date(), recipient: false})
  return messagesTable.insert(messageObj).run(conn)
  .then((res) => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating message')
    }
    const message = Object.assign({}, messageObj, {id: res.generated_keys[0]})
    return message
  })
  .then(message => Promise.all([
    checkMentionsAndDMs(context, message),
    message,
    Rooms.updateLatestMessage(message.room)
  ])
  )
  .then(([updates = {}, message]) => Object.assign({}, message, updates))
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
  const dm = message.text.toLowerCase().slice(0, 2) === 'd '
  const mentions = message.text.indexOf('@') > -1
  if (!dm && !mentions) {
    return null
  }

  return Promise.all([
    Nametags.getRoomNametags(message.room),
    Rooms.get(message.room)
  ])
  .then(([nametags, room]) => {
    if (dm) {
      return setDm(context, nametags, message, room)
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
const checkMentions = (context, nametags, message) => {
  const splitMsg = message.text.split('@')
  const {Nametags} = context.models
  let newText = message.text
  let promises = []
  // For every mention, check every nametag in the room to see if it matches the name.
  for (let i = 0; i < splitMsg.length; i++) {
    const section = splitMsg[i]
    for (let j = 0; j < nametags.length; j++) {
      const {name, id} = nametags[j]
      if (section.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
        newText = newText.replace(new RegExp(`@${name}+`, 'g'), (mention) => `*${mention}*`)
        promises.push(
          Nametags.addMention(id)
          .then(() => mentionNotif(context, id, message, 'MENTION'))
        )
      }
    }
  }
  promises.push(messagesTable.get(message.id).update({text: newText}).run(context.conn))
  return Promise.all(promises).then(() => ({text: newText}))
}

/**
 * Checks sets a message recipient if the message is a dm
 *
 * @param {Object} nametags     the room's nametags
 * @param {Object} text         the text of the message to be checked
 *
 **/
const setDm = (context, nametags, message, room) => {
  const Nametags = context.models.Nametags
  // For every mention, check every nametag in the room to see if it matches the name.
  for (let i = 0; i < nametags.length; i++) {
    const {name, id} = nametags[i]
    if (message.text.slice(2, name.length + 2).toLowerCase() === name.toLowerCase()) {

      //If the room allows mod-only DMing, return if the message is not to or from a mod
      if (id !== room.mod && message.author !== room.mod && room.modOnlyDMs) {
        return
      }

      const newText = message.text.slice(name.length + 2)
      return Promise.all([
        Nametags.addMention(id)
        .then(() => mentionNotif(context, id, Object.assign({}, message, {text: newText}), 'DM')),
        messagesTable.get(message.id).update({recipient: id, text: newText}).run(context.conn)
      ])
      .then(() => ({recipient: id, text: newText}))
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

module.exports = (context) => ({
  Messages: {
    getRoomMessages: (room, nametag) => getRoomMessages(context, room, nametag),
    getNametagMessages: (nametag) => getNametagMessages(context, nametag),
    create: (message) => create(context, message),
    toggleSaved: (id, saved) => toggleSaved(context, id, saved)
  }
})
