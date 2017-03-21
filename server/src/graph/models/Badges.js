const r = require('rethinkdb')

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

const create = ({conn}, b) => {
  const badge = Object.assign({}, b, {createdAt: Date.now()})
  r.db('nametag').table('badges').insert(badge).run(conn)
}

module.exports = (context) => ({
  Badges: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    create: badge => create(context, badge)
  }
})
