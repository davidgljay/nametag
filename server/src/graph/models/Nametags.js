const {db} = require('../../db')
const r = require('rethinkdb')
const errors = require('../../errors')
const pubsub = require('../subscriptions/pubsub')
const notification = require('../../notifications')

const nametagsTable = db.table('nametags')

/**
 * Returns the number of new nametags since a particular date.
 *
 * @param {Object} context     graph context
 * @param {String} roomId   the id of the room to be checked
 * @param {Date} date the date to be checked against
 *
 */

const newNametagCount = ({conn, user}, roomId, date) =>
  nametagsTable.getAll(roomId, {index: 'room'})
  .filter(msg => msg('createdAt').gt(nametagsTable.get(user.nametags[roomId])('latestVisit')))
  .count()
  .run(conn)

/**
 * Returns the nametags from a particular room.
 *
 * @param {Object} context     graph context
 * @param {String} room   the id of the room whose messages will be retrieved
 *
 */

const getRoomNametags = ({conn}, room) =>
  nametagsTable.getAll(room, {index: 'room'}).run(conn)
   .then(cursor => cursor.toArray())
   .then(nametags =>
      nametags.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    )

 /**
  * Returns a nametag from an id.
  *
  * @param {Object} context     graph context
  * @param {String} id   the id of the nametag to be retrieved
  *
  */

const get = ({conn}, id) => id ? nametagsTable.get(id).run(conn) : Promise.resolve(null)

/**
 * Returns an array of nametags from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   the id of the nametag to be retrieved
 *
 */

const getAll = ({conn}, ids) => nametagsTable.getAll(...ids).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Returns the default nametag for a badge.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge
 *
 */

const getByBadge = ({conn}, badgeId) => nametagsTable.getAll(badgeId, {index: 'badge'}).run(conn)
  .then(cursor => cursor.next())

/**
 * Grants a badge to a nametag
 *
 * @param {Object} context  graph context
 * @param {String} id       the id of the nametag to be assigned
 * @param {String} badgeId  the id of the badge to be granted
 *
 */

const grantBadge = ({conn}, id, badgeId) => nametagsTable.get(id).update({badge: badgeId}).run(conn)

/**
 * Creates a nametag
 *
 * @param {Object} context     graph context
 * @param {Object} nametag   the nametag to be created
 * @param {String} email (optional) the e-mail address of the person other than
 *            the currently logged in user who should recieve this badge.
 *
 * Note: the email parameter should only be used when creating an administrator
 * for a new badge granting organization.
 *
 **/

const create = ({conn, user, models: {Users, BadgeRequests, Rooms, Messages, Templates, Badges}}, nt, email) => {
  const nametag = Object.assign(
    {},
    nt,
    {createdAt: new Date(), user: user.id},
    nt.room ? {latestVisit: new Date()} : {}
  )
  return nametagsTable.insert(nametag).run(conn)
  // Append nametag ID to user object and update default names and images
  .then(res => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating nametag')
    }
    const id = res.generated_keys[0]
    return Promise.all([

      // Add the nametag to the user profile
      Users.addNametag(id, nametag.room || nametag.template, email),
      id,

      // Create a BadgeRequest or new badge if appropriate
      nametag.template
        ? Templates.get(nametag.template)
          .then(template =>
            template.approvalRequired
            ? BadgeRequests.create(id, template.id)
            : Badges.create({template: template.id, defaultNametag: id, note: 'Badge granted'})
          )
          : null,

      // Add displayName and image if they are new
      user.displayNames.indexOf(nametag.name) === -1 ? Users.appendUserArray('displayNames', nametag.name) : null,
      nametag.image && user.images.indexOf(nametag.image) === -1 ? Users.appendUserArray('images', nametag.image) : null,

      // Send a notification to the room's moderator
      nametag.room ? Rooms.get(nametag.room)
            .then(room => Promise.all([
              room,
              Users.getTokens(id)
            ]))
        .then(([room, [token]]) => Promise.all([
          notification({
            reason: 'MOD_ROOM_JOIN',
            params: {
              roomName: room.title,
              roomId: room.id,
              nametagName: nametag.name,
              image: nametag.image
            }
          }, token),
          Messages.create({
            text: 'Someone new has joined, say hello.',
            nametag: id,
            room: room.id
          })
        ]))
        : null
    ])
  })
  .then(([res, id]) => {
    if (res.errors > 0) {
      return new errors.APIError(`Error adding nametag ID to user: ${res.first_error}`)
    }
    return Object.assign({}, nametag, {id})
  })
}

