const {APIError, errorLog} = require('../../errors')
const {db} = require('../../db')
const {index} = require('../../elasticsearch')

const RoomSubscription = conn => db.table('rooms').changes().run(conn)
  .then(feed => {
    feed.each((err, room) => {
      if (err) {
        errorLog(new APIError('Error in room subscription feed'))
        return
      }
      index(room.new_val, 'room', 'room')
    })
  })

module.exports = RoomSubscription
