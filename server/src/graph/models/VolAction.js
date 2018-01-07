// const r = require('rethinkdb')
const {db} = require('../../db')
// const errors = require('../../errors')
const notification = require('../../notifications')
const email = require('../../email')
const volActionsTable = db.table('volActions')

/**
 * Returns a volunteer action from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the volunteer action to be retrieved
 *
 */

const get = ({conn}, id) => id ? volActionsTable.get(id).run(conn) : Promise.resolve(null)

/**
 * Creates a vol action
 *
 * @param {Object} context     graph context
 * @param {Array} volActions   the volunteer actions to be created
 *
 * Note: Getting room and granter info from the database for security reasons
 **/

const createArray = ({conn, models: {Messages}}, volActions) =>
  db.table('nametags')
    .getAll(volActions.nametag)
    .map(n => n.merge({nametagImage: n('image')}))
    .eqJoin(n => n('room'), db.table('rooms'))
    .zip()
    .eqJoin(n => n('user'), db.table('users'))
    .zip()
    .pluck('room', 'granter', 'id', 'title', 'name', 'email', 'token', 'nametagImage')
    .nth(0)
    .run(conn)
    .then(({room, granter, id, title, name, token, email, nametagImage}) => {
      const volunteerEmail = email
      const volunteerName = name
      const volunteerIcon = nametagIcon

      const insertPromise = volActionsTable.insert(
        volActions.actions.map(action =>
          ({
            action,
            room,
            granter,
            nametag: volActions.nametag,
            note: volActions.note,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        )
      ).run(conn)

      const messagePromise = Messages.create({
          room,
          text: `*${name}* has volunteered!`
      })

      const modMessagePromise = Messages.create({
        room,
        text: `
          **${name}** has volunteered to do the following:\n
          ${volActions.actions.map(action => `* **${action}**\n`)}
          Reach out to say thanks!
        `,
        recipient: mod
      })

      const emailGranterAdminsAndMod = db.table('granters')
          .get(granterId)
          .do(g => db.table('templates').get(g('adminTemplate')))
          .do(t => db.table('badges').getAll(t('id'), {index: 'template'}))
          .map(b => b('defaultNametag'))
          .do(nametagIds => db.table('users').getAll(...nametagIds, mod, {index: 'nametags'})('email'))
          .distinct()
          .run(conn)
          .then(emails => Promise.all(
              emails.map(em => email({
                to: em,
                from: {
                  name: 'Nametag',
                  email: 'info@nametag.chat'
                },
                template: 'volAction',
                params: {
                  volunteerName,
                  volunteerIcon,
                  volunteerEmail,
                  roomId: id,
                  roomTitle: title,
                  actions: volActions.actions
                }
              }))
      )

      const notificationPromise = notification(
        {
          reason: 'VOLUNTEER',
          params: {
            name,
            roomId: id,
            roomTitle: title,
            icon: nametagImage,
            text: 'Click to thank them.'
          }
        },
        token
      )

      return Promise.all([
        insertPromise,
        messagePromise,
        modMessagePromise,
        notificationPromise,
        emailGranterAdminsAndMod
      ])
    })
    .do(res => {
    })
    .run(conn)
    .then(res => ({ids: res.generated_keys}))

module.exports = (context) => ({
  VolActions: {
    get: (id) => get(context, id),
    createArray: volActions => createArray(context, volActions)
  }
})
