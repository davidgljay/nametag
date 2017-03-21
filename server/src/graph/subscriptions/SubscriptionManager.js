const { SubscriptionManager } = require('graphql-subscriptions')
const schema = require('../typeDefs')
const { pubsub } = require('./pubsub')

module.exports = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    messageAdded: (options, args) => ({
      messageAdded: {
        filter: message => message.room === args.room
      }
    }),
    nametagAdded: (options, args) => ({
      nametagAdded: {
        filter: nametag => nametag.room === args.room
      }
    }),
    nametagPresence: (options, args) => ({
      nametagPresence: {
        filter: nametagPresence => nametagPresence.room === args.room
      }
    })
  }
})
