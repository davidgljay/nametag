const pubsub = require('./pubsub')
const {APIError, errorLog} = require('../../errors')
const r = require('rethinkdb')

const MessageSubscription = conn => r.db('nametag').table('messages').changes().run(conn)
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
