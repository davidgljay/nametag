const r = require('rethinkdb')
const {db} = require('../../db')
const errors = require('../../errors')
const notification = require('../../notifications')

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
 * @param {Object} volAction   the volunteer action to be created
 *
 **/

const create = ({conn}, volAction) => {
  const volActionObj = Object.assign({}, volAction, {createdAt: new Date(), updatedAt: new Date()})
  return volActionsTable.insert(templateObj).run(conn)
    .then(res => Object.assign({}, templateObj, {id: res.generated_keys[0]}))
}

module.exports = (context) => ({
  VolActions: {
    get: (id) => get(context, id),
    create: volAction => create(context, volAction)
  }
})
