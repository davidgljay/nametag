const {db} = require('../../db')
const config = require('../../secrets.json')
const stripeTools = require('stripe')(config.stripe.client_secret)

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
  * @param {Int} amount   the amount being donated
  * @param {String} nametag The nametag of the user making the donation
  * @param {String} token The stripe token representing the user's credit card information
  * @param {String} note An optional note from the user
  *
  * Note: Getting room and granter info from the database for security reasons
  **/

const create = ({conn}, amount, nametag, token, note) =>
  db.table('nametags').getAll(nametag)
    .eqJoin(n => n('room'), db.table('rooms'))
    .zip()
    .eqJoin(r => r('granter'), db.table('granters'))
    .zip()
    .pluck('room', 'granter', 'name', 'stripe')
    .nth(0)
    .run(conn)
  .then(({room, granter, name, stripe}) =>
    Promise.all([
      stripeTools.charges.create({
        amount: amount * 100,
        currency: 'usd',
        description: `Donation to ${name}`,
        source: token,
        destination: {
          amount: amount * 90,
          account: stripe
        }
      }),
      room,
      granter
    ])
  )
  .then(([res, room, granter]) =>
    donationsTable.insert(
      {
        amount,
        nametag,
        token,
        note,
        room,
        granter,
        stripe_response: res,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ).run(conn)
  )
  .then(res => ({id: res.generated_keys[0]}))
  .then((res) => {
    console.log('id', res)
    return res
  })

module.exports = (context) => ({
  Donations: {
    get: (id) => get(context, id),
    create: (amount, nametag, token, note) => create(context, amount, nametag, token, note)
  }
})
