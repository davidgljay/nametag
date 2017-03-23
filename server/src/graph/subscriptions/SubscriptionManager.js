const { SubscriptionManager } = require('graphql-subscriptions')
const schema = require('../schema')
const pubsub = require('./pubsub')

module.exports = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    messageAdded: (options, args) => ({
      messageAdded: {
        filter: message => message.room === args.roomId
      }
    }),
    nametagAdded: (options, args) => ({
      nametagAdded: {
        filter: nametag => nametag.room === args.roomId
      }
    }),
    nametagPresence: (options, args) => ({
      nametagPresence: {
        filter: nametagPresence => nametagPresence.roomId === args.roomId
      }
    })
  }
})
