const r = require('rethinkdb')
const errors = require('../../errors')

const nametagsTable = r.db('nametag').table('nametags')

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

const get = ({conn}, id) => nametagsTable.get(id).run(conn)

/**
 * Returns an array of nametags from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   the id of the nametag to be retrieved
 *
 */

const getAll = ({conn}, ids) => nametagsTable.getAll(...ids).run(conn)
  .then(cursor => {
    return cursor.toArray()
  })

  /**
   * Returns the default nametag for a badge.
   *
   * @param {Object} context     graph context
   * @param {String} id   the id of the badge
   *
   */

  const getByBadge = ({conn}, badgeId) => nametagsTable.getAll(badgeId, {index: 'badge'}).run(conn)
    .then(cursor => {
      return cursor.toArray()
    })

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
 *
 **/

const create = ({conn, user, models: {Users}}, nt) => {
  const nametag = Object.assign({}, nt, {createdAt: new Date()})
  return nametagsTable.insert(nametag).run(conn)
  // Append nametag ID to user object and update default names and icons
  .then(res => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating nametag')
    }
    const id = res.generated_keys[0]
    return Promise.all([
      Users.addNametag(id, nametag.room || nametag.template),
      id,
      user.displayNames.indexOf(nametag.name) === -1 ? Users.appendUserArray('displayNames', nametag.name) : null,
      user.icons.indexOf(nametag.icon) === -1 ? Users.appendUserArray('icons', nametag.icon) : null
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

module.exports = (context) => ({
  Nametags: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    getRoomNametags: (room) => getRoomNametags(context, room),
    create: (nametag) => create(context, nametag),
    addMention: (nametag) => addMention(context, nametag),
    getNametagCount: (room) => getNametagCount(context, room),
    updateLatestVisit: (nametagId) => updateLatestVisit(context, nametagId),
    grantBadge: (id, badgeId) => grantBadge(context, id, badgeId)
  }
})
