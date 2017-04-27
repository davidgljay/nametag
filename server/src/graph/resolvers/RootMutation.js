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
      errors: [err]
    }
  }
  throw err
}

const wrap = (mutation, key = 'result') => (obj, args, context) => !context.user
  ? Promise.reject(ErrNotLoggedIn)
  : mutation(obj, args, context)
    .catch(catchErrors)

const RootMutation = {
  createRoom: (obj, {room}, {user, models: {Rooms}}) =>
    Rooms.create(room)
    .then(wrapResponse('room')),

  createMessage: (obj, {message}, {user, models: {Messages}}) => {
    if (!user.nametags[message.room]) {
      return Promise.reject(ErrNotInRoom)
    }
    return Messages.create(message)
    .then(wrapResponse('message'))
  },

  toggleSaved: (obj, {messageId, saved}, {user, models: {Messages}}) =>
    Messages.toggleSaved(messageId, saved)
    .then(wrapResponse('toggleSaved')),

  createNametag: (obj, {nametag}, {user, models: {Nametags}}) =>
    Nametags.create(nametag)
    .then(wrapResponse('nametag')),

  updateLatestVisit: (obj, {nametagId}, {user, models: {Nametags}}) => {
    // Confirm that the user is in the room
    if (Object.keys(user.nametags)
      .reduce((bool, room) => user.nametags[room] === nametagId ? false : bool, true)) {
      return Promise.reject(ErrNotInRoom)
    }
    return Nametags.updateLatestVisit(nametagId)
  },

  createBadge: (obj, {badge}, {user, models: {Badges}}) =>
    Badges.create(badge)
    .then(wrapResponse('badge')),

  createTemplate: (obj, {template}, {user, models: {Templates, Granters}}) =>
    Granters.get(template.granter)
      .then(granter => user.badges[granter.adminTemplate]
        ? Templates.create(template) : ErrNotAuthorized),

  createGranter: (obj, {granter}, {user, models: {Granters}}) =>
    // TODO: Add concept of admin login and require that here.
    Granters.create(granter)
    .then(wrapResponse('granter')),

  updateToken: (obj, {token}, {user, models: {Users}}) =>
    Users.addToken(token),

  updateBadgeRequestStatus: (obj, {badgeRequest, status}, {user, models: {Granters, BadgeRequests}}) =>
    BadgeRequests.get(badgeRequest)
      .then(br => Granters.get(br.granter))
      .then(granter => user.badges[granter.adminTemplate]
        ? BadgeRequests.updateStatus(badgeRequest, status)
          .then(wrapResponse('updateBadgeRequest'))
        : Promise.reject(ErrNotAuthorized)
      ),
  addNote: (obj, {badgeId, text}, {user, models: {Granters, Templates, Badges}}) =>
    Badges.get(badgeId)
      .then(badge => Templates.get(badge.template))
      .then(template => Granters.get(template.granter))
      .then(granter => user.badges[granter.adminTemplate]
        ? Badges.addNote(badgeId, text)
          .then(wrapResponse('addNote'))
        : Promise.reject(ErrNotAuthorized)
      ),
  resetPasswordRequest(obj, {email}, {models:{Users}}) =>
    Users.resetPasswordRequest(email),
  resetPassword(obj, {token, password}, {models:{Users}}) =>
    Users.resetPassword(token, password),
  emailConfirmationRequest(obj, {email}, {models:{Users}}) =>
    Users.emailConfirmationRequest(email),
  emailConfirmation(obj, {token}, {models:{Users}}) =>
    Users.emailConfirmation(token)
}

module.exports = Object.keys(RootMutation).reduce((wrapped, key) => {
  wrapped[key] = wrap(RootMutation[key])
  return wrapped
}, {})
