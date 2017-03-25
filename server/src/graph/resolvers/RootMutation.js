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

const RootMutation = {
  createRoom: (obj, {room}, {user, models: {Rooms}}) => {
    return !user ? Promise.reject(errors.ErrNotLoggedIn)
    : Rooms.create(room)
    .then(wrapResponse('room'))
    .catch(catchErrors)
  },
  createMessage: (obj, {message}, {user, models: {Messages}}) => {
    if (!user) {
      return Promise.reject(errors.ErrNotLoggedIn)
    } else if (!user.nametags[message.room]) {
      return Promise.reject(errors.ErrNotInRoom)
    }
    return Messages.create(message)
      .then(wrapResponse('message'))
      .catch(catchErrors)
  },
  toggleSaved: (obj, {messageId, saved}, {user, models: {Messages}}) => {
    if (!user) {
      return Promise.reject(errors.ErrNotLoggedIn)
    }
    return Messages.toggleSaved(messageId, saved)
      .then(wrapResponse('toggleSaved'))
      .catch(catchErrors)
  },
  createNametag: (obj, {nametag}, {user, models: {Nametags}}) => {
    return !user ? Promise.reject(errors.ErrNotLoggedIn)
    : Nametags.create(nametag)
      .then(wrapResponse('nametag'))
      .catch(catchErrors)
  },
  updateLatestVisit: (obj, {nametagId}, {user, models: {Nametags}}) => {
    if (!user) {
      return Promise.reject(errors.ErrNotLoggedIn)
    } else if (
      // Confirm that the user is in the room
      Object.keys(user.nametags).reduce((bool, room) => user.nametags[room] === nametagId ? false : bool, true)
    ) {
      return Promise.reject(errors.ErrNotInRoom)
    }
    return Nametags.updateLatestVisit(nametagId)
      .then(wrapResponse('nametag'))
      .catch(catchErrors)
  },
  createBadge: (obj, {badge}, {user, models: {Badges}}) => {
    return !user ? Promise.reject(errors.ErrNotLoggedIn)
    : Badges.create(badge)
      .then(wrapResponse('badge'))
      .catch(catchErrors)
  }

}

module.exports = RootMutation
