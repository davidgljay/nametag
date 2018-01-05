const r = require('rethinkdb')
const {db} = require('../../db')
const errors = require('../../errors')
const notification = require('../../notifications')

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
 * Creates a vol action
 *
 * @param {Object} context     graph context
 * @param {Object} donation   the donation to be created
 *
 **/

const create = ({conn}, donation) => {
  const donationObj = Object.assign({}, donation, {createdAt: new Date(), updatedAt: new Date()})
  return donationsTable.insert(templateObj).run(conn)
    .then(res => Object.assign({}, templateObj, {id: res.generated_keys[0]}))
}

module.exports = (context) => ({
  Donations: {
    get: (id) => get(context, id),
    create: donation => create(context, donation)
  }
})
