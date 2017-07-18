
import MESSAGE_ADDED from './messageAdded.graphql'
import BADGE_REQUEST_ADDED from './badgeRequestAdded.graphql'
import ROOM_UPDATED from './roomUpdated.graphql'
import NAMETAG_UPDATED from './nametagUpdated.graphql'
import LATEST_MESSAGE_UPDATED from './latestMessageUpdated.graphql'
import MESSAGE_DELETED from './messageDeleted.graphql'

const clearObjectNulls = (object) => Object.keys(object).reduce(
      (obj, key) => object[key] ? {...obj, [key]: object[key]} : obj, {})

export const messageAdded = subscribeToMore => (roomId, nametagId) => subscribeToMore({
  document: MESSAGE_ADDED,
  variables: {
    roomId,
    nametagId
  },
  updateQuery: (oldData, {subscriptionData}) => {
    if (!subscriptionData.data) {
      return oldData
    }
    const message = subscriptionData.data.messageAdded

    // Check to see if the message has already been posted
    // If so, update to the new version of the message
    const newMessage = oldData.room.messages.reduce((isNew, msg) => msg.id === message.id ? false : isNew, true)
    if (!newMessage) {
      return {
        ...oldData,
        room: {
          ...oldData.room,
          messages: oldData.room.messages.map(
            msg => msg.id === message.id ? message : msg
          )
        }
      }
    }

    return {
      ...oldData,
      room: {
        ...oldData.room,
        messages: oldData.room.messages
          .concat(message)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      }
    }
  }
})

export const messageDeleted = subscribeToMore => (roomId) => subscribeToMore({
  document: MESSAGE_DELETED,
  variables: {
    roomId
  },
  updateQuery: (oldData, {subscriptionData: {data: {messageDeleted}}}) => {
    if (!messageDeleted) {
      return oldData
    }

    return {
      ...oldData,
      room: {
        ...oldData.room,
        messages: oldData.room.messages.filter(msg => msg.id !== messageDeleted.id)
      }
    }
  }
})

export const badgeRequestAdded = subscribeToMore => (granterId) => subscribeToMore({
  document: BADGE_REQUEST_ADDED,
  variables: {
    granterId
  },
  updateQuery: (oldData, {subscriptionData: {data: {badgeRequestAdded}}}) => {
    if (!badgeRequestAdded) {
      return oldData
    }

    return {
      ...oldData,
      granter: {
        ...oldData.granter,
        badgeRequests: oldData.granter.badgeRequests
          .concat(badgeRequestAdded)
      }
    }
  }
})

export const latestMessageUpdated = subscribeToMore => (roomIds) => subscribeToMore({
  document: LATEST_MESSAGE_UPDATED,
  variables: {
    roomIds
  },
  updateQuery: (oldData, {subscriptionData: {data: {latestMessageUpdated}}}) => {
    if (!latestMessageUpdated) {
      return oldData
    }

    return {
      ...oldData,
      me: {
        ...oldData.me,
        nametags: oldData.me.nametags.map(nametag => nametag.room && nametag.room.id === latestMessageUpdated.roomId
          ? {
            ...nametag,
            room: {
              ...nametag.room,
              latestMessage: latestMessageUpdated.latestMessage
            }
          }
          : nametag
        )
      }
    }
  }
})

export const roomUpdated = subscribeToMore => (roomId) => subscribeToMore({
  document: ROOM_UPDATED,
  variables: {
    roomId
  },
  updateQuery: (oldData, {subscriptionData: {data: {roomUpdated}}}) => {
    if (!roomUpdated) {
      return oldData
    }

    return {
      ...oldData,
      room: {
        ...oldData.room,
        ...clearObjectNulls(roomUpdated),
        __typename: 'Room'
      }
    }
  }
})

export const nametagUpdated = subscribeToMore => (roomId) => subscribeToMore({
  document: NAMETAG_UPDATED,
  variables: {
    roomId
  },
  updateQuery: (oldData, {subscriptionData: {data: {nametagUpdated}}}) => {
    if (!nametagUpdated) {
      return oldData
    }

    let newNametags
    const nametags = oldData.room.nametags
    if (nametags.filter(n => n.id === nametagUpdated.id).length > 0) {
      newNametags = nametags.map(n => n.id === nametagUpdated.id
        ? {...n, ...clearObjectNulls(nametagUpdated), __typename: 'Nametag'}
        : n)
    } else {
      newNametags = nametags.concat({...nametagUpdated, __typename: 'Nametag'})
    }

    return {
      ...oldData,
      room: {
        ...oldData.room,
        nametags: newNametags
      }
    }
  }
})
