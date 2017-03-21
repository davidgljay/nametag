const r = require('../../horizon/server/src/horizon.js').r
const fetch = require('node-fetch')
const config = require('../secrets.json')
const db = r.db('nametag')
const {GCM_NOTIF_URL} = require('../constants')

const onMessage = (conn) => (err, message) => {
  if (err) {
    console.error(err)
    return Promise.reject(err)
  }

  // return db.table('user_nametags').filter({room: message.new_val.room})
  //   .update({latestMessage: message.new_val.timestamp}).run(conn)
  //   .then(() => checkMentions(message, conn))

  return checkMentions(message, conn)
}

// Check for mentions of a @username
const checkMentions = (message, conn) => {
  if (message.new_val.text.indexOf('@') === -1) { return null }

  const room = message.new_val.room

  return db.table('nametags').filter({room}).run(conn)
  .then((roomNametags) => {
    const splitMsg = message.new_val.text.split('@')
    const {author, text} = message.new_val
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
              addMention(id, room, conn)
              .then(() => postMention(id, author, room, text.replace(/\*/g, ''), 'MENTION', conn))
            )
          }
        }
      }
      return true
    })

    return Promise.all(promises)
  })
}

const addMention = (nametag, conn) => db.table('nametags').get(nametag)
.update({mentions: r.row('mentions').prepend(Date.now())}).run(conn)

const postMention = (to, sender, room, text, reason, conn) => Promise.all([
  db.table('nametags').get(to).run(conn)
    .then(cursor => new Promise((resolve, reject) =>
      cursor.toArray((err, userNametags) => {
        if (err) { reject(err) }
        resolve(userNametags[0].user)
      })
    ))
    .then(user => db.table('users').get(user).run(conn)),
  db.table('rooms').get(room).run(conn),
  db.table('nametags').get(sender).run(conn)
])
.then(([user, room, sender]) => postFCMNotif({
  reason,
  roomTitle: room.title,
  roomId: room.id,
  text,
  senderName: sender.name,
  icon: sender.icon
}, user.data.fcmToken)
)

module.exports = {
  messageNotifs: (conn) => db.table('messages').changes().run(conn)
      .then((feed) => feed.each(onMessage(conn))),
  dmNotifs: (conn) => db.table('direct_messages').changes().run(conn)
      .then((feed) => feed.each((err, dm) => {
        const {recipient, author, room, text} = dm.new_val
        if (err) {
          console.error(err)
          return Promise.reject(err)
        }
        return addMention(recipient, room, conn)
        .then(() => postMention(recipient, author, room, text, 'DM', conn))
      }))
}

const postFCMNotif = (data, token) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${config.fcm.key}`
    },
    body: JSON.stringify({
      data,
      to: token
    })
  }

  if (!token) {
    return Promise.reject(new Error('Cannot send message, user does not have a fcm token'))
  }

  return fetch(GCM_NOTIF_URL, options)
    .then((res) => {
      return res.ok ? res.json()
        : Promise.reject(res.statusCode)
    })
    .catch(err => console.log('Error posting notification', err))
}
