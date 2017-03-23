const { createServer } = require('ws')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const subscriptionManager = require('./SubscriptionManager')
const WS_PORT = 8185


const websocketServer = createServer({port: WS_PORT}, () => {})

module.exports = () => new SubscriptionServer(
  {
    subscriptionManager
  },
  {
    server: websocketServer,
    path: '/'
  }
)
