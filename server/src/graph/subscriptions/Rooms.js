const {APIError, errorLog} = require('../../errors')
const {db} = require('../../db')
const pubsub = require('./pubsub')
// const {index} = require('../../elasticsearch')
const email = require('../../email')

const RoomSubscription = ({conn, models: {Nametags, Users}}) => db.table('rooms').changes().run(conn)
  .then(feed => {
    feed.each((err, room) => {
      if (err) {
        errorLog(new APIError('Error in room subscription feed'))
        return
      }
      if (!room.new_val || !room.old_val) {
        return
      }
      if (!room.old_val.mod && room.new_val.public === 'PENDING' && room.new_val.mod) {
        Nametags.get(room.new_val.mod)
          .then(mod => {
            email({
              to: 'david@nametag.chat',
              from: {name: 'Nametag', email: 'noreply@nametag.chat'},
              template: 'publicRoom',
              params: {
                roomId: room.new_val.id,
                roomTitle: room.new_val.title,
                modImage: mod.image,
                modName: mod.name,
                modBio: mod.bio
              }
            })
          })
      }
      if (room.old_val.public === 'PENDING' && room.new_val.public === 'APPROVED') {
        Users.getByNametag(room.new_val.mod)
          .then(user => {
            if (!user.email) {
              return
            }
            email({
              to: user.email,
              from: {name: 'Nametag', email: 'noreply@nametag.chat'},
              template: 'roomApproval',
              params: {
                roomId: room.new_val.id,
                roomTitle: room.new_val.title,
                loginHash: user.loginHash
              }
            })
          })
      }
      // const roomForIndex = room.new_val.templates.length === 0
      //   ? Object.assign({}, room.new_val, {templates: ['public']})
      //   : room.new_val
      // index(roomForIndex, 'room', 'room')
      if (room.old_val && room.old_val.latestMessage !== room.new_val.latestMessage) {
        pubsub.publish('latestMessageUpdated', {
          latestMessage: room.new_val.latestMessage,
          roomId: room.new_val.id
        })
      }
    })
  })

module.exports = RoomSubscription
