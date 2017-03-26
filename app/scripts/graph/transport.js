import {createNetworkInterface} from 'apollo-client'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

const websocketURL = process.env.NODE_ENV === 'production'
  ? `wss://${window.location.hostname}`
  : `wss://${window.location.hostname}:8181`

export default function getNetworkInterface (headers = {}) {
  return addGraphQLSubscriptions(
    new createNetworkInterface({ //eslint-disable-line
      uri: '/api/v1/graph/ql',
      opts: {
        credentials: 'same-origin',
        headers
      }
    }),
    new SubscriptionClient(websocketURL, {
      reconnect: true
    })
  )
}
