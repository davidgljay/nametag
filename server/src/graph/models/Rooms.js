const r = require('rethinkdb')
const errors = require('../../errors')

/**
 * Returns a particular room.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   an array of ids to be retrieved
 *
 */

const get = ({conn}, id) => r.db('nametag').table('rooms').get(id).run(conn)

 /**
  * Returns all active rooms. This will be replaced in the future with a more nuanced room display search.
  *
  * @param {Object} context     graph context
  *
  */

const getActive = ({conn}) => r.db('nametag').table('rooms')
  .between(Date.now(), Number.MAX_SAFE_INTEGER).run(conn)
  .then(rooms => rooms.toArray())

/**
 * Creates a room
 *
 * @param {Object} context     graph context
 * @param {Object} room   the room to be created
 *
 **/

const create = ({conn, models: {Nametags, Users}}, rm) => {
  return Nametags.create(rm.mod)

  // Create Room
  .then(nametag => {
    const modId = nametag.id
    const room = Object.assign({}, rm, {createdAt: Date.now(), mod: modId})
    return Promise.all([
      r.db('nametag').table('rooms').insert(room).run(conn),
      modId,
      room
    ])
  })

  // Update nametag with room id and add nametag id to user
  .then(([res, modId, room]) => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating room')
    }
    const id = res.generated_keys[0]
    return Promise.all([
      Nametags.updateRoom(modId, id),
      Users.addNametag(modId, id),
      id,
      modId,
      room
    ])
  })

  // Return room
  .then(([ntRes, userRes, id, modId, room]) => {
    if (ntRes.errors > 0) {
      return new errors.APIError(`Error appending nametag ID to user: ${ntRes.first_error}`)
    }
    if (userRes.errors > 0) {
      return new errors.APIError(`Error appending nametag ID to user: ${userRes.first_error}`)
    }
    return Object.assign({}, room, {
      id,
      mod: modId
    })
  })
}

module.exports = (context) => ({
  Rooms: {
    get: (id) => get(context, id),
    getActive: () => getActive(context),
    create: (room) => create(context, room)
  }
})
