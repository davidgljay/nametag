const {db} = require('../../db')
const r = require('rethinkdb')
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
 * Gets replies to a message.
 * @param {Object} context  graph context
 * @param {String} id       the ID of the parent message
 * @param {Int} limit       the total number of replies to return
 */
const getReplies = ({conn}, id, limit = 9999999) =>
 messagesTable.getAll(id, {index: 'parent'})
    .orderBy('createdAt')
    .limit(limit)
    .run(conn)
    .then(cursor => cursor.toArray())

/**
 * Gets the number of replies to a message.
 * @param {Object} context  graph context
 * @param {String} id       the ID of the parent message
 */
const getReplyCount = ({conn}, id) =>
  messagesTable.getAll(id, {index: 'parent'})
  .count()
  .run(conn)

/**
 * Returns the number of messages since a particular date.
 *
 * @param {Object} context     graph context
 * @param {String} roomId   the id of the room to be checked
 * @param {Date} date the date to be checked against
 *
 */

const newMessageCount = ({conn, user}, roomId) =>
  messagesTable.getAll([roomId, false], {index: 'room_recipient'})
    .filter(msg => msg('createdAt').gt(db.table('nametags').get(user.nametags[roomId])('latestVisit')))
    .count()
    .run(conn)

/**
 * Returns the messages from a particular room to display to a user. Also displays
 * direct messages to that user.
 * @param {Object} context     graph context
 * @param {String} room   the id of the room whose messages will be retrieved
 * @param {String} nametag the id of the nametag of the currently logged in user for this room
 */

