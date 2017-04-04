const r = require('rethinkdb')
// const errors = require('../../errors')

const badgeGrantersTable = r.db('nametag').table('badgeGranters')

/**
 * Returns a badge template from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => badgeGrantersTable.get(id).run(conn)

/**
 * Creates a badge granter
 *
 * @param {Object} context     graph context
 * @param {Object} granter   the badge granter to be created
 *
 **/

const create = ({conn}, granter) => {
  const badgeTemplate = Object.assign({}, granter, {createdAt: new Date(), updatedAt: new Date()})
  return badgeGrantersTable.insert(badgeTemplate).run(conn)
    .then(res => {
      if (res.error) {
        return new Error(res.error)
      }
      return Object.assign({}, granter, {id: res.generated_keys[0]})
    })
}

module.exports = (context) => ({
  BadgeGranters: {
    get: (id) => get(context, id),
    create: badge => create(context, badge)
  }
})
