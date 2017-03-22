import {graphql} from 'react-apollo'

import ROOMS_QUERY from './roomsQuery.graphql'
import ROOM_QUERY from './roomQuery.graphql'

export const roomsQuery = graphql(ROOMS_QUERY, {})

export const roomQuery = graphql(ROOM_QUERY, {
  options: (props) => ({
      variables: {
        id: props.params.roomId
      }
    })
})
