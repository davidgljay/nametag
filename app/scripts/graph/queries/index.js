import {graphql} from 'react-apollo'
import {checkNametagPresence, messageAdded} from '../subscriptions'
import ROOMS_QUERY from './roomsQuery.graphql'
import ROOM_QUERY from './roomQuery.graphql'
import USER_QUERY from './userQuery.graphql'
import CREATE_BADGE_TEMPLATE_QUERY from './createBadgeTemplateQuery.graphql'
import BADGE_TEMPLATE_QUERY from './badgeTemplateQuery'

export const roomsQuery = graphql(ROOMS_QUERY)

export const userQuery = graphql(USER_QUERY)

export const roomQuery = graphql(ROOM_QUERY, {
  options: (props) => ({
    variables: {
      id: props.params.roomId
    }
  }),
  props: ({data}) => ({
    data,
    messageAddedSubscription: messageAdded(data.subscribeToMore),
    checkNametagPresenceSubscription: checkNametagPresence(data.subscribeToMore)
  })
})

export const createBadgeTemplateQuery = graphql(CREATE_BADGE_TEMPLATE_QUERY, {
  options: (props) => ({
    variables: {
      granter: props.params.granterId
    }
  })
})

export const badgeTemplateQuery = graphql(BADGE_TEMPLATE_QUERY, {
  options: (props) => ({
    variables: {
      id: props.params.templateId
    }
  })
})
