import {createNetworkInterface} from 'apollo-client'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

export default function getNetworkInterface (headers = {}) {
  return addGraphQLSubscriptions(
    new createNetworkInterface({ //eslint-disable-line
      uri: '/api/v1/graph/ql',
      opts: {
        credentials: 'same-origin',
        headers
      }
    }),
    new SubscriptionClient(`wss://${window.location.hostname}`, {
      reconnect: true
    })
  )
}
