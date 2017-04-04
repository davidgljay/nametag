const errors = require('../../errors')

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
  if (err instanceof errors.APIError) {
    return {
      errors: [err]
    }
  }
  throw err
}

const wrap = (mutation, key = 'result') => (obj, args, context) => !context.user
  ? Promise.reject(errors.ErrNotLoggedIn)
  : mutation(obj, args, context)
    .catch(catchErrors)

const RootMutation = {
  createRoom: (obj, {room}, {user, models: {Rooms}}) =>
    Rooms.create(room)
    .then(wrapResponse('room')),

  createMessage: (obj, {message}, {user, models: {Messages}}) => {
    if (!user.nametags[message.room]) {
      return Promise.reject(errors.ErrNotInRoom)
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
      return Promise.reject(errors.ErrNotInRoom)
    }
    return Nametags.updateLatestVisit(nametagId)
  },

  createBadge: (obj, {badge}, {user, models: {Badges}}) =>
    Badges.create(badge)
    .then(wrapResponse('badge')),

  createBadgeTemplate: (obj, {template}, {user, models: {BadgeTemplates}}) =>
    BadgeTemplates.create(template),

  createBadgeGranter: (obj, {granter}, {user, models: {BadgeGranters}}) =>
    // TODO: Add concept of admin login and require that here.
    BadgeGranters.create(granter)
    .then(wrapResponse('granter')),

  updateToken: (obj, {token}, {user, models: {Users}}) =>
    Users.addToken(token)
}

module.exports = Object.keys(RootMutation).reduce((wrapped, key) => {
  wrapped[key] = wrap(RootMutation[key])
  return wrapped
}, {})
