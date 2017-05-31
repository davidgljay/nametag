const r = require('rethinkdb')
const {db} = require('../../db')
const errors = require('../../errors')
const {search} = require('../../elasticsearch')

const roomsTable = db.table('rooms')

/**
 * Returns a particular room.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} id   the id of the room to be retrieved
 *
 */

const get = ({conn}, id) => roomsTable.get(id).run(conn)

/**
* Returns all active public rooms.
*
* @param {Object} context     graph context
* @param {Object} id          the id of a room to be returned
*
*/

const getPublic = ({conn, user}, id) => {
  if (id) {
    return roomsTable.get(id).run(conn)
      .then(room => room && room.closedAt > new Date() && room.templates.length === 0
        ? [room]
        : []
      )
  }
  let query = roomsTable
    .between(new Date(), new Date(Date.now() * 100), {index: 'closedAt'})
    .filter(room => r.eq(room('templates').count(), 0))

  if (id) {
    query = query.filter(room => r.eq(room('id'), id))
  }

  return query.run(conn)
    .then(rooms => rooms.toArray())
}

/**
 * Returns all private rooms for a particular template.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} templateIds  ids of the templates to be searched
 * @param {Boolean} active    Limit search to active rooms
 * @param {String} id         The id of a specific room being searched for
 */

const getByTemplates = ({conn, user}, templateIds, active, id) => {
  if (templateIds.length === 0) {
    return []
  }

  if (id) {
    roomsTable.get(id).run(conn)
      .then(room => {
        let userHasTemplate = false
        for (var i = 0; i < room.templates.length; i++) {
          if (templateIds.indexOf(room.templates[i]) > -1) {
            userHasTemplate = true
          }
        }

        return userHasTemplate &&
        room.closedAt > new Date()
        ? [room]
        : []
      })
  }
  let query = roomsTable.getAll(...templateIds, {index: 'templates'})
  if (active) {
    query = query.filter(room => room('closedAt').gt(new Date()))
  }
  return query.run(conn)
    .then(rooms => rooms.toArray())
}

/**
* Returns active rooms based on a query rooms.
*
* @param {Object} context     graph context
* @param {String} query       a query string
*
*/

const getQuery = ({conn, user}, query) =>
  search(query, Object.keys(user.badges), 'room', 'room')
    .then(roomIds => roomsTable.getAll(...roomIds))
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
  return roomsTable.insert(room).run(conn)
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
      roomsTable.get(id).update({mod: modId}).run(conn),
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
    getPublic: (search) => getPublic(context, search),
    getByTemplates: (templateIds, active) => getByTemplates(context, templateIds, active),
    create: (room) => create(context, room)
  }
})
