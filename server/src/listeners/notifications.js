const r = require('../../horizon/server/src/horizon.js').r
const imageUpload = require('../routes/images/imageUpload')

const onMessage = (conn) => (err, message) => {
  if (err) {
    console.err(err)
    return
  }

  r.db('nametag').table('user_nametags').filter({room: message.room})
    .update({latestMessage: message.timestamp}).run(conn)
}

module.exports = (conn) => {
  r.db('nametag').table('messages').changes().run(conn)
    .then((feed) => feed.each(onMessage(conn)))
}
