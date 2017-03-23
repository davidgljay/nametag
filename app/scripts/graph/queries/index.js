import {graphql} from 'react-apollo'
import {checkNametagPresence, messageAdded} from '../subscriptions'
import ROOMS_QUERY from './roomsQuery.graphql'
import ROOM_QUERY from './roomQuery.graphql'

export const roomsQuery = graphql(ROOMS_QUERY, {})

export const roomQuery = graphql(ROOM_QUERY, {
  options: (props) => ({
    variables: {
      id: props.params.roomId
    },
    props: (data) => ({
      data,
      messageAddedSubscription: messageAdded(data.subscribeToMore),
      checkNametagPresenceSubscription: checkNametagPresence(data.subscribeToMore)
    })
  })
})
