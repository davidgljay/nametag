const r = require('../../horizon/server/src/horizon.js').r

const onMessage = (conn) => (err, message) => {
  if (err) {
    console.error(err)
    return Promise.reject(err)
  }

  return r.db('nametag').table('user_nametags').filter({room: message.new_val.room})
    .update({latestMessage: message.new_val.timestamp}).run(conn)
    .then(() => checkMentions(message, conn))
}

// Check for mentions of a @username
const checkMentions = (message, conn) => {
  if (message.new_val.text.indexOf('@') === -1) {return null}

  const room = message.new_val.room

  return r.db('nametag').table('nametags').filter({room}).run(conn)
  .then((roomNametags) => {
    const splitMsg = message.new_val.text.split('@')
    let promises = []
    // For every mention, check every nametag in the room to see if it matches the name.
    roomNametags.toArray((err, nametags) => {
      if (err) { return false}
      for (let i = 0; i < splitMsg.length; i++ ) {
        const text = splitMsg[i]
        for (let j = 0; j < nametags.length; j++ ) {
          const {name, id} = nametags[j]
          if (text.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
            promises.push(addMention(id, room, conn))
          }
        }
      }
      return true
    })

    return Promise.all(promises)
  })
}

const addMention = (nametag, room, conn) => r.db('nametag').table('user_nametags')
.filter({room, nametag}).update({mentions: r.row('mentions').prepend(Date.now())}).run(conn)

module.exports = {
  messageNotifs: (conn) => r.db('nametag').table('messages').changes().run(conn)
      .then((feed) => feed.each(onMessage(conn))),
  dmNotifs: (conn) => r.db('nametag').table('direct_messages').changes().run(conn)
      .then((feed) => feed.each((err, dm) => {
        if (err) {
          console.error(err)
          return Promise.reject(err)
        }
        return addMention(dm.new_val.recipient, dm.new_val.room, conn)
      })),
}
