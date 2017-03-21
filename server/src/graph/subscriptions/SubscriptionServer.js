const { SubscriptionServer } = require('subscriptions-transport-ws')
const subscriptionManager = require('./SubscriptionManager')

module.exports = (server) => new SubscriptionServer(
  {
    subscriptionManager
  },
  {
    server,
    path: '/api/v1/subscriptions'
  }
)
