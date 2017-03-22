import {graphql} from 'react-apollo'
import CREATE_NAMETAG from './createNametag.graphql'
import CREATE_MESSAGE from './createMessage.graphql'
import TOGGLE_SAVED from './toggleSaved.graphql'

export const createNametag = graphql(CREATE_NAMETAG, {
  props: ({ownProps, mutate}) => ({
    createNametag: (nametag) => mutate({
      variables: {
        nametag
      }
    })
  })
})

export const createMessage = graphql(CREATE_MESSAGE, {
  props: ({ownProps, mutate}) => ({
    createMessage: (message) => mutate({
      variables: {
        message
      }
    })
  })
})

export const toggleSaved = graphql(TOGGLE_SAVED, {
  props: ({ownProps, mutate}) => ({
    toggleSaved: (messageId, saved) => mutate({
      variables: {
        messageId,
        saved
      }
    })
  })
})
