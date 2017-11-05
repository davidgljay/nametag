import {graphql} from 'react-apollo'
import CREATE_NAMETAG from './createNametag.graphql'
import CREATE_ROOM from './createRoom.graphql'
import CREATE_MESSAGE from './createMessage.graphql'
import CREATE_BADGE from './createBadge.graphql'
import CREATE_BADGE_TEMPLATE from './createTemplate.graphql'
import TOGGLE_SAVED from './toggleSaved.graphql'
import ADD_REACTION from './addReaction.graphql'
import UPDATE_ROOM from './updateRoom.graphql'
import UPDATE_NAMETAG from './updateNametag.graphql'
import UPDATE_LATEST_VISIT from './updateLatestVisit.graphql'
import SHOW_TYPING_PROMPT from './showTypingPrompt.graphql'
import UPDATE_BADGE_REQUEST_STATUS from './updateBadgeRequestStatus.graphql'
import UPDATE_TOKEN from './updateToken.graphql'
import DELETE_MESSAGE from './deleteMessage.graphql'
import EDIT_MESSAGE from './editMessage.graphql'
import PASSWORD_RESET from './passwordReset.graphql'
import UNSUBSCRIBE from './unsubscribe.graphql'
import SET_MOD_ONLY_DMS from './setModOnlyDMs.graphql'
import PASSWORD_RESET_REQ from './passwordResetRequest.graphql'
import EMAIL_CONF_REQ from './emailConfirmationRequest.graphql'
import EMAIL_CONF from './emailConfirmation.graphql'
import ADD_NOTE from './addNote.graphql'
import APPROVE_ROOM from './approveRoom.graphql'
import BAN_NAMETAG from './banNametag.graphql'
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

