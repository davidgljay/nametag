const {APIError, ErrNotInRoom, ErrNotLoggedIn, ErrNotAuthorized} = require('../../errors')

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

const wrap = (mutation, key = 'result', requires) => (obj, args, context) => {
  if (requires === 'LOGIN' && !context.user) {
    return Promise.reject(ErrNotLoggedIn)
  }
  return mutation(obj, args, context)
    .catch(catchErrors)
}

const RootMutation = {
  createRoom: {
    requires: 'LOGIN',
    resolve: (obj, {room}, {user, models: {Rooms}}) =>
      Rooms.create(room)
      .then(wrapResponse('room'))
  },
  setModOnlyDMs: {
    requires: 'ROOM_MOD',
    resolve: (obj, {roomId, modOnlyDMs}, {models: {Rooms}}) =>
      Rooms.setModOnlyDMs(roomId, modOnlyDMs)
        .then(wrapResponse('setModOnlyDMs'))
  },
  createMessage: {
    requires: 'LOGIN',
    resolve: (obj, {message}, {user, models: {Messages}}) => {
      if (!user.nametags[message.room]) {
        return Promise.reject(ErrNotInRoom)
      }
      return Messages.create(message)
      .then(wrapResponse('message'))
    }
  },
  toggleSaved: {
    requires: 'LOGIN',
    resolve: (obj, {messageId, saved}, {user, models: {Messages}}) =>
    Messages.toggleSaved(messageId, saved)
    .then(wrapResponse('toggleSaved'))
  },
  createNametag: {
    requires: 'LOGIN',
    resolve: (obj, {nametag}, {user, models: {Nametags}}) =>
    Nametags.create(nametag)
    .then(wrapResponse('nametag'))
  },
  updateLatestVisit: {
    requires: 'LOGIN',
    resolve: (obj, {nametagId}, {user, models: {Nametags}}) => {
      // Confirm that the user is in the room
      if (Object.keys(user.nametags)
        .reduce((bool, room) => user.nametags[room] === nametagId ? false : bool, true)) {
        return Promise.reject(ErrNotInRoom)
      }
      return Nametags.updateLatestVisit(nametagId)
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
    requires: 'LOGIN',
    resolve: (obj, {granter}, {user, models: {Granters}}) =>
      // TODO: Add concept of admin login and require that here.
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
  }
}

module.exports = Object.keys(RootMutation).reduce((wrapped, key) => {
  wrapped[key] = wrap(RootMutation[key].resolve, RootMutation[key].requires)
  return wrapped
}, {})
