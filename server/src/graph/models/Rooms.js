const r = require('rethinkdb')
const errors = require('../../errors')

/**
 * Returns a particular room.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} id   the id of the room to be retrieved
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
  .between(new Date(), new Date(Date.now() * 100), {index: 'closedAt'}).run(conn)
  .then(rooms => rooms.toArray())

/**
 * Creates a room
 *
 * @param {Object} context     graph context
 * @param {Object} room   the room to be created
 *
 **/

const create = ({conn, models: {Nametags, Users}}, rm) => {
  const room = Object.assign({}, rm, {createdAt: new Date()})
  return r.db('nametag').table('rooms').insert(room).run(conn)
  .then((res) => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating room')
    }
    const id = res.generated_keys[0]
    const nametag = Object.assign({}, room.mod, {room: id})
    return Promise.all([
      Nametags.create(nametag),
      id,
      room
    ])
  })
  .then(([nametag, id, room]) => {
    const modId = nametag.id
    return Promise.all([
      r.db('nametag').table('rooms').get(id).update({mod: modId}).run(conn),
      id,
      modId,
      room
    ])
  })

  // Return room
  .then(([res, id, modId, room]) => {
    if (res.errors > 0) {
      return new errors.APIError(`Error updating room with mod: ${res.first_error}`)
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
