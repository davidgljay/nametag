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
  createRoom: (obj, {room}, {models: {Rooms, Nametags, Users}}) => {
    let modId
    let id
    // Create moderator nametag
    return Nametags.create(room.mod)

    // Create Room
    .then(res => {
      if (res.errors > 0) {
        return new errors.APIError('Error creating nametag')
      }
      modId = res.generated_keys[0]
      return Rooms.create(Object.assign({}, room, {mod: modId}))
    })

    // Update nametag with room id and add nametag id to user
    .then(res => {
      if (res.errors > 0) {
        return new errors.APIError('Error creating room')
      }
      id = res.generated_keys[0]
      return Promise.all([
        Nametags.updateRoom(modId, id),
        Users.addNametag(modId, id)
      ])
    })

    // Return room
    .then(res => {
      if (res.errors > 0) {
        return new errors.APIError(`Error appending nametag ID to user: ${res.first_error}`)
      }
      return Object.assign({}, room, {
        id,
        mod: modId
      })
    })
    .then(wrapResponse('room'))
    .catch(catchErrors)
  },
  createMessage: (obj, {message}, {models: {Messages}}) => {
    return Messages.create(message)
      .then((res) => {
        if (res.errors > 0) {
          return new errors.APIError('Error creating message')
        }
        return Object.assign({}, message, {id: res.generated_keys[0]})
      })
      .then(wrapResponse('message'))
      .catch(catchErrors)
  },
  createNametag: (obj, {nametag}, {models: {Nametags, Users}}) => {
    let id

    // Create nametag
    return Nametags.create(nametag)

      // Append nametag ID to user object
      .then(res => {
        if (res.errors > 0) {
          return new errors.APIError('Error creating nametag')
        }
        id = res.generated_keys[0]
        return Users.appendUserArray('nametags', id)
      })
      .then(res => {
        console.log('Append response', res)
        if (res.errors > 0) {
          return new errors.APIError(`Error appending nametag ID to user: ${res.first_error}`)
        }
        return Object.assign({}, nametag, {id})
      })
      .then(wrapResponse('nametag'))
      .catch(catchErrors)
  },
  createBadge: (obj, {badge}, {user, models: {Badges, Users}}) => {
    let id

    // Create badge
    return Badges.create(badge)

      // Append badge ID to user object
      .then(res => {
        if (res.errors > 0) {
          return new errors.APIError('Error creating nametag')
        }
        id = res.generated_keys[0]
        return Users.appendUserArray('badges', id)
      })
      .then(res => {
        console.log('Append response', res)
        if (res.errors > 0) {
          return new errors.APIError(`Error appending badge ID to user: ${res.first_error}`)
        }
        return Object.assign({}, badge, {id})
      })
      .then(wrapResponse('badge'))
      .catch(catchErrors)
  }
}

module.exports = RootMutation