const getRoomMessages = ({user, conn}, room, nametag) => Promise.all([
  messagesTable.getAll([room, false], {index: 'room_recipient'})
    .filter(message => r.not(message.hasFields('parent')))
    .run(conn),
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

const create = (context, m) => {
  const {conn, models: {Rooms}} = context
  let messageObj = Object.assign(
    {},
    m,
    {createdAt: new Date(), reactions: []},
    {recipient: m.recipient ? m.recipient : false}
  )
  if (m.parent) {
    return messagesTable.insert(messageObj).run(conn)
      .then((res) => {
        if (res.errors > 0) {
          return new errors.APIError('Error creating message')
        }
        return Object.assign({}, messageObj, {id: res.generated_keys[0]})
      })
      .then(message => Promise.all([checkMentions(context, message), message, emailIfReply(context, message)]))
      .then(([updates = {}, message]) => Object.assign({}, message, updates))
  }
  return checkForCommands(context, messageObj)
  .then(msg => messagesTable.insert(msg).run(conn))
  .then((res) => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating message')
    }
    return Object.assign({}, messageObj, {id: res.generated_keys[0]})
  })
  .then(message => Promise.all([
    checkMentions(context, message),
    message,
    Rooms.updateLatestMessage(message.room),
    Nametags.update(message.author, {latestVisit: new Date(Date.now() + 1000)})
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
 * Edits a message
 *
 * @param {Object} context     graph context
 * @param {Object} messageId   the id of the message to be deleted
 * @param {Object} text   the new text of the message
 *
 **/

const editMessage = (context, messageId, text) =>
  messagesTable.get(messageId).update({text, editedAt: new Date()}).run(context.conn)

/**
 * E-mails people in a reply thread if a comment is a reply
 *
 * @param {Object} context     graph context
 * @param {Object} message   the reply in question
 *
 **/

const emailIfReply = ({conn, user}, msg) =>
   msg.parent
   ? messagesTable.getAll(msg.parent)
    .union(messagesTable.getAll(msg.parent, {index: 'parent'}))
    .map(message => message.merge({
      messageId: message('id'),
      messageAuthor: r.db('nametag').table('nametags').get(msg.author)('name')
    }))
    .eqJoin('author', r.db('nametag').table('users'), {index: 'nametags'})
    .zip()
    .eqJoin('author', r.db('nametag').table('nametags'))
    .zip()
    .eqJoin('room', r.db('nametag').table('rooms'))
    .zip()
    .pluck('email', 'messageText', 'messageAuthor', 'messageId', 'room', 'userToken', 'title')
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(replies => {
      const {messageId} = replies[0]
      let promises = []
      let notified = {[user.email]: true}
      for (var i = 0; i < replies.length; i++) {
        const {messageAuthor, room, userToken, title} = replies[i]
        if (!notified[replies[i].email]) {
          notified[replies[i].email] = true
          promises.push(email({
            to: replies[i].email,
            from: {name: 'Nametag', email: 'noreply@nametag.chat'},
            template: 'reply',
            params: {
              roomId: room,
              roomName: title,
              message: msg.text,
              messageId,
              author: messageAuthor,
              userToken
            }
          }))
        }
      }
      return Promise.all(promises)
    })
    : null

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

/**
 * Checks message for known commanes
 *
 * @param {Object} context      graph context
 * @param {Object} message      the message to be checked
 *
 **/

const checkForCommands = ({user, models: {Rooms, Nametags, Users}}, message) => {
  const commandRegex = /^\/(\S+)\s(.+)/.exec(message.text)
  const {ErrNotMod, ErrNotYourNametag} = errors
  if (!commandRegex) {
    return Promise.resolve(message)
  }
  const command = commandRegex[1]
  const text = commandRegex[2]
  switch (command) {
    case 'welcome':
      return Rooms.get(message.room)
      .then(room => room.mod === user.nametags[message.room]
        ? Rooms.update(message.room, {welcome: text})
        : Promise.reject(ErrNotMod))
      .then(() => Object.assign({}, message, {
        text: `This room's welcome message has been updated to "${text}".`,
        author: null
      }))
    case 'intro':
      return user.nametags[message.room] === message.author
     ? Nametags.update(message.author, {bio: text})
      .then(() => Nametags.get(message.author))
      .then(nametag => Object.assign({}, message, {
        text: `${nametag.name} has updated their introduction to "${nametag.bio}"`,
        author: null
      }))
     : Promise.reject(ErrNotYourNametag)
    case 'name':
      return user.nametags[message.room] === message.author
       ? Nametags.get(message.author)
         .then(nametag =>
           Nametags.update(message.author, {name: text})
           .then(() => Object.assign({}, message, {
             text: `${nametag.name} has updated their name to "${text}"`,
             author: null
           }))
         )
        : Promise.reject(ErrNotYourNametag)
    case 'title':
      return Rooms.get(message.room)
         .then(room => room.mod === user.nametags[message.room]
           ? Rooms.update(message.room, {title: text})
           : Promise.reject(ErrNotMod))
         .then(() => Object.assign({}, message, {
           text: `This room's title has been updated to "${text}".`,
           author: null
         }))
    case 'announce':
      return Promise.all([
        Rooms.get(message.room),
        Nametags.get(message.author)
      ])
        .then(([room, author]) => room.mod === user.nametags[message.room]
          ? Nametags.getRoomNametags(message.room)
            .then(nametags => Users.getEmails(nametags.map(nt => nt.id)))
            .then(emails => email({
              to: emails,
              from: {name: 'Nametag', email: 'noreply@nametag.chat'},
              template: 'announcement',
              params: {
                roomId: room.id,
                roomName: room.title,
                message: text,
                author: author.name
              }
            }))
            .then(() => Object.assign({}, message, {
              text: `## Announcement\n${text}`
            }))
          : Promise.reject(ErrNotMod)
        )
    default:
      return Promise.resolve(message)
  }
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
    getReplies: (id, limit) => getReplies(context, id, limit),
    getReplyCount: (id) => getReplyCount(context, id),
    newMessageCount: (roomId) => newMessageCount(context, roomId),
    getRoomMessages: (roomId, nametag) => getRoomMessages(context, roomId, nametag),
    getNametagMessages: (nametag) => getNametagMessages(context, nametag),
    create: (message) => create(context, message),
    edit: (messageId, text) => editMessage(context, messageId, text),
    delete: (messageId) => deleteMessage(context, messageId),
    addReaction: (messageId, emoji, nametagId) => addReaction(context, messageId, emoji, nametagId),
    toggleSaved: (id, saved) => toggleSaved(context, id, saved)
  }
})
