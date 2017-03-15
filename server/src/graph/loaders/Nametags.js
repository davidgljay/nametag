const r = require('rethinkdb')

/**
 * Returns the nametags from a particular room.
 *
 * @param {Object} context     graph context
 * @param {String} room   the id of the room whose messages will be retrieved
 *
 */

const getRoomNametags = ({conn}, room) => {
  return r.db('nametag').table('nametags').filter({room}).run(conn)
   .then(nametags =>
      nametags.sort((a, b) => b.created_at - a.created_at)
    )
}

 /**
  * Returns a nametag from an id.
  *
  * @param {Object} context     graph context
  * @param {String} id   the id of the nametag to be retrieved
  *
  */

const get = ({conn}, ids) => {
  return r.db('nametag').table('nametags').get(ids).run(conn)
}

//  /**
//   * Returns a nametag from an array of ids.
//   *
//   * @param {Object} context     graph context
//   * @param {Array<String>} ids   an array of ids to be retrieved
//   *
//   */
//
// const getAll = ({conn}, ids) => {
//   return r.db('nametag').table('nametags').get(ids).run(conn)
// }

module.exports = (context) => ({
  Nametags: {
    get: (ids) => get(context, ids),
    getRoomNametags: (room) => getRoomNametags(context, room)
  }
})
