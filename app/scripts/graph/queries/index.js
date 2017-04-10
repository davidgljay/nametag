import {graphql} from 'react-apollo'
import {checkNametagPresence, messageAdded} from '../subscriptions'
import ROOMS_QUERY from './roomsQuery.graphql'
import ROOM_QUERY from './roomQuery.graphql'
import USER_QUERY from './userQuery.graphql'
import GRANTER_QUERY from './granterQuery.graphql'
import CREATE_BADGE_TEMPLATE_QUERY from './createBadgeTemplateQuery.graphql'
import BADGE_TEMPLATE_QUERY from './badgeTemplateQuery.graphql'

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
      granter: props.params.urlCode
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

export const granterQuery = graphql(GRANTER_QUERY, {
  options: (props) => ({
    variables: {
      urlCode: props.params.urlCode
    }
  })
})
