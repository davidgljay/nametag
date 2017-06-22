const pubsub = require('./pubsub')
const {APIError, errorLog} = require('../../errors')
const {db} = require('../../db')

const MessageSubscription = ({conn, models: {Rooms}}) => db.table('messages').changes().run(conn)
  .then(feed => {
    feed.each((err, message) => {
      if (err) {
        errorLog(new APIError('Error in message subscription feed'))
        return
      }
      if (!message.old_val) {
        // Send the message to people in the room
        pubsub.publish('messageAdded', message.new_val)

        //Send a new room message notification if necessary
        Rooms.notifyOfNewMessage(message.new_val.room)
      }
    })
  })

module.exports = MessageSubscription
