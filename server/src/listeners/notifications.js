const r = require('../../horizon/server/src/horizon.js').r
const fetch = require('node-fetch')
const config = require('../secrets.json')
const db = db

const onMessage = (conn) => (err, message) => {
  if (err) {
    console.error(err)
    return Promise.reject(err)
  }

  return db.table('user_nametags').filter({room: message.new_val.room})
    .update({latestMessage: message.new_val.timestamp}).run(conn)
    .then(() => checkMentions(message, conn))
}

// Check for mentions of a @username
const checkMentions = (message, conn) => {
  if (message.new_val.text.indexOf('@') === -1) { return null }

  const room = message.new_val.room

  return db.table('nametags').filter({room}).run(conn)
  .then((roomNametags) => {
    const splitMsg = message.new_val.text.split('@')
    const from = message.new_val.author
    let promises = []
    // For every mention, check every nametag in the room to see if it matches the name.
    roomNametags.toArray((err, nametags) => {
      if (err) { return false }
      for (let i = 0; i < splitMsg.length; i++) {
        const text = splitMsg[i]
        for (let j = 0; j < nametags.length; j++) {
          const {name, id} = nametags[j]
          if (text.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
            promises.push(
              addMention(id, room, conn)
              .then(() => postMention(id, from, room, 'MENTION', conn))
            )
          }
        }
      }
      return true
    })

    return Promise.all(promises)
  })
}

const addMention = (nametag, room, conn) => db.table('user_nametags')
.filter({room, nametag}).update({mentions: r.row('mentions').prepend(Date.now())}).run(conn)

const postMention = (to, from, room, reason, conn) => Promise.all([
  db.table('user_nametags').filter({room, nametag:to}).run(conn)
    .then({user} => rb.table('users').get(user)),
  db.table('rooms').get(room),
  db.table('nametags').get(from)
])
.then([user, room, from] => {
  postFCMNotif({
    reason,
    room: {
      title: room.title,
      id: room.id,
      image: room.image
    },
    from: {
      name: from.name,
      icon: from.icon
    }
  }, user.fcmToken)
})

module.exports = {
  messageNotifs: (conn) => db.table('messages').changes().run(conn)
      .then((feed) => feed.each(onMessage(conn))),
  dmNotifs: (conn) => db.table('direct_messages').changes().run(conn)
      .then((feed) => feed.each((err, dm) => {
        const {recipient, author, room} = dm.new_val;
        if (err) {
          console.error(err)
          return Promise.reject(err)
        }
        return addMention(recipient, room, conn)
        .then(() => postMention(recipient, author, room, 'DM', conn))
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
  console.log('Posting notif', options);

  return fetch(GCM_NOTIF_URL, options)
    .then((res) => {
      console.log('res ok', res.json);
      return res.ok ? res.json()
        : Promise.reject(new Error(res.statusCode))
    })
}
