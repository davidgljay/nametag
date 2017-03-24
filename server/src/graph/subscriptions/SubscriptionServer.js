const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const subscriptionManager = require('./SubscriptionManager')
const Context = require('../context')
const WS_PORT = 8185

// Create WebSocket listener server
const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

// Bind it to port and start listening
websocketServer.listen(WS_PORT, () => console.log(
  `Websocket Server is now running on http://localhost:${WS_PORT}`
));

module.exports = (conn) => new SubscriptionServer(
  {
    subscriptionManager,
    onConnect: (connectionParams, webSocket) => new Context(connectionParams, conn)
  },
  {
    server: websocketServer,
    path: '/'
  }
)
