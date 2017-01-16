const r = require('../../horizon/server/src/horizon.js').r

const onMessage = (conn) => (err, message) => {
  if (err) {
    console.error(err)
    return Promise.reject(err)
  }
  return r.db('nametag').table('user_nametags').filter({room: message.new_val.room})
    .update({latestMessage: message.new_val.timestamp}).run(conn)
    .then(() => checkMentions(message))
}

// Check for mentions of a @username
const checkMentions = (message) => {
  if (message.indexOf('@') === -1) {return null}

  const room = message.new_val.room

  return r.db('nametag').table('nametags').filter({room}).run(conn)
  .then((roomNametags) => {
    const splitMsg = message.split('@')
    for (let i = 0; i < splitMsg.length; i++ ) {
      // For every mention, check every nametag in the room to see if it matches the name.
      for (let j = 0; j < roomNametags.length; j++ ) {
        const {name, nametagId} = roomNametags[j]
        if (splitMsg[i].slice(0, name.length).toLowerCase() === name.toLowerCase()) {
          addMention(nametagId, room)
        }
      }
    }
  })
}

const addMention = (nametag, room) => {
  return r.db('nametag').table('user_nametags').filter({room, nametag})
    .update({mentions: r.row('mentions').prepend(Date.now())}).run(conn)
}

module.exports = (conn) => {
  return r.db('nametag').table('messages').changes().run(conn)
    .then((feed) => feed.each(onMessage(conn)))
}
