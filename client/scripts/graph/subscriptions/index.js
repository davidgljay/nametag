
import MESSAGE_ADDED from './messageAdded.graphql'
import BADGE_REQUEST_ADDED from './badgeRequestAdded.graphql'
import ROOM_UPDATED from './roomUpdated.graphql'
import NAMETAG_UPDATED from './nametagUpdated.graphql'
import LATEST_MESSAGE_UPDATED from './latestMessageUpdated.graphql'
import TYPING_PROMPT_ADDED from './typingPromptAdded.graphql'
import MESSAGE_DELETED from './messageDeleted.graphql'
import {addTypingPrompt} from '../../actions/TypingPromptActions'

const clearObjectNulls = (object) => Object.keys(object).reduce(
      (obj, key) => object[key] !== null ? {...obj, [key]: object[key]} : obj, {})

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

    const addReply = (msg, reply) =>
    ({
      ...msg,
      replies: msg.replies
        .concat(reply)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
      replyCount: msg.replyCount + 1
    })

    // Check to see if the message has already been posted
    // If so, update to the new version of the message
    const newMessage = oldData.room.messages.reduce((isNew, msg) => {
      if (msg.id === message.id) {
        return false
      }
      for (var i = 0; i < msg.replies.length; i++) {
        if (msg.replies[i].id === message.id) {
          return false
        }
      }
      return isNew
    }, true)

    if (!newMessage) {
      return {
        ...oldData,
        room: {
          ...oldData.room,
          messages: oldData.room.messages.map(
            msg => {
              if (msg.id === message.id) {
                return message
              }
              if (message.parent && msg.id === message.parent.id) {
                return {
                  ...msg,
                  replies: msg.replies.map(reply =>
                    reply.id === message.id
                    ? message
                    : reply
                  )
                }
              }
              return msg
            }
          )
        }
      }
    }

    // Check to see if the new message is a reply.
    // If so add it to the appropriate place in the graph
    // and update the user that a reply has taken place.
    if (message.parent) {
      let replyTo
      if (message.parent.author) {
        replyTo = message.parent.author.name
      } else if (message.parent.nametag) {
        replyTo = message.parent.nametag.name
      }
      let newMessages = oldData.room.messages.map(
        msg => msg.id === message.parent.id
        ? addReply(msg, message)
        : msg
      )
      if (oldData.room.messages.slice().reverse()[0].id !== message.parent.id) {
        newMessages.push({
          __typename: 'Message',
          id: `replyNotif_${message.parent.id}_${message.id}`,
          createdAt: new Date().toISOString(),
          text: `${message.author.name} has replied to ${replyTo}.`,
          editedAt: null,
          replies: [],
          replyCount: 0,
          saved: false,
          parent: null,
          nametag: null,
          template: null,
          recipient: null,
          author: null,
          reactions: []
        })
      }
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
        messages: oldData.room.messages
          .concat(message)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      }
    }
  }
})

export const messageDeleted = subscribeToMore => roomId => subscribeToMore({
  document: MESSAGE_DELETED,
  variables: {
    roomId
  },
  updateQuery: (oldData, {subscriptionData: {data: {messageDeleted}}}) => {
    if (!messageDeleted) {
      return oldData
    }

    if (messageDeleted.parent) {
      return {
        ...oldData,
        room: {
          ...oldData.room,
          messages: oldData.room.messages
            .map(msg => msg.id === messageDeleted.parent.id
              ? {
                ...msg,
                replies: msg.replies.filter(reply => reply.id !== messageDeleted.id)
              }
              : msg)
        }
      }
    }

    return {
      ...oldData,
      room: {
        ...oldData.room,
        messages: oldData.room.messages
          .filter(msg => msg.id !== messageDeleted.id)
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

export const latestMessageUpdated = subscribeToMore => roomIds => subscribeToMore({
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

export const roomUpdated = subscribeToMore => roomId => subscribeToMore({
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

export const nametagUpdated = subscribeToMore => roomId => subscribeToMore({
  document: NAMETAG_UPDATED,
  variables: {
    roomId
  },
  updateQuery: (oldData, {subscriptionData: {data: {nametagUpdated: {nametag}}}}) => {
    if (!nametag) {
      return oldData
    }

    // Reload the page if the user is banned
    if (
      oldData.me &&
      oldData.me.nametags.find(nt => nt.id === nametag.id) &&
      nametag.banned) {
      window.location.reload()
    }

    let newNametags
    const nametags = oldData.room.nametags
    if (nametags.filter(n => n.id === nametag.id).length > 0) {
      newNametags = nametags.map(n => n.id === nametag.id
        ? nametag
        : n)
    } else {
      newNametags = nametags.concat({
        ...nametagUpdated,
        createdAt: new Date(),
        present: true,
        __typename: 'Nametag'})
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

export const typingPromptAdded = subscribeToMore => dispatch => roomId => subscribeToMore({
  document: TYPING_PROMPT_ADDED,
  variables: {
    roomId
  },
  updateQuery: (oldData, {subscriptionData: {data: {typingPromptAdded: {nametagId}}}}) => {
    dispatch(addTypingPrompt(nametagId))
    return oldData
  }
})
