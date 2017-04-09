const r = require('rethinkdb')
const errors = require('../../errors')

const badgeRequestsTable = r.db('nametag').table('badgeRequests')

/**
 * Returns a badge request from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => badgeRequestsTable.get(id).run(conn)

/**
 * Returns an array of badge requests from an array of ids.
 *
 * @param {Object} context     graph context
 * @param {Array<String>} ids   the ids of the badges to be retrieved
 *
 */

const getAll = ({conn}, ids) => badgeRequestsTable.getAll(...ids).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Returns an array of active badge requests from a granter id.
 *
 * @param {Object} context     graph context
 * @param {String} granterId   the id of a badge granter
 * @param {String} state       the state of the badges to return
 *
 */

const getByGranterState = ({conn}, granter, status) => badgeRequestsTable
  .getAll([granter, status], {index: 'granterStatus'}).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Creates a badge request
 *
 * @param {Object} context     graph context
 * @param {Object} nametagId   the id of the nametag making the request
 * @param {Object} templateId  the id of the badge template being requested
 * @param {String} granterId   the id of the granter receiving this request
 *
 **/

const create = ({conn}, nametag, template) => {
  const badgeRequestObj = {
    createdAt: new Date(),
    nametag,
    template,
    status: 'ACTIVE'
  }
  return r.db('nametag').table('badgeTemplates').get(template).do(
    t =>
      badgeRequestsTable.insert(
        Object.assign({}, badgeRequestObj, {granter: t('granter')})
      )
    ).run(conn)
    .then(res => {
      if (res.error) {
        return Promise.reject(new Error(res.error))
      }
      return Object.assign({}, badgeRequestObj, {
        id: res.generated_keys[0]
      })
    })
}

/**
 * Sets the state of a badge request based on a nametagId.
 *
 * @param {Object} context     graph context
 * @param {String} id           the id of the badge request to be updated
 * @param {String} status      the new status to be set
 *
 */

const updateStatus = ({conn}, id, status) => badgeRequestsTable.get(id)
  .update({status}).run(conn)

module.exports = (context) => ({
  BadgeRequests: {
    get: (id) => get(context, id),
    getAll: (ids) => getAll(context, ids),
    getByGranterState: (granterId, status) => getByGranterState(context, granterId, status),
    create: (nametag, template, granter) => create(context, nametag, template, granter),
    updateStatus: (id, status) => updateStatus(context, id, status)
  }
})
