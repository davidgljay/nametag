const {
  APIError,
  ErrNotInRoom,
  ErrNotLoggedIn,
  ErrNotAuthorized,
  ErrNotMod,
  ErrBanned,
  ErrNotYourNametag,
  ErrNotNametagAdmin,
  ErrNotYourMessage
} = require('../../errors')
const pubsub = require('../subscriptions/pubsub')

/**
 * Wraps up a promise to return an object with the resolution of the promise
 * keyed at `key` or an error caught at `errors`.
 */
const wrapResponse = (key) => (value) => {
  let res = {}
  if (key) {
    res[key] = value
  }
  return res
}

const catchErrors = (err) => {
  if (err instanceof APIError) {
    return {
      errors: [err.toJSON()]
    }
  }
  throw err
}

const wrap = (mutation, requires, key = 'result') => (obj, args, context) => {
  let promise
  switch (requires) {

    case 'LOGIN':
      promise = !context.user
      ? Promise.reject(ErrNotLoggedIn)
      : mutation(obj, args, context)
      break
    case 'IN_ROOM':
      if (!context.user) {
        promise = Promise.reject(ErrNotLoggedIn)
      } else if (!context.user.nametags[args.message.room]) {
        promise = Promise.reject(ErrNotInRoom)
      } else {
        promise = context.models.Nametags.get(context.user.nametags[args.message.room])
          .then(nametag => nametag.banned ? Promise.reject(ErrBanned)
          : mutation(obj, args, context))
      }
      break
    case 'ROOM_MOD':
      promise = context.models.Rooms.get(args.roomId)
      .then(room => room && room.mod === context.user.nametags[room.id]
        ? mutation(obj, args, context)
        : Promise.reject(ErrNotMod)
      )
      break
    case 'MY_MESSAGE':
      promise = context.models.Messages.get(args.messageId)
      .then(message => message &&
        message.author === context.user.nametags[args.roomId] &&
        message.room === args.roomId
        ? mutation(obj, args, context)
        : Promise.reject(ErrNotYourMessage)
      )
      break
    case 'MOD_OR_MINE':
      promise = Promise.all([
        context.models.Rooms.get(args.roomId),
        context.models.Messages.get(args.messageId)
      ])
      .then(([room, message]) =>
        (
          room.mod === context.user.nametags[room.id] ||
          message.author === context.user.nametags[room.id]
        ) && message.room === room.id
        ? mutation(obj, args, context)
        : Promise.reject(ErrNotMod)
      )
      break

    case 'MY_NAMETAG':
      if (!context.user) {
        promise = Promise.reject(ErrNotLoggedIn)
      } else {
        const myNametagIds = Object.keys(context.user.nametags)
        .map(roomId => context.user.nametags[roomId])
        promise = myNametagIds.indexOf(args.nametagId) > -1
      ? mutation(obj, args, context)
      : Promise.reject(ErrNotYourNametag)
      }
      break
    case 'NAMETAG_ADMIN':
      const {user, models: {Granters, Templates}} = context
      if (!user) {
        promise = Promise.reject(ErrNotLoggedIn)
      } else {
        promise = Granters.getByUrlCode('nametag')
        .then(({id}) => {
          return Templates.getGranterTemplates(id)
        })
        .then((templates) => {
          const adminTemplate = templates.find(template => template.name === 'Admin')
          return user.badges[adminTemplate.id]
          ? mutation(obj, args, context)
          : Promise.reject(ErrNotNametagAdmin)
        })
      }
      break
    default:
      promise = mutation(obj, args, context)
  }
  return promise.catch(catchErrors)
}

