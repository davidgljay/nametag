const { SubscriptionManager } = require('graphql-subscriptions')
const schema = require('../schema')
const pubsub = require('./pubsub')

module.exports = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    messageAdded: (options, args) => ({
      messageAdded: {
        filter: message => message.room === args.roomId &&
                            (
                              !message.recipient ||
                              message.recipient === args.nametagId ||
                              message.author === args.nametagId
                            )
      }
    }),
    nametagAdded: (options, args) => ({
      nametagAdded: {
        filter: nametag => nametag.room === args.roomId
      }
    }),
    nametagUpdated: (options, args) => ({
      nametagUpdated: {
        filter: nametagUpdated => args.roomId === nametagUpdated.room
      }
    }),
    badgeRequestAdded: (options, args) => ({
      badgeRequestAdded: {
        filter: badgeRequest => badgeRequest.granter === args.granterId
      }
    }),
    latestMessageUpdated: (options, args) => ({
      latestMessageUpdated: {
        filter: latestMessageUpdated => args.roomIds.indexOf(latestMessageUpdated.roomId) > -1
      }
    }),
    roomUpdated: (options, args) => ({
      roomUpdated: {
        filter: updateRoom => args.roomId === updateRoom.id
      }
    })
  }
})
