// const r = require('rethinkdb')
const {db} = require('../../db')
// const errors = require('../../errors')
const notification = require('../../notifications')
const sendEmail = require('../../email')
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
 * @param {Array} actions   the volunteer actions to be created
 * @param {String} nametagId the id of the nametag of the person who is volunteering
 * @param {String} note      an optional note from the user
 *
 * Note: Getting room and granter info from the database for security reasons
 **/

const createArray = ({conn, models: {Messages}}, actions, nametagId, note) =>
  actions.length === 0
  ? Promise.resolve([])
  : db.table('nametags')
    .getAll(nametagId)
    .map(n => n.merge({nametagImage: n('image')}))
    .eqJoin(n => n('room'), db.table('rooms'))
    .zip()
    .eqJoin(n => n('user'), db.table('users'))
    .zip()
    .pluck('room', 'mod', 'granter', 'id', 'title', 'name', 'email', 'token', 'nametagIcon')
    .nth(0)
    .run(conn)
    .then(({room, mod, granter, id, title, name, token, email, nametagImage}) => {
      const volunteerEmail = email
      const volunteerName = name
      const volunteerImage = nametagImage

      const insertPromise = volActionsTable.insert(
        actions.map(action =>
          ({
            action,
            room,
            granter,
            nametag: nametagId,
            note,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        )
      ).run(conn)

      const messagePromise = Messages.create({
        room,
        text: `*${name}* has volunteered!`
      })

      let messageText = `**${name}** has volunteered to do the following:\n\n`
      messageText += `${actions.map(action => `**${action}**\n\n`)}`
      messageText += 'Reach out to say thanks!'

      const modMessagePromise = Messages.create({
        room,
        text: messageText,
        recipient: mod
      })

      const emailGranterAdminsAndMod = db.table('granters')
          .get(granter)
          .do(g => db.table('templates').get(g('adminTemplate')))
          .do(t => db.table('badges').getAll(t('id'), {index: 'template'}))
          .map(b => b('defaultNametag'))
          .map(nametagId => db.table('users').getAll(nametagId, {index: 'nametags'})('email').nth(0))
          .union(db.table('users').getAll(mod, {index: 'nametags'})('email'))
          .distinct()
          .run(conn)
          .then(emails => Promise.all(
              emails.map(em =>
                sendEmail({
                  to: em,
                  from: {
                    name: 'Nametag',
                    email: 'info@nametag.chat'
                  },
                  template: 'volAction',
                  params: {
                    volunteerName,
                    volunteerImage,
                    volunteerEmail,
                    roomId: id,
                    roomTitle: title,
                    actions: actions
                  }
                }))
            )
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
    .then(res => ({ids: res.generated_keys}))

module.exports = (context) => ({
  VolActions: {
    get: (id) => get(context, id),
    createArray: (actions, nametagId, note) => createArray(context, actions, nametagId, note)
  }
})
