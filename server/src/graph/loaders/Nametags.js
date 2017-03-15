const r = require('rethinkdb')

/**
 * Returns the nametags from a particular room.
 *
 * @param {Object} context     graph context
 * @param {String} room   the id of the room whose messages will be retrieved
 *
 */

const getRoomNametags = ({conn}, room) =>
  r.db('nametag').table('nametags').filter({room}).run(conn)
   .then(cursor => cursor.toArray())
   .then(nametags =>
      nametags.sort((a, b) => b.created_at - a.created_at)
    )

 /**
  * Returns a nametag from an id.
  *
  * @param {Object} context     graph context
  * @param {String} id   the id of the nametag to be retrieved
  *
  */

const get = ({conn}, id) => r.db('nametag').table('nametags').get(id).run(conn)


/**
 * Returns an array of nametags from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} id   the id of the nametag to be retrieved
 *
 */

const getAll = ({conn}, ids) => r.db('nametag').table('nametags').get(id).run(conn)
  .then(cursor => cursor.toArray())


module.exports = (context) => ({
  Nametags: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    getRoomNametags: (room) => getRoomNametags(context, room)
  }
})
