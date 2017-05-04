const pubsub = require('./pubsub')
const {APIError, errorLog} = require('../../errors')
const {db} = require('../../db')

const MessageSubscription = conn => db.table('messages').changes().run(conn)
  .then(feed => {
    feed.each((err, message) => {
      if (err) {
        errorLog(new APIError('Error in message subscription feed'))
        return
      }
      if (!message.old_val) {
        pubsub.publish('messageAdded', message.new_val)
      }
    })
  })

module.exports = MessageSubscription
