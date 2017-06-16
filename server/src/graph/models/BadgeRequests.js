const {db} = require('../../db')
const pubsub = require('../subscriptions/pubsub')

const badgeRequestsTable = db.table('badgeRequests')

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
 * @param {String} status       the status of the badges to return
 *
 */

const getByGranterState = ({conn}, granter, status) => badgeRequestsTable
  .getAll([granter, status], {index: 'granterStatus'}).run(conn)
  .then(cursor => cursor.toArray())

/**
 * Creates a badge request and notifies admins
 *
 * @param {Object} context     graph context
 * @param {Object} nametagId   the id of the nametag making the request
 * @param {Object} templateId  the id of the badge template being requested
 * @param {String} granterId   the id of the granter receiving this request
 *
 **/

const create = ({conn, models: {Granters}}, nametag, template) => {
  const badgeRequestObj = {
    createdAt: new Date(),
    nametag,
    template,
    status: 'ACTIVE'
  }

  return db.table('templates').get(template)
  .do(t => ({
    template: t,
    granter: db.table('granters').get(t('granter')),
    nametag: db.table('nametags').get(nametag)
  }))
  .run(conn)
  .then(({template, granter, nametag}) => {
    const badgeRequest = Object.assign({}, badgeRequestObj, {granter: granter.id})
    return Promise.all([
      badgeRequestsTable.insert(badgeRequest).run(conn),
      badgeRequest,
      Granters.emailAdmins(
        granter.id,
        'badgeRequest',
        {
          requesterName: nametag.name,
          requesterBio: nametag.bio,
          templateName: template.name,
          granterCode: granter.urlCode
        }
      ),
      Granters.notifyAdmins(
        granter.id,
        'BADGE_REQUEST',
        {
          requesterName: nametag.name,
          requesterBio: nametag.bio,
          requesterIcon: nametag.image,
          templateName: template.name,
          granterCode: granter.urlCode
        }
      )
    ])
  })
  .then(([res, badgeRequest]) => {
    if (res.error) {
      return Promise.reject(new Error(res.error))
    }
    const badgeRequestResult = Object.assign({}, badgeRequest, {id: res.generated_keys[0]})
    pubsub.publish('badgeRequestAdded', badgeRequestResult)
    return badgeRequestResult
  })
}

/**
 * Sets the status of a badge request based on a nametagId.
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
