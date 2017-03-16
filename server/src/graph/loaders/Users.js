const r = require('rethinkdb')
const {fromUrl} = require('../../routes/images/imageUpload')

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

/**
 * Finds or creates a user based on an oauth provider.
 *
 * @param {Object} context   graph context
 * @param {Object} profile   profile information returned from the oauth provider
 * @param {String} provider  string identifying the provider ('google', 'facebook', etc)
 *
 */

const findOrCreateFromAuth = ({conn}, profile, provider) => {
  let userObj
  const authProfile = userFromAuth(provider, profile)
  return r.db('nametag').table('users').filter({[provider]: authProfile.id}).run(conn)
    .then(cursor => cursor.toArray())
    .then(([user]) => {
      if (user) {
        return user
      }
      return fromUrl(50, 50, authProfile.providerPhotoUrl)
        .then(iconUrl => {
          userObj = {
            displayNames: authProfile.displayNames,
            icons: [iconUrl],
            [provider]: authProfile.id
          }
          return r.db('nametag').table('users').insert(userObj).run(conn)
        })
        .then(rdbRes => {
          if (rdbRes.errors > 0) {
            return Promise.reject('error while inserting user')
          }
          return Object.assign({}, userObj,
            {
              id: rdbRes.generated_keys[0]
            })
        })
    })
    .catch(err => console.log(`Error finding or creating user: ${err}`))
}

const userFromAuth = (provider, profile) => {
  switch(provider){
  case 'facebook':
    return {
      displayNames: [profile.displayName],
      providerPhotoUrl: profile.photos[0].value,
      id: profile.id
    }
  }
}

module.exports = (context) => ({
  Users: {
    get: (id) => get(context, id),
    getByEmail: (email) => getByEmail(context,email),
    findOrCreateFromAuth: (profile, provider) => findOrCreateFromAuth(context, profile, provider)
  }
})
