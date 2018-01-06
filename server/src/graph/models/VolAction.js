// const r = require('rethinkdb')
const {db} = require('../../db')
// const errors = require('../../errors')
// const notification = require('../../notifications')

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

const createArray = ({conn}, volActions) =>
 db.table('nametags')
    .getAll(volActions.nametag)
    .eqJoin(n => n('room'), db.table('rooms'))
    .zip()
    .pluck('room', 'granter')
    .nth(0)
    .do(res => {
      volActionsTable.insert(
        volActions.actions.map(action =>
          res.merge({
            action,
            nametag: volActions.nametag,
            note: volActions.note,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        )
      )
    })
    .run(conn)
    .then(res => ({ids: res.generated_keys}))

module.exports = (context) => ({
  VolActions: {
    get: (id) => get(context, id),
    createArray: volActions => createArray(context, volActions)
  }
})
