import CHECK_NAMETAG_PRESENCE from './checkNametagPresence.graphql'
import MESSAGE_ADDED from './messageAdded.graphql'
import BADGE_REQUEST_ADDED from './badgeRequestAdded.graphql'
import ROOM_UPDATED from './roomUpdated.graphql'
import NAMETAG_UPDATED from './nametagUpdated.graphql'
import LATEST_MESSAGE_UPDATED from './latestMessageUpdated.graphql'

export const checkNametagPresence = subscribeToMore => roomId => subscribeToMore({
  document: CHECK_NAMETAG_PRESENCE,
  variables: {
    roomId
  },
  updateQuery: (oldData, {subscriptionData}) => {
    if (!subscriptionData.data) {
      return oldData
    }
    const {nametagId, present} = subscriptionData.data.nametagPresence
    const newNametags = oldData.room.nametags.reduce(
      (nametags, nametag, i) => {
        if (nametag.id === nametagId) {
          nametags[i] = {...nametag, present}
        }
        return nametags
      }, oldData.room.nametags.slice())
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
    console.log('RoomUpdated', roomUpdated)
    const newRoomData = Object.keys(roomUpdated).reduce(
      (obj, key) => roomUpdated[key] ? {...obj, [key]: roomUpdated[key]} : obj, {})

    return {
      ...oldData,
      room: {
        ...oldData.room,
        ...newRoomData
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
    console.log('NametagUpdated', nametagUpdated)

    return {
      ...oldData,
      room: {
        ...oldData.room,
        nametags: oldData.nametags.map(n => n.id === nametagUpdated.id
          ? {...n, nametagUpdated}
          : n)
      }
    }
  }
})
