const r = require('../../horizon/server/src/horizon.js').r

const onMessage = (conn) => (err, message) => {
  if (err) {
    console.error(err)
    return
  }
  r.db('nametag').table('user_nametags').filter({room: message.new_val.room})
    .update({latestMessage: message.new_val.timestamp}).run(conn)
}

module.exports = (conn) => {
  r.db('nametag').table('messages').changes().run(conn)
    .then((feed) => feed.each(onMessage(conn)))
}
