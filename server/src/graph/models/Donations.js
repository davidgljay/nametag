const {db} = require('../../db')
const config = require('../../secrets.json')
const stripeTools = require('stripe')(config.stripe.client_secret)
const sendEmail = require('../../email')

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

const create = ({conn, user, models: {Messages}}, donation) =>
  db.table('nametags').getAll(donation.nametag)
    .map(n => n.merge({donorRoomName: n('name'), donorImage: n('image')}))
    .eqJoin(n => n('room'), db.table('rooms'))
    .zip()
    .eqJoin(r => r('granter'), db.table('granters'))
    .zip()
    .pluck('room', 'title', 'granter', 'mod', 'name', 'stripe', 'donorName', 'donorImage')
    .nth(0)
    .run(conn)
  .then((data) => {
    const {stripe} = data
    const {amount, token} = donation

    const name = donation.name || data.name

    return Promise.all([
      stripeTools.charges.create({
        amount,
        currency: 'usd',
        description: `Donation to ${name}`,
        source: token,
        destination: {
          amount: amount * 0.9,
          account: stripe
        }
      }),
      data
    ])
  })
  .then(([res, {room, title, mod, granter, stripe, donorName, donorImage}]) => {
    const insertPromise = donationsTable.insert(
        Object.assign(
          {},
          donation,
          {
            stripe_response: res,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        )
      ).run(conn)

    let messageText = `**${donorName}** has donated!\n\n`
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
                template: 'donation',
                params: {
                  donorName,
                  donorImage,
                  donorEmail: user.email,
                  roomId: room,
                  roomTitle: title,
                  amount: donation.amount
                }
              }))
          )
    )

    return Promise.all([
      insertPromise,
      modMessagePromise,
      emailGranterAdminsAndMod
    ])
  })
  .then(([res]) => ({id: res.generated_keys[0]}))

module.exports = (context) => ({
  Donations: {
    get: (id) => get(context, id),
    create: (donation) => create(context, donation)
  }
})
