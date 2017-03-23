const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const subscriptionManager = require('./SubscriptionManager')
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

module.exports = () => new SubscriptionServer(
  {
    subscriptionManager
  },
  {
    server: websocketServer,
    path: '/'
  }
)
