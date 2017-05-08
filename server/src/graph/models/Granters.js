const {db} = require('../../db')
const {ErrNotFound} = require('../../errors')
const sendEmail = require('../../email')
const notification = require('../../notifications')

const grantersTable = db.table('granters')

/**
 * Returns a badge granter from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const get = ({conn}, id) => grantersTable.get(id).run(conn)

/**
 * Returns a badge granter from a url code.
 *
 * @param {Object} context     graph context
 * @param {String} urlCode   the urlCode of the granter to be retrieved
 *
 */

const getByUrlCode = ({conn}, urlCode) => grantersTable.getAll(urlCode, {index: 'urlCode'}).run(conn)
  .then(cursor => cursor.next())
  .catch(err => err.message === 'No more rows in the cursor.'
    ? Promise.reject(ErrNotFound)
    : Promise.reject(err))

/**
 * Returns a badge granter from a url code.
 *
 * @param {Object} context     graph context
 * @param {String} adminTemplateIds   the aminTemplate ids of one or more granters to be retrieved
 *
 */

const getByAdminTemplate = ({conn}, adminTemplateIds) => grantersTable
  .getAll(...adminTemplateIds, {index: 'adminTemplate'}).run(conn)
  .then(cursor => cursor.toArray())

  /**
   * Notifies the granter's admins
   *
   * @param {Object} context     graph context
   * @param {String} granterId    The id of the granter
   * @param {String} template   The email templated to be used
   * @param {Object} params The params of the email to be sent
   */

  const notifyAdmins = ({conn, models: {Users}}, granterId, reason, params) =>
  grantersTable.get(granterId)
    .do(g => db.table('templates').get(g('adminTemplate')))
    .do(t => db.table('badges').getAll(t('id'), {index: 'template'}))
    .map(b => b('defaultNametag'))
      .run(conn)
      .then(cursor => cursor.toArray())
      .then(adminNametags => Users.getTokens(adminNametags))
      .then(adminTokens => {
        for (var i=0; i < adminTokens.length; i++ ) {
          notification(
            {
              reason,
              params
            },
            adminTokens[i]
          )
        }
      })
      .catch(() => ErrNotFound)

  /**
   * Emails the granter's admins
   *
   * @param {Object} context     graph context
   * @param {String} granterId    The id of the granter
   * @param {String} template   The email templated to be used
   * @param {Object} params The params of the email to be sent
   */

  const emailAdmins = ({conn, models: {Users}}, granterId, template, params) =>
    grantersTable.get(granterId)
      .do(g => db.table('templates').get(g('adminTemplate')))
      .do(t => db.table('badges').getAll(t('id'), {index: 'template'}))
      .map(b => b('defaultNametag'))
      .run(conn)
      .then(cursor => cursor.toArray())
      .then(adminNametags => Users.getEmails(adminNametags))
      .then(adminEmails => {
          for (var i=0; i < adminEmails.length; i++ ) {
            sendEmail({
              to: adminEmails[i],
              from: {
                name: 'Nametag',
                email: 'info@nametag.chat'
              },
              template,
              params
            })
          }
        })


/**
 * Creates a badge granter
 *
 * @param {Object} context     graph context
 * @param {Object} granter   the badge granter to be created
 *
 **/

const create = ({conn, models: {Templates}}, granter) => {
  const granterObj = Object.assign({}, granter, {createdAt: new Date(), updatedAt: new Date()})
  return grantersTable.insert(granterObj).run(conn)
    .then(res => {
      if (res.error) {
        return new Error(res.error)
      }
      const id = res.generated_keys[0]
      return Promise.all([
        id,
        Templates.createAndGrant(
          {
            name: `Admin`,
            description: `This individual has the right to grant and revoke badges on behalf of ${granter.name}.`,
            image: granter.image,
            granter: id
          },
        `Created account for ${granter.name}.`)
      ])
    })
      .then(([id, [template]]) =>
        Promise.all([
          id,
          grantersTable.get(id).update({adminTemplate: template.id}).run(conn)
        ])
      )
      .then(([id, adminRes]) => Object.assign({}, granter, {id}))
}

module.exports = (context) => ({
  Granters: {
    get: id => get(context, id),
    create: badge => create(context, badge),
    getByUrlCode: urlCode => getByUrlCode(context, urlCode),
    getByAdminTemplate: adminTemplateIds => getByAdminTemplate(context, adminTemplateIds),
    notifyAdmins: (granterId, template, params) => notifyAdmins(context, granterId, template, params),
    emailAdmins: (granterId, template, params) => emailAdmins(context, granterId, template, params)
  }
})
