const r = require('rethinkdb')
const {fromUrl} = require('../../routes/images/imageUpload')
const {ErrBadAuth} = require('../../errors')

const usersTable = r.db('nametag').table('users')

/**
 * Returns a particular user.
 *
 * @param {Object} context     graph context
 * @param {String} id  an id to be retrieved
 *
 */

const get = ({conn}, id) => usersTable.get(id).run(conn)

/**
 * Returns a user based on an e-mail address.
 *
 * @param {Object} context     graph context
 * @param {String} email   an email used to look up the user
 *
 */

const getByEmail = ({conn}, email) =>
  usersTable.getAll(email, {index: 'email'}).run(conn)
    .then(cursor => cursor ? cursor.getArray()[0] : ErrBadAuth)

/**
 * Append an arbitrary value to an array in the user object.
 *
 * @param {Object} context     graph context
 * @param {String} property   the property with the array to be updated
 * @param {String} value   the value to be appended
 *
 */

const appendUserArray = ({user, conn}, property, value) => user
  ? usersTable.get(user.id).update((user) =>
      r.branch(
        user.hasFields(property),
        {[property]: user(property).append(value)},
        {[property]: [value]}
      )
    ).run(conn)
  : Promise.reject('User not logged in')

/**
 * Adds a nametag to the user.
 *
 * @param {Object} context     graph context
 * @param {String} property   the property with the array to be updated
 * @param {String} value   the value to be appended
 *
 */

const addNametag = ({user, conn}, nametagId, roomId) => user
  ? usersTable.get(user.id).update({nametags: {[roomId]: nametagId}}).run(conn)
  : Promise.reject('User not logged in')

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
  return usersTable.filter({[provider]: authProfile.id}).run(conn)
    .then(cursor => cursor.toArray())
    .then(([user]) => {
      if (user) {
        return user
      }
      return fromUrl(50, 50, authProfile.providerPhotoUrl)
        .then(iconUrl => {
          userObj = {
            displayNames: authProfile.displayNames,
            icons: [iconUrl.url],
            [provider]: authProfile.id,
            createdAt: Date.now()
          }
          return usersTable.insert(userObj).run(conn)
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
  switch (provider) {
    case 'facebook':
      return {
        displayNames: [profile.displayName],
        providerPhotoUrl: profile.photos[0].value,
        id: profile.id
      }
    case 'twitter':
      return {
        displayNames: [profile.displayName, profile.username],
        providerPhotoUrl: profile.photos[0].value,
        id: profile.id
      }
    case 'google':
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
    getByEmail: (email) => getByEmail(context, email),
    findOrCreateFromAuth: (profile, provider) => findOrCreateFromAuth(context, profile, provider),
    appendUserArray: (property, value) => appendUserArray(context, property, value),
    addNametag: (nametagId, roomId) => addNametag(context, nametagId, roomId)
  }
})
