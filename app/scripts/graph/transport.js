import {createNetworkInterface} from 'apollo-client'

export default function getNetworkInterface (apiUrl = '/api/v1/graph/ql', headers = {}) {
  return new createNetworkInterface({ //eslint-disable-line
    uri: apiUrl,
    opts: {
      credentials: 'same-origin',
      headers
    }
  })
}
