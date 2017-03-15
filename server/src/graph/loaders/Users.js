const r = require('rethinkdb')

/**
 * Returns a particular user.
 *
 * @param {Object} context     graph context
 * @param {String} id  an id to be retrieved
 *
 */

const get = ({conn}, id) => r.db('nametag').table('users').get(id).run(conn)

/**
 * Returns a user based on an e-mail address.
 *
 * @param {Object} context     graph context
 * @param {String} email   an email used to look up the user
 *
 */

const getByEmail = ({conn}, id) =>
  r.db('nametag').table('users').getAll(email, {index: 'email'}).run(conn)
    .then(cursor => cursor.getArray())

module.exports = (context) => ({
  Users: {
    get: (id) => get(context, id),
    getByEmail: (email) => getByEmail(context, id)
  }
})

/**
 * Finds or creates a user based on an oauth provider.
 *
 * @param {Object} context   graph context
 * @param {Object} profile   profile information returned from the oauth provider
 * @param {String} provider  string identifying the provider ('google', 'facebook', etc)
 *
 */

const findOrCreateFromAuth = ({conn}, profile, provider) => {
  console.log('auth profile', provider, profile);
  r.db('nametag').table('users').getAll(profile.token, {index: provider}).run(conn)
    .then(cursor => cursor.getArray())
}

module.exports = (context) => ({
  Users: {
    get: (id) => get(context, id),
    getByEmail: (email) => getByEmail(context,email),
    findOrCreateFromAuth: (context, profile, provider) => findOrCreateFromAuth(context, profile, provider)
  }
})