export const showTypingPrompt = graphql(SHOW_TYPING_PROMPT, {
  props: ({ownProps, mutate}) => ({
    showTypingPrompt: (nametagId, roomId) => mutate({
      variables: {
        nametagId,
        roomId
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

export const createBadge = graphql(CREATE_BADGE, {
  props: ({ownProps, mutate}) => ({
    createBadge: (badge) => mutate({
      variables: {
        badge
      },
      updateQueries: {
        granterQuery: (oldData, {mutationResult: {data: {createBadge: {errors, badge}}}}) => {
          if (errors) {
            errorLog('Error creating badge')(errors)
            return oldData
          }
          return {
            ...oldData,
            granter: {
              ...oldData.granter,
              templates: oldData.granter.templates.map(template =>
                template.id === badge.template.id
                ? {
                  ...template,
                  badges: template.badges.concat(badge)
                }
                : template
              )
            }
          }
        }
      }
    })
  })
})

export const passwordResetRequest = graphql(PASSWORD_RESET_REQ, {
  props: ({ownProps, mutate}) => ({
    passwordResetRequest: (email) => mutate({
      variables: {
        email
      }
    })
  })
})

export const passwordReset = graphql(PASSWORD_RESET, {
  props: ({ownProps, mutate}) => ({
    passwordReset: (token, password) => mutate({
      variables: {
        token,
        password
      }
    })
  })
})

export const unsubscribe = graphql(UNSUBSCRIBE, {
  props: ({ownProps, mutate}) => ({
    unsubscribe: (userToken, roomId) => mutate({
      variables: {
        userToken,
        roomId
      }
    })
  })
})

export const emailConfirmationRequest = graphql(EMAIL_CONF_REQ, {
  props: ({ownProps, mutate}) => ({
    emailConfirmationRequest: (email) => mutate({
      variables: {
        email
      }
    })
  })
})

export const emailConfirmation = graphql(EMAIL_CONF, {
  props: ({ownProps, mutate}) => ({
    emailConfirmation: (token) => mutate({
      variables: {
        token
      }
    })
  })
})

export const approveRoom = graphql(APPROVE_ROOM, {
  props: ({ownProps, mutate}) => ({
    approveRoom: (roomId) => mutate({
      variables: {
        roomId
      }
    })
  })
})

export const banNametag = graphql(BAN_NAMETAG, {
  props: ({ownProps, mutate}) => ({
    banNametag: (roomId, nametagId) => mutate({
      variables: {
        roomId,
        nametagId
      }
    })
  })
})

export const updateBadgeRequestStatus = graphql(UPDATE_BADGE_REQUEST_STATUS, {
  props: ({ownProps, mutate}) => ({
    updateBadgeRequestStatus: (badgeRequest, status) => mutate({
      variables: {
        badgeRequest,
        status
      },
      updateQueries: {
        granterQuery: (oldData, {mutationResult: {data: {updateBadgeRequestStatus: {errors}}}}) => {
          if (errors) {
            errorLog('Error updating badge request status')(errors)
            return oldData
          }
          return {
            ...oldData,
            granter: {
              ...oldData.granter,
              badgeRequests: oldData.granter.badgeRequests.filter(br => br.id !== badgeRequest)
            }
          }
        }
      }
    })
  })
})

export const updateNametag = graphql(UPDATE_NAMETAG, {
  props: ({ownProps, mutate}) => ({
    updateNametag: (nametagId, nametagUpdate) => mutate({
      variables: {
        nametagId,
        nametagUpdate
      },
      optimisticResponse: {
        updateNametag: {
          errors: null
        }
      },
      updateQueries: {
        roomQuery: (oldData, {mutationResult: {data: {updateNametag: {errors}}}}) => {
          if (errors) {
            errorLog('Error updating nametag')(errors)
            return oldData
          }

          return {
            ...oldData,
            room: {
              ...oldData.room,
              nametags: oldData.room.nametags
                .map(nametag => nametag.Id === nametagId
                  ? {...nametag, ...nametagUpdate} : nametag)
            }
          }
        }
      }
    })
  })
})

export const createTemplate = graphql(CREATE_BADGE_TEMPLATE, {
  props: ({ownProps, mutate}) => ({
    createBadge: (template) => mutate({
      variables: {
        template
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
          __typename: 'CreateMessageResponse',
          message: {
            __typename: 'Message',
            id: `tempMessage_${Date.now()}`,
            text: message.text,
            createdAt: new Date().toISOString(),
            editedAt: null,
            saved: false,
            replies: [],
            replyCount: 0,
            author: {
              __typename: 'Nametag',
              image: author.image,
              id: author.id,
              name: author.name
            },
            recipient: null,
            reactions: [],
            parent: message.parent ? {
              __typename: 'Message',
              id: message.parent,
              author: {
                __typename: 'Nametag',
                id: 'tempAuthor',
                name: ''
              }
            }
            : null
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

          const addReply = (msg, reply) => ({
            ...msg,
            replies: msg.replies
              .concat(reply)
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
            replyCount: msg.replyCount + 1
          })

          let isNew = true
          const oldMessages = oldData.room.messages
          let newMessages = oldMessages.slice()
          for (var i = 0; i < oldMessages.length; i++) {
            const msg = oldMessages[i]
            if (msg.id === message.id) {
              isNew = false
              newMessages[i] = message
            }
            for (var j = 0; j < msg.replies.length; j++) {
              if (msg.replies[j].id === message.id) {
                isNew = false

                newMessages[i] = {
                  ...msg,
                  replies: msg.replies.map(reply =>
                    reply.id === message.id
                    ? message
                    : reply
                  )
                }
              }
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

          if (message.parent) {
            return {
              ...oldData,
              room: {
                ...oldData.room,
                messages: oldData.room.messages.map(
                  msg => msg.id === message.parent.id
                  ? addReply(msg, message)
                  : msg
                )
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

export const addReaction = graphql(ADD_REACTION, {
  props: ({ownProps, mutate}) => ({
    addReaction: (messageId, emoji, nametagId) => mutate({
      variables: {
        messageId,
        emoji,
        nametagId
      },
      optimisticResponse: {
        addReaction: {
          errors: null,
          __typename: 'BasicResponse'
        }
      },
      updateQueries: {
        roomQuery: (oldData, {mutationResult: {data: {addReaction: {errors}}}}) => {
          if (errors) {
            errorLog('Error adding reaction')(errors)
            return oldData
          }
          return {
            ...oldData,
            room: {
              ...oldData.room,
              messages: oldData.room.messages.map(
                message => {
                  if (message.id !== messageId) {
                    return message
                  }
                  if (message.reactions.filter(reaction =>
                      reaction.emoji === emoji && reaction.nametagId === nametagId
                    ).length === 0) {
                    message.reactions.push({
                      emoji,
                      nametagId,
                      __typename: 'EmojiReaction'
                    })
                  }
                  return message
                }
              )
            }
          }
        }
      }
    })
  })
})

export const deleteMessage = graphql(DELETE_MESSAGE, {
  props: ({ownProps, mutate}) => ({
    deleteMessage: (messageId, roomId) => mutate({
      variables: {
        messageId,
        roomId
      }
    })
  })
})

export const editMessage = graphql(EDIT_MESSAGE, {
  props: ({ownProps, mutate}) => ({
    editMessage: (messageId, roomId, text) => mutate({
      variables: {
        messageId,
        roomId,
        text
      }
    })
  })
})

export const setModOnlyDMs = graphql(SET_MOD_ONLY_DMS, {
  props: ({ownProps, mutate}) => ({
    setModOnlyDMs: (roomId, modOnlyDMs) => mutate({
      variables: {
        roomId,
        modOnlyDMs
      },
      optimisticResponse: {
        setModOnlyDMs: {
          errors: null
        }
      },
      updateQueries: {
        roomQuery: (oldData, {mutationResult: {data: {setModOnlyDMs: {errors}}}}) => {
          if (errors) {
            errorLog('Error setting mod only DMs')(errors)
            return oldData
          }
          return {
            ...oldData,
            room: {
              ...oldData.room,
              modOnlyDMs
            }
          }
        }
      }
    })
  })
})

export const updateRoom = graphql(UPDATE_ROOM, {
  props: ({ownProps, mutate}) => ({
    updateRoom: (roomId, roomUpdate) => mutate({
      variables: {
        roomId,
        roomUpdate
      },
      optimisticResponse: {
        updateRoom: {
          errors: null
        }
      },
      updateQueries: {
        roomQuery: (oldData, {mutationResult: {data: {updateRoom: {errors}}}}) => {
          if (errors) {
            errorLog('Error updating room')(errors)
            return oldData
          }
          return {
            ...oldData,
            room: {
              ...oldData.room,
              ...roomUpdate
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

export const addNote = graphql(ADD_NOTE, {
  props: ({ownProps, mutate}) => ({
    addNote: (badgeId, text) => mutate({
      variables: {
        badgeId,
        text
      },
      optimisticResponse: {
        addNote: {
          errors: null
        }
      },
      updateQueries: {
        granterQuery: (oldData, {mutationResult: {data: {addNote: {errors}}}}) => {
          if (errors) {
            errorLog('Error adding note')(errors)
            return oldData
          }
          return {
            ...oldData,
            granter: {
              ...oldData.granter,
              templates: oldData.granter.templates.map(template => {
                for (let i = 0; i < template.badges.length; i++) {
                  if (template.badges[i].id === badgeId) {
                    template.badges[i].notes = [{
                      text,
                      date: new Date().toISOString()
                    }].concat(template.badges[i].notes)
                  }
                }
                return template
              })
            }
          }
        }
      }
    })
  })
})
