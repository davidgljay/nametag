import CHECK_NAMETAG_PRESENCE from './checkNametagPresence.graphql'
import MESSAGE_ADDED from './messageAdded.graphql'

export const checkNametagPresence = subscribeToMore => roomId => subscribeToMore({
  document: CHECK_NAMETAG_PRESENCE,
  variables: {
    roomId: roomId
  },
  updateQuery: (oldData, {subscriptionData}) => {
    console.log('subscriptionData', subscriptionData)
    if (!subscriptionData.data) {
      return oldData
    }
    const {nametagId, present} = subscriptionData.data
    const newNametags = oldData.rooms.nametags.reduce(
      (nametags, nametag, i) => {
        if (nametag.id === nametagId) {
          nametags[i].present = present
        }
        return nametags
      }, oldData.rooms.nametags.slice())
    return {
      ...oldData,
      room: {
        ...oldData.room,
        nametags: newNametags
      },
      me: {
        ...oldData.me
      }
    }
  }
})

export const messageAdded = subscribeToMore => roomId => subscribeToMore({
  document: MESSAGE_ADDED,
  variables: {
    roomId: roomId
  },
  updateQuery: (oldData, {subscriptionData}) => {
    console.log('subscriptionData', subscriptionData)
    if (!subscriptionData.data) {
      return oldData
    }
    const {message} = subscriptionData.data

    // Check to see if the message has already been posted (for example, if the current user is the author.)
    const newMessage = oldData.room.messages.reduce((isNew, msg) => msg.id === message.id ? false : isNew, true)
    if (!newMessage) {
      return oldData
    }

    return {
      ...oldData,
      room: {
        ...oldData.room,
        messages: oldData.room.messages
          .concat(message)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      },
      me: {
        ...oldData.me
      }
    }
  }
})
