const r = require('rethinkdb')
const errors = require('../../errors')

const badgesTable = r.db('nametag').table('badges')

/**
 * Returns a badge from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => badgesTable.get(id).run(conn)

/**
 * Returns an array of badges from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   the ids of the badges to be retrieved
 *
 */

const getAll = ({conn}, ids) => badgesTable.getAll(...ids).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Returns an array of badges from a template id.
 *
 * @param {Object} context     graph context
 * @param {String} templateId   the id of the badge tempalte
 *
 */

const getTemplateBadges = ({conn}, template) => badgesTable.getAll(template, {index: 'template'}).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Creates a badge
 *
 * @param {Object} context     graph context
 * @param {Object} badge   the badge to be created
 * @param {String} nametagId   the id of the nametag to which this badge is being granted
 *
 **/

const create = ({conn, models: {Users, Nametags}}, badge, nametagId) => {
  const note = {
    text: badge.note,
    date: new Date()
  }
  const badgeObj = {createdAt: new Date(), template: badge.template, notes: [note]}
  return badgesTable.insert(badgeObj).run(conn)
  // Append badge ID to user object
  .then(res => {
    if (res.errors > 0) {
      return new Error(err)
    }
    const id = res.generated_keys[0]
    return Promise.all([
      Users.appendUserArray('badges', id),
      Nametags.grantBadge(nametagId, id),
      id
    ])
  })
  .then(([userRes, nametagRes, id]) => {
    if (userRes.errors > 0) {
      return new errors.APIError(`Error appending badge ID to user: ${userRes.first_error}`)
    }
    if (nametagRes.errors > 0) {
      return new errors.APIError(`Error granting badge to Nametag: ${nametagRes.first_error}`)
    }
    return Object.assign({}, badgeObj, {id})
  })
}

module.exports = (context) => ({
  Badges: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    getTemplateBadges: (templateId) => getTemplateBadges(context, templateId),
    create: (badge, nametagId) => create(context, badge, nametagId)
  }
})