/**
 * Adds a mention to a nametag
 *
 * @param {Object} context     graph context
 * @param {String} nametag      the id of the nametag to be updated
 *
 **/

const addMention = ({conn}, nametag) => nametagsTable.get(nametag)
.update({mentions: r.row('mentions').prepend(Date.now())}).run(conn)

/**
 * Returns the total number of participants in a room
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the room whose nametags should be counted
 *
 */

const getNametagCount = ({conn}, room) => nametagsTable.filter({room}).count().run(conn)

/**
 * Updates arbitrary data about a Nametag
 *
 * @param {Object} context     graph context
 * @param {String} nametagId   the nametag to be updated
 * @param {String} nametagUpdate  information about the nametag to be updated
 *
 */

const update = ({conn, models: {Users}}, nametagId, nametagUpdate) =>
  nametagsTable.get(nametagId).update(nametagUpdate).run(conn)
    .then(res => {
      if (res.errors) {
        return Promise.reject(new errors.APIError(res.errors[0]))
      }
      let userUpdate = null
      if (nametagUpdate.name) {
        userUpdate = Users.addDefaultName(nametagUpdate.name)
      } else if (nametagUpdate.image) {
        userUpdate = Users.addDefaultImage(nametagUpdate.image)
      }
      return Promise.all([
        nametagsTable.get(nametagId).run(conn),
        userUpdate
      ])
    })
    .then(([nametag]) => {
      pubsub.publish('nametagUpdated', nametag)
    })

/**
 * Updates the presence of a nametag in a room
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the nametag to be updated
 * @param {Date} latestVisit the date of the latest visit as an ISO string
 */

const updateLatestVisit = ({conn}, nametagId) => nametagsTable
  .get(nametagId).update({latestVisit: new Date(), present: true}).run(conn)
  .then((res) => {
    if (res.errors > 0) {
      return new errors.APIError(`Error updating nametag presence: ${res.first_error}`)
    }
    // Wait 30 seconds, then check this nametag again
    setTimeout(() => {
      nametagsTable.get(nametagId).run(conn)
      .then(nametag => {
        if (Date.now() - new Date(nametag.latestVisit).getTime() > 20000) {
          return nametagsTable.get(nametagId).update({present: false}).run(conn)
          .catch(errors.errorLog('Setting nametag presence to false'))
        }
        return
      })
      .catch(err => console.log('latestVisit err', err))
    }, 30000)
  })

  /**
   * Bans a nametag from a room
   *
   * @param {Object} context     graph context
   * @param {String} id   the id of the nametag to be updated
   * @param {String} roomId the id of the room where the nametag is located
   */

const ban = ({conn, models: {Messages}}, id, roomId) =>
  nametagsTable.get(id).run(conn)
    .then(nametag => {
      if (nametag.room !== roomId) {
        return Promise.reject(errors.ErrNotAuthorized)
      }
      const message = {
        text: `${nametag.name} has been banned from this room.`,
        room: roomId
      }
      return Promise.all([
        Messages.create(message),
        nametagsTable.get(id).update({banned: true}).run(conn)
      ])
    })

  /**
   * Clones a nametag
   *
   * @param {Object} context     graph context
   * @param {String} id   the id of the nametag to be cloned
   */

const clone = ({conn, models: {Users}}, id, about) =>
  nametagsTable.insert(
    nametagsTable.get(id)
      .pluck('name', 'bio', 'user')
      .merge({createdAt: new Date()})
      .merge(about)
    )
    .run(conn)
    .then(res => {
      if (res.errors) {
        return Promise.reject(new errors.APIError('Error cloning Nametag: ' + res.errors[0]))
      }
      let newId = res.generated_keys[0]
      return Users.addNametag(newId, about.template || about.room).then(() => newId)
    })

module.exports = (context) => ({
  Nametags: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    newNametagCount: (room, date) => newNametagCount(context, room, date),
    getRoomNametags: (room) => getRoomNametags(context, room),
    getByBadge: (badgeId) => getByBadge(context, badgeId),
    create: (nametag, email) => create(context, nametag, email),
    update: (nametagId, nametagUpdate) => update(context, nametagId, nametagUpdate),
    addMention: (nametag) => addMention(context, nametag),
    getNametagCount: (room) => getNametagCount(context, room),
    updateLatestVisit: (nametagId) => updateLatestVisit(context, nametagId),
    grantBadge: (id, badgeId) => grantBadge(context, id, badgeId),
    ban: (id, roomId) => ban(context, id, roomId),
    clone: (id, about) => clone(context, id, about)
  }
})
