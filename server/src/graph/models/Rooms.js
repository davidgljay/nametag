const r = require('rethinkdb')

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

const create = ({conn}, rm) => {
  const room = Object.assign({}, rm, {createdAt: Date.now()})
  return r.db('nametag').table('rooms').insert(room).run(conn)
}

module.exports = (context) => ({
  Rooms: {
    get: (id) => get(context, id),
    getActive: () => getActive(context),
    create: (room) => create(context, room)
  }
})
