const {APIError, errorLog} = require('../../errors')
const {db} = require('../../db')
const pubsub = require('./pubsub')
const {index} = require('../../elasticsearch')

const RoomSubscription = conn => db.table('rooms').changes().run(conn)
  .then(feed => {
    feed.each((err, room) => {
      if (err) {
        errorLog(new APIError('Error in room subscription feed'))
        return
      }
      if (!room.new_val) {
        return
      }
      const roomForIndex = room.new_val.templates.length === 0
        ? Object.assign({}, room.new_val, {templates: ['public']})
        : room.new_val
      index(roomForIndex, 'room', 'room')
      if (room.old_val && room.old_val.latestMessage !== room.new_val.latestMessage) {
        pubsub.publish('latestMessageUpdated', {
          latestMessage: room.new_val.latestMessage,
          roomId: room.new_val.id
        })
      }
    })
  })

module.exports = RoomSubscription
