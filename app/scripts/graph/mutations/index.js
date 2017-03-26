import {graphql} from 'react-apollo'
import CREATE_NAMETAG from './createNametag.graphql'
import CREATE_ROOM from './createRoom.graphql'
import CREATE_MESSAGE from './createMessage.graphql'
import TOGGLE_SAVED from './toggleSaved.graphql'
import UPDATE_LATEST_VISIT from './updateLatestVisit.graphql'
import UPDATE_TOKEN from './updateToken.graphql'
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

export const createRoom = graphql(CREATE_ROOM, {
  props: ({ownProps, mutate}) => ({
    createRoom: (room) => mutate({
      variables: {
        room
      }
    })
  })
})

export const updateLatestVisit = graphql(UPDATE_LATEST_VISIT, {
  props: ({ownProps, mutate}) => ({
    updateLatestVisit: (nametagId) => mutate({
      variables: {
        nametagId
      }
    })
  })
})

export const updateToken = graphql(UPDATE_TOKEN, {
  props: ({ownProps, mutate}) => ({
    updateToken: (token) => mutate({
      variables: {
        token
      }
    })
  })
})

export const createMessage = graphql(CREATE_MESSAGE, {
  props: ({ownProps, mutate}) => ({
    createMessage: (message, author) => mutate({
      variables: {
        message
      },
      optimisticResponse: {
        createMessage: {
          message: {
            __typename: 'Message',
            id: `tempMessage_${Date.now()}`,
            text: message.text,
            createdAt: new Date().toISOString(),
            saved: false,
            author: {
              __typename: 'Nametag',
              icon: author.icon,
              id: author.id,
              name: author.name
            },
            recipient: null
          },
          errors: null
        }
      },
      updateQueries: {
        roomQuery: (oldData, {mutationResult: {data: {createMessage: {message, errors}}}}) => {
          if (errors) {
            errorLog('Error saving message')(errors)
            return oldData
          }

          let isNew = true
          const oldMessages = oldData.room.messages
          let newMessages = oldMessages.slice()
          for (var i = 0; i < oldMessages.length; i++) {
            const msg = oldMessages[i]
            if (msg.id === message.id) {
              isNew = false
              newMessages[i] = message
            }
          }

          // Check to see if the message has already been posted (for example, if the current user is the author.)
          if (!isNew) {
            return {
              ...oldData,
              room: {
                ...oldData.room,
                messages: newMessages
              }
            }
          }

          return {
            ...oldData,
            room: {
              ...oldData.room,
              messages: oldMessages.concat(message)
            }
          }
        }
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
            room: {
              ...oldData.room,
              messages: newMessages
            },
            me: {
              ...oldData.me
            }
          }
        }
      }
    })
  })
})
