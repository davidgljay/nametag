const { SubscriptionServer } = require('subscriptions-transport-ws')
const subscriptionManager = require('./SubscriptionManager')
const Context = require('../context')

module.exports = (conn, server) => new SubscriptionServer(
  {
    subscriptionManager,
    onConnect: (connectionParams, webSocket) => new Context(connectionParams, conn)
  },
  {
    server,
    path: '/'
  }
)
