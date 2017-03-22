import {graphql} from 'react-apollo'
import CREATE_NAMETAG from './createNametag.graphql'
import CREATE_MESSAGE from './createMessage.graphql'
import TOGGLE_SAVED from './toggleSaved.graphql'
import errorLog from '../../utils/errorLog'

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
      },
      optimisticResponse: {
        toggleSaved: {
          errors: null
        }
      },
      updateQueries: {
        roomQuery: (oldData, {mutationResult: {data: {toggleSaved: {errors}}}}) => {
          if (errors) {
            errorLog('Error saving message')(errors)
            return oldData
          }
          let newMessages = oldData.room.messages.slice()
          for (let i = 0; i < newMessages.length; i++) {
            let message = newMessages[i]
            if (message.id === messageId) {
              message.saved = saved
            }
          }
          return {
            ...oldData,
            messages: newMessages

          }
        }
      }
    })
  })
})
