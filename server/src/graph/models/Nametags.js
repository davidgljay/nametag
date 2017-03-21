const r = require('rethinkdb')
const errors = require('../../errors')

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

const getAll = ({conn}, ids) => r.db('nametag').table('nametags').get(ids).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Creates a nametag
 *
 * @param {Object} context     graph context
 * @param {Object} nametag   the nametag to be created
 *
 **/

const create = ({conn, models: {Users}}, nt) => {
  const nametag = Object.assign({}, nt, {createdAt: Date.now()})
  return r.db('nametag').table('nametags').insert(nametag).run(conn)
  // Append nametag ID to user object
  .then(res => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating nametag')
    }
    const id = res.generated_keys[0]
    return Promise.all([
      Users.addNametag('nametags', id, nametag.room),
      id
    ])
  })
  .then(([res, id]) => {
    if (res.errors > 0) {
      return new errors.APIError(`Error appending nametag ID to user: ${res.first_error}`)
    }
    return Object.assign({}, nametag, {id})
  })
}

/**
 * Update Nametag Room
 * When a mod is created we don't know the room's ID yet. This command updates the room field with the proper id.
 *
 * @param {Object} context     graph context
 * @param {String} nametagId   the id of the nametag to be update
 * @param {String} roomId      the room id to be inserted
 *
 **/

const updateRoom = ({conn}, nametagId, roomId) =>
  r.db('nametag').table('nametags').get(nametagId).update({room: roomId}).run(conn)

/**
 * Adds a mention to a nametag
 *
 * @param {Object} context     graph context
 * @param {String} nametag      the id of the nametag to be updated
 *
 **/

const addMention = ({conn}, nametag) => r.db('nametag').table('nametags').get(nametag)
.update({mentions: r.row('mentions').prepend(Date.now())}).run(conn)

module.exports = (context) => ({
  Nametags: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    getRoomNametags: (room) => getRoomNametags(context, room),
    create: (nametag) => create(context, nametag),
    updateRoom: (nametagId, roomId) => updateRoom(context, nametagId, roomId),
    addMention: (nametag) => addMention(context, nametag)
  }
})