const RootMutation = {
  createRoom: {
    requires: 'LOGIN',
    resolve: (obj, {room}, {user, models: {Rooms}}) =>
      Rooms.create(room)
      .then(wrapResponse('room'))
  },
  updateRoom: {
    requires: 'ROOM_MOD',
    resolve: (obj, {roomId, roomUpdate}, {models: {Rooms}}) =>
      Rooms.update(roomId, roomUpdate)
        .then(wrapResponse('updateRoom'))
  },
  createMessage: {
    requires: 'IN_ROOM',
    resolve: (obj, {message}, {user, models: {Messages}}) =>
      Messages.create(message)
        .then(wrapResponse('message'))
  },
  editMessage: {
    requires: 'MY_MESSAGE',
    resolve: (obj, {messageId, text}, {models: {Messages}}) =>
      Messages.edit(messageId, text)
      .then(wrapResponse('deleteMessage'))
  },
  deleteMessage: {
    requires: 'MOD_OR_MINE',
    resolve: (obj, {messageId, roomId}, {models: {Messages}}) =>
      Messages.delete(messageId)
      .then(wrapResponse('deleteMessage'))
  },
  addReaction: {
    requires: 'LOGIN',
    resolve: (obj, {messageId, emoji, nametagId}, {models: {Messages}}) =>
      Messages.addReaction(messageId, emoji, nametagId)
      .then(wrapResponse('addReaction'))
  },
  toggleSaved: {
    requires: 'LOGIN',
    resolve: (obj, {messageId, saved}, {models: {Messages}}) =>
    Messages.toggleSaved(messageId, saved)
      .then(wrapResponse('toggleSaved'))
  },
  createNametag: {
    requires: 'LOGIN',
    resolve: (obj, {nametag}, {user, models: {Nametags}}) =>
    Nametags.create(nametag)
    .then(wrapResponse('nametag'))
  },
  updateNametag: {
    requires: 'MY_NAMETAG',
    resolve: (obj, {nametagId, nametagUpdate}, {models: {Nametags}}) =>
      Nametags.update(nametagId, nametagUpdate)
        .then(wrapResponse('updateNametag'))
  },
  updateLatestVisit: {
    requires: 'MY_NAMETAG',
    resolve: (obj, {nametagId}, {user, models: {Nametags}}) => {
      // Confirm that the user is in the room
      if (Object.keys(user.nametags)
        .reduce((bool, room) => user.nametags[room] === nametagId ? false : bool, true)) {
        return Promise.reject(ErrNotInRoom)
      }
      return Nametags.updateLatestVisit(nametagId)
      .then(wrapResponse('updateLatestVisit'))
    }
  },
  showTypingPrompt: {
    requires: 'MY_NAMETAG',
    resolve: (obj, prompt) => {
      pubsub.publish('typingPromptAdded', prompt)
      return Promise.resolve()
        .then(wrapResponse('typingPrompt'))
    }
  },
  createBadge: {
    requires: 'LOGIN',
    resolve: (obj, {badge}, {user, models: {Badges}}) =>
      Badges.create(badge)
      .then(wrapResponse('badge'))
  },
  createTemplate: {
    requires: 'LOGIN',
    resolve: (obj, {template}, {user, models: {Templates, Granters}}) =>
      Granters.get(template.granter)
        .then(granter => user.badges[granter.adminTemplate]
          ? Templates.create(template) : ErrNotAuthorized)
  },
  createGranter: {
    requires: 'NAMETAG_ADMIN',
    resolve: (obj, {granter}, {user, models: {Granters}}) =>
      Granters.create(granter)
      .then(wrapResponse('granter'))
  },
  updateToken: {
    requires: 'LOGIN',
    resolve: (obj, {token}, {user, models: {Users}}) =>
    Users.addToken(token)
    .then(wrapResponse('updateToken'))
  },
  updateBadgeRequestStatus: {
    requires: 'LOGIN',
    resolve: (obj, {badgeRequest, status}, {user, models: {Granters, BadgeRequests}}) =>
      BadgeRequests.get(badgeRequest)
        .then(br => Granters.get(br.granter))
        .then(granter => user.badges[granter.adminTemplate]
          ? BadgeRequests.updateStatus(badgeRequest, status)
            .then(wrapResponse('updateBadgeRequest'))
          : Promise.reject(ErrNotAuthorized)
        )
  },
  addNote: {
    requires: 'LOGIN',
    resolve: (obj, {badgeId, text}, {user, models: {Granters, Templates, Badges}}) =>
      Badges.get(badgeId)
        .then(badge => Templates.get(badge.template))
        .then(template => Granters.get(template.granter))
        .then(granter => user.badges[granter.adminTemplate]
          ? Badges.addNote(badgeId, text)
            .then(wrapResponse('addNote'))
          : Promise.reject(ErrNotAuthorized)
        )
  },
  approveRoom: {
    requires: 'NAMETAG_ADMIN',
    resolve: (obj, {roomId}, {models: {Rooms}}) =>
      Rooms.approveRoom(roomId)
      .then(wrapResponse('approveRoom'))
  },
  banNametag: {
    requires: 'ROOM_MOD',
    resolve: (obj, {roomId, nametagId}, {models: {Nametags}}) =>
      Nametags.ban(nametagId, roomId)
      .then(wrapResponse('banNametag'))
  },
  passwordResetRequest: {
    requires: null,
    resolve: (obj, {email}, {models: {Users}}) =>
      Users.passwordResetRequest(email)
  },
  passwordReset: {
    requires: null,
    resolve: (obj, {token, password}, {models: {Users}}) =>
      Users.passwordReset(token, password)
  },
  emailConfirmationRequest: {
    requires: null,
    resolve: (obj, {email}, {models: {Users}}) =>
      Users.emailConfirmationRequest(email)
  },
  emailConfirmation: {
    requires: null,
    resolve: (obj, {token}, {models: {Users}}) =>
      Users.emailConfirmation(token)
  },
  unsubscribe: {
    requires: null,
    resolve: (obj, {userToken, roomId}, {models: {Users}}) =>
      Users.unsubscribe(userToken, roomId)
  }
}

module.exports = Object.keys(RootMutation).reduce((wrapped, key) => {
  wrapped[key] = wrap(RootMutation[key].resolve, RootMutation[key].requires)
  return wrapped
}, {})
