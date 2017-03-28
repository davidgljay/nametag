const r = require('rethinkdb')
const errors = require('../../errors')

const badgeTemplatesTable = r.db('nametag').table('badgeTemplates')

/**
 * Returns a badge template from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => badgeTemplatesTable.get(id).run(conn)

/**
 * Returns an array of badge templates from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   the ids of the badges to be retrieved
 *
 */

const getAll = ({conn}, ids) => badgeTemplatesTable.getAll(...ids).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Returns an array of badge templates from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {String} granterId   the id of the badge granter
 *
 */

const getGranterTemplates = ({conn}, granterId) => badgeTemplatesTable.getAll(granterId, {index: 'granter'}).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Creates a badge template
 *
 * @param {Object} context     graph context
 * @param {Object} template   the badge template to be created
 *
 **/

const create = ({conn}, template) => {
  const badgeTemplate = Object.assign({}, template, {createdAt: new Date(), updatedAt: new Date()})
  return badgeTemplatesTable.insert(badgeTemplate).run(conn)
    .then(res => Object.assign({}, template, {id: res.generated_keys[0]}))
}


module.exports = (context) => ({
  BadgeTemplates: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    getGranterTemplates: (granterId) => getGranterTemplates(context, granterId),
    create: badge => create(context, badge)
  }
})
