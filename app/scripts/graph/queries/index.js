import {graphql} from 'react-apollo'
import {checkNametagPresence, messageAdded} from '../subscriptions'
import ROOMS_QUERY from './roomsQuery.graphql'
import ROOM_QUERY from './roomQuery.graphql'
import USER_QUERY from './userQuery.graphql'
import GRANTER_QUERY from './granterQuery.graphql'
import CREATE_BADGE_TEMPLATE_QUERY from './createTemplateQuery.graphql'
import BADGE_TEMPLATE_QUERY from './templateQuery.graphql'

function getQueryVariable (variable) {
  let query = window.location.search.substring(1)
  let vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1])
    }
  }

  // If not found, return null.
  return null
}

export const roomsQuery = graphql(ROOMS_QUERY, {
  options: () => ({
    variables: {
      id: getQueryVariable('id')
    }
  })
})

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

export const createTemplateQuery = graphql(CREATE_BADGE_TEMPLATE_QUERY, {
  options: (props) => ({
    variables: {
      granter: props.params.urlCode
    }
  })
})

export const templateQuery = graphql(BADGE_TEMPLATE_QUERY, {
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
