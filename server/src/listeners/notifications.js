// const r = require('../../horizon/server/src/horizon.js').r
// const fetch = require('node-fetch')
// const config = require('../secrets.json')
// const db = r.db('nametag')
// const {GCM_NOTIF_URL} = require('../constants')
//
// const onMessage = (conn) => (err, message) => {
//   if (err) {
//     console.error(err)
//     return Promise.reject(err)
//   }
//
//   // return db.table('user_nametags').filter({room: message.new_val.room})
//   //   .update({latestMessage: message.new_val.timestamp}).run(conn)
//   //   .then(() => checkMentions(message, conn))
//
//   return checkMentions(message, conn)
// }
//
//
// const postMention = (to, sender, room, text, reason, conn) => Promise.all([
//   db.table('nametags').get(to).run(conn)
//     .then(cursor => new Promise((resolve, reject) =>
//       cursor.toArray((err, userNametags) => {
//         if (err) { reject(err) }
//         resolve(userNametags[0].user)
//       })
//     ))
//     .then(user => db.table('users').get(user).run(conn)),
//   db.table('rooms').get(room).run(conn),
//   db.table('nametags').get(sender).run(conn)
// ])
// .then(([user, room, sender]) => postFCMNotif({
//   reason,
//   roomTitle: room.title,
//   roomId: room.id,
//   text,
//   senderName: sender.name,
//   icon: sender.icon
// }, user.data.fcmToken)
// )
//
// module.exports = {
//   messageNotifs: (conn) => db.table('messages').changes().run(conn)
//       .then((feed) => feed.each(onMessage(conn))),
//   dmNotifs: (conn) => db.table('direct_messages').changes().run(conn)
//       .then((feed) => feed.each((err, dm) => {
//         const {recipient, author, room, text} = dm.new_val
//         if (err) {
//           console.error(err)
//           return Promise.reject(err)
//         }
//         return addMention(recipient, room, conn)
//         .then(() => postMention(recipient, author, room, text, 'DM', conn))
//       }))
// }
//
// const postFCMNotif =
