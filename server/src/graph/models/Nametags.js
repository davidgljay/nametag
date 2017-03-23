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
      nametags.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
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

const getAll = ({conn}, ids) => r.db('nametag').table('nametags').getAll(...ids).run(conn)
  .then(cursor => {
    return cursor.toArray()
  })
  .then(nametags => {
    return nametags
  })

/**
 * Creates a nametag
 *
 * @param {Object} context     graph context
 * @param {Object} nametag   the nametag to be created
 *
 **/

const create = ({conn, user, models: {Users}}, nt) => {
  const nametag = Object.assign({}, nt, {createdAt: new Date()})
  return r.db('nametag').table('nametags').insert(nametag).run(conn)
  // Append nametag ID to user object
  .then(res => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating nametag')
    }
    const id = res.generated_keys[0]
    return Promise.all([
      Users.addNametag(id, nametag.room),
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

const addMention = ({conn}, nametag) => r.db('nametag').table('nametags').get(nametag)
.update({mentions: r.row('mentions').prepend(Date.now())}).run(conn)

/**
 * Returns the total number of participants in a room
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the room whose nametags should be counted
 *
 */

const getNametagCount = ({conn}, room) => r.db('nametag').table('nametags').filter({room}).count().run(conn)

/**
 * Updates the presence of a nametag in a room
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the nametag to be updated
 * @param {Date} latestVisit the date of the latest visit as an ISO string
 */

const updateLatestVisit = ({conn}, nametagId) => r.db('nametag').table('nametags')
  .get(nametagId).update({latestVisit: new Date(), present: true}).run(conn)
  .then((res) => {
    if (res.errors > 0) {
      return new errors.APIError(`Error updating nametag presence: ${res.first_error}`)
    }
    //Wait 30 seconds, then check this nametag again
    setTimeout(() => {
      r.db('nametag').table('nametags').get(nametagId).run(conn)
      .then(nametag => {
        if (Date.now() - new Date(nametag.latestVisit).getTime() > 20000) {
          return r.db('nametag').table('nametags').get(nametagId).update({present: false}).run(conn)
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
    updateLatestVisit: (nametagId) => updateLatestVisit(context, nametagId)
  }
})
