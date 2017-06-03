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
* Returns all visible public rooms for this user.
*
* @param {Object} context     graph context
* @param {Object} id          the id of a room to be returned
*
*/

const getVisible = ({conn, user, models: {Users}}, id) =>

  // First, get templates that the user can access as an admin
  Users.getAdminTemplates()
    .then(adminTemplates => {
      const visibleTemplates = user
        ? Object.keys(user.badges).concat(adminTemplates.map(t => t.id))
        : []

      //If an id is passed, return that room if it's visible
      if (id) {
        return Rooms.get(id)
          .then(room => {
            const visible = visibleTemplates.reduce(
              (template, visible) => room.templates.indexOf(template) > -1 || visible, false)
            return room.templates.length === 0 || visible ? [room] : []
          })
      }

      // Otherwise, return all public rooms and rooms that the user can see based on their templates
      // TODO: Add pagination
      return roomsTable
        .between(new Date(), new Date(Date.now() * 100), {index: 'closedAt'})
        .filter(room =>
          r.eq(room('templates').count(), 0)
          || room('templates').contains(template => visibleTemplates.indexOf(template) > -1)
        )
        .run(conn)
        .then(rooms => rooms.toArray())
        .then(arr => arr.sort((a,b) => a.createdAt - b.createdAt))
    })

/**
 * Returns all private rooms for a particular template.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} templateIds  ids of the templates to be searched
 * @param {Boolean} active    Limit search to active rooms
 * @param {String} id         The id of a specific room being searched for
 */

// const getByTemplates = ({conn, user}, templateIds, active, id) => {
//   if (templateIds.length === 0) {
//     return []
//   }
//
//   if (id) {
//     roomsTable.get(id).run(conn)
//       .then(room => {
//         let userHasTemplate = false
//         for (var i = 0; i < room.templates.length; i++) {
//           if (templateIds.indexOf(room.templates[i]) > -1) {
//             userHasTemplate = true
//           }
//         }
//
//         return userHasTemplate &&
//         room.closedAt > new Date()
//         ? [room]
//         : []
//       })
//   }
//   let query = roomsTable.getAll(...templateIds, {index: 'templates'})
//   if (active) {
//     query = query.filter(room => room('closedAt').gt(new Date()))
//   }
//   return query.run(conn)
//     .then(rooms => rooms.toArray())
// }

/**
* Returns active rooms based on a query.
*
* @param {Object} context     graph context
* @param {String} query       a query string
*
*/

const getQuery = ({conn, user, models: {Users}}, query) =>
  Users.getAdminTemplates()
  .then(adminTemplates => {
    const visibleTemplates = user
      ? Object.keys(user.badges).concat(adminTemplates.map(t => t.id))
      : []
    return search(query, visibleTemplates, 'room', 'room')
        .then(roomIds =>
          roomIds.length > 0
          ? roomsTable.getAll(...roomIds).run(conn)
            .then(rooms => rooms.toArray())
          : []
        )
  })


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

/**
 * Updates a room's latestMessage value
 *
 * @param {Object} context     graph context
  * @param {Object} roomId   the room to be updated
 *
 **/

const updateLatestMessage = ({conn}, roomId) =>
  roomsTable.get(roomId).update({latestMessage: new Date()}).run(conn)

module.exports = (context) => ({
  Rooms: {
    get: (id) => get(context, id),
    getVisible: (id) => getVisible(context, id),
    getByTemplates: (templateIds, active) => getByTemplates(context, templateIds, active),
    getQuery: (query) => getQuery(context, query),
    create: (room) => create(context, room),
    updateLatestMessage: (roomId) => updateLatestMessage(context, roomId)
  }
})
