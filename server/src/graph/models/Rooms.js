const r = require('rethinkdb')
const {db} = require('../../db')
const errors = require('../../errors')
const {ROOM_TIMEOUT} = require('../../constants')
const {search} = require('../../elasticsearch')
const pubsub = require('../subscriptions/pubsub')
const notification = require('../../notifications')

const roomsTable = db.table('rooms')

/**
 * Returns a particular room.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the room to be retrieved
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

const getVisible = ({conn, user, models: {Users}}) =>

  // First, get templates that the user can access as an admin
  Users.getAdminTemplates()
    .then(adminTemplates => {
      const visibleTemplates = user && user.badges
        ? Object.keys(user.badges).concat(adminTemplates.map(t => t.id))
        : []

      // Otherwise, return all public rooms and rooms that the user can see based on their templates
      // TODO: Add pagination
      return roomsTable.between(new Date(Date.now() - ROOM_TIMEOUT), new Date(), {index: 'latestMessage'})
        .orderBy({index: 'latestMessage'})
        .filter(room =>
          room('templates').count().eq(0) ||
          room('templates')
            .setIntersection(visibleTemplates)
            .count().gt(0)
         )
        .limit(10)
        .run(conn)
        .then(cursor => cursor.toArray())
    })

/**
 * Returns all private rooms for a particular granter.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} granterCode  urlCode of the granter to be returned
 */

const getGranterRooms = ({conn, user, models: {Users}}, granterCode) => {
  return user
  ? db.table('granters').getAll(granterCode, {index: 'urlCode'})
    .eqJoin('id', r.db('nametag').table('templates'), {index: 'granter'})
    .map(join => join('right'))
    .pluck('id')
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(templateIds => {
      const userTemplateIds = templateIds.map(t => t.id).filter(id => !!user.badges[id])
      if (userTemplateIds.length === 0) {
        return Promise.resolve([])
      }
      return roomsTable.between(new Date(Date.now() - ROOM_TIMEOUT), new Date(), {index: 'latestMessage'})
        .orderBy({index: 'latestMessage'})
        .filter(room =>
          room('templates')
            .setIntersection(userTemplateIds)
            .count().gt(0)
         )
        .run(conn)
        .then(cursor => cursor.toArray())
    })
  : Promise.resolve([])
}

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
  const room = Object.assign({}, rm, {createdAt: new Date(), modOnlyDMs: false, mod: null})
  return Promise.all([
    roomsTable.insert(room).run(conn),
    rm.mod
  ])
  .then(([res, mod]) => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating room')
    }
    const id = res.generated_keys[0]
    const nametag = Object.assign({}, mod, {room: id})
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
 * Updates am arbitrary component in a room
 *
 * @param {Object} context     graph context
 * @param {Object} roomUpdate   the data about the room to be updated
 *
 **/

const update = ({conn}, roomId, roomUpdate) => {
  pubsub.publish('roomUpdated', Object.assign({}, roomUpdate, {id: roomId}))
  return roomsTable.get(roomId).update(roomUpdate).run(conn)
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

  /**
   * Updates a room's modOnlyDMs setting
   *
   * @param {Object} context     graph context
   * @param {String} roomId   the room to be updated
   * @param {Bool} modOnlyDMs the modOnlyDMs value to be set
   *
   **/

const setModOnlyDMs = ({conn}, roomId, modOnlyDMs) =>
    roomsTable.get(roomId).update({modOnlyDMs}).run(conn)

/**
 * Notifies users of a new message in a room
 *
 * @param {Object} context     graph context
  * @param {Object} roomId   the room to be updated
 *
 **/

const notifyOfNewMessage = ({conn, models: {Nametags, Users}}, roomId) =>
  Promise.all([
    roomsTable.get(roomId).pluck(['latestMessage', 'id', 'title', 'image']).run(conn),
    Nametags.getRoomNametags(roomId)
  ])
  .then(([room, nametags]) => {
    const {latestMessage, title, id, image} = room
    const notifData = {
      reason: 'ROOM_NEW_MESSAGES',
      params: {
        roomId: id,
        roomTitle: title,
        image
      }
    }
    const toNotify = nametags.filter(
        ({latestRoomNotif, latestVisit}) =>
        (!latestRoomNotif || latestRoomNotif < latestVisit) &&
        latestVisit < latestMessage
      ).map(n => n.id)
    return Users.getTokens(toNotify)
      .then(tokens => {
        return Promise.all(
          tokens.map(token => notification(notifData, token))
        )
      })
  })
  .catch(errors.errorLog('notifyOfNewMessage'))

module.exports = (context) => ({
  Rooms: {
    get: (id) => get(context, id),
    getVisible: () => getVisible(context),
    getQuery: (query) => getQuery(context, query),
    create: (room) => create(context, room),
    update: (roomId, roomUpdate) => update(context, roomId, roomUpdate),
    setModOnlyDMs: (roomId, modOnlyDMs) => setModOnlyDMs(context, roomId, modOnlyDMs),
    getGranterRooms: (granterCode) => getGranterRooms(context, granterCode),
    updateLatestMessage: (roomId) => updateLatestMessage(context, roomId),
    notifyOfNewMessage: (roomId) => notifyOfNewMessage(context, roomId)
  }
})
