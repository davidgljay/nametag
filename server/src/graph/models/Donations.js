// const r = require('rethinkdb')
const {db} = require('../../db')
// const errors = require('../../errors')
// const notification = require('../../notifications')

const donationsTable = db.table('donations')

/**
 * Returns a donation from an id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the donation to be retrieved
 *
 */

const get = ({conn}, id) => id ? donationsTable.get(id).run(conn) : Promise.resolve(null)

 /**
  * Creates a donation
  *
  * @param {Object} context     graph context
  * @param {Array} donation   the volunteer actions to be created
  *
  * Note: Getting room and granter info from the database for security reasons
  **/

const create = ({conn}, donation) =>
  db.table('nametags')
     .getAll(donation.nametag)
     .eqJoin(n => n('room'), db.table('rooms'))
     .zip()
     .pluck('room', 'granter')
     .nth(0)
     .do(res => {
       donationsTable.insert(
           res.merge(donation)
           .merge({
             createdAt: new Date(),
             updatedAt: new Date()
           })
         )
     })
     .run(conn)
     .then(res => ({id: res.generated_keys[0]}))

module.exports = (context) => ({
  Donations: {
    get: (id) => get(context, id),
    create: donation => create(context, donation)
  }
})
