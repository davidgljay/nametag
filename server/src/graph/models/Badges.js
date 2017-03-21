const r = require('rethinkdb')
const errors = require('../../errors')

/**
 * Returns a badge from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => r.db('nametag').table('badges').get(id).run(conn)

/**
 * Returns an array of badges from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   the ids of the badges to be retrieved
 *
 */

const getAll = ({conn}, ids) => r.db('nametag').table('badges').getAll(...ids).run(conn)
  .then(cursor => cursor.getArray())

/**
 * Creates a badge
 *
 * @param {Object} context     graph context
 * @param {Object} badge   the badge to be created
 *
 **/

const create = ({conn, models: {Users}}, b) => {
  const badge = Object.assign({}, b, {createdAt: Date.now()})
  r.db('nametag').table('badges').insert(badge).run(conn)
  // Append badge ID to user object
  .then(res => {
    if (res.errors > 0) {
      return new errors.APIError('Error creating nametag')
    }
    const id = res.generated_keys[0]
    return Promise.all([
      Users.appendUserArray('badges', id),
      id
    ])
  })
  .then(([res, id]) => {
    if (res.errors > 0) {
      return new errors.APIError(`Error appending badge ID to user: ${res.first_error}`)
    }
    return Object.assign({}, badge, {id})
  })
}

module.exports = (context) => ({
  Badges: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    create: badge => create(context, badge)
  }
})
