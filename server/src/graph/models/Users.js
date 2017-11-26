const {db} = require('../../db')
const r = require('rethinkdb')
const uuid = require('uuid')
const fetch = require('node-fetch')
const {fromUrl} = require('../../routes/images/imageUpload')
const {
  ErrBadAuth,
  ErrBadHash,
  ErrNotLoggedIn,
  ErrEmailTaken,
  ErrInvalidToken,
  ErrNotFound,
  APIError
} = require('../../errors')
const {passwordsalt} = require('../../secrets.json')
const {enc, SHA3, MD5} = require('crypto-js')
const sendEmail = require('../../email')

const usersTable = db.table('users')

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
    .then(cursor => cursor.toArray())
    .then(results => {
      if (results.length === 0) {
        return Promise.reject(ErrBadAuth)
      }
      return results[0]
    })

/**
 * Returns a user based on an e-mail address.
 *
 * @param {Object} context     graph context
 * @param {String} email   an email used to look up the user
 *
 */

const getByHash = ({conn}, hash) =>
  usersTable.getAll(hash, {index: 'loginHash'}).run(conn)
    .then(cursor => cursor.toArray())
    .then(results => {
      if (results.length === 0) {
        return Promise.reject(ErrBadHash)
      }
      return results[0]
    })


/**
 * Adds an e-mail address to an existing user
 *
 * @param {Object} context     graph context
 * @param {String} userId   the id of the user to be updated
 * @param {String} email   an email to be added to the user
 *
 */

const addEmail = ({conn}, userId, email) =>
  usersTable.get(userId).update({email}).run(conn)

/**
 * Append an arbitrary value to an array in the user object.
 *
 * @param {Object} context     graph context
 * @param {String} property   the property with the array to be updated
 * @param {String} value   the value to be appended
 *
 */

const appendUserArray = ({user, conn}, property, value) => {
  if (!property || !value) {
    return Promise.resolve()
  }
  user && property && value
  ? usersTable.get(user.id).update((user) =>
      r.branch(
        user.hasFields(property),
        {[property]: user(property).append(value)},
        {[property]: [value]}
      )
    ).run(conn)
  : Promise.reject(ErrNotLoggedIn)
}

/**
 * Adds a notification token to the user.
 *
 * @param {Object} context     graph context
 * @param {String} token   the property with the array to be updated
 * @param {String} value   the value to be appended
 *
 */

const addToken = ({user, conn}, token) =>
  usersTable.get(user.id).update({token}).run(conn)

/**
 * Gets a notification token based on a nametag.
 * NOTE: This is temporary, and breaks a core promise to our users: we shouldn't be able to
 * track people from room to room! A nice, elegant solution has been planned for this later.
 *
 * @param {Object} context     graph context
 * @param {Array} nametagIds   the nametagId which need to be sent a message
 *
 */

const getTokens = ({conn}, nametagIds) =>
  nametagIds && nametagIds.length > 0 ? usersTable.getAll(...nametagIds, {index: 'nametags'})('token')
    .run(conn)
    .then(cursor => cursor.toArray())
    : Promise.resolve([])

/**
 * Gets an array of e-mail addresses based on an array of nametags
 * NOTE: This is temporary, and breaks a core promise to our users: we shouldn't be able to
 * track people from room to room! A nice, elegant solution has been planned for this later.
 *
 * @param {Object} context     graph context
 * @param {Array} nametagIds   the nametagIds which need to be sent an email
 *
 */

const getEmails = ({conn}, nametagIds) =>
  usersTable.getAll(...nametagIds, {index: 'nametags'})('email').run(conn)
  .then(cursor => cursor.toArray())

/**
 * Gets an array of e-mail addresses based on an array of nametags
 * NOTE: This is temporary, and breaks a core promise to our users: we shouldn't be able to
 * track people from room to room! A nice, elegant solution has been planned for this later.
 *
 * @param {Object} context     graph context
 * @param {String} nametagId   the nametagId which need to be sent an email
 *
 */

const getByNametag = ({conn}, nametagId) =>
  usersTable.getAll(nametagId, {index: 'nametags'}).run(conn)
  .then(cursor => cursor.next())

/**
 * Adds a nametag to the user.
 *
 * @param {Object} context     graph context
 * @param {String} nametagId   the id of the nametag to be added
 * @param {String} roomId   the id of the room for that nametag
 *
 */

const addNametag = ({user, conn}, nametagId, roomId) =>
  usersTable.get(user.id).update({nametags: {[roomId]: nametagId}}).run(conn)

/**
 * Adds a badge to the user.
 *
 * @param {Object} context     graph context
 * @param {String} badgeId   the id of the badge to be added
 * @param {String} templateId   the id of the template for that badge
 *
 */

const addBadge = ({user, conn}, badgeId, templateId, nametagId) =>
  usersTable.getAll(nametagId, {index: 'nametags'}).nth(0)
    .update({badges: {[templateId]: badgeId}}).run(conn)
    .catch(err => err.name === 'ReqlNonExistenceError'
      ? Promise.reject(ErrNotFound)
      : Promise.reject(err))

/**
 * Get templates for granters that this user administers
 *
 * @param {Object} context   graph context
 *
**/

const getAdminTemplates = ({user, conn, models: {Granters, Templates}}) => {
  if (!user || !user.badges || !user.badges.length === 0) {
    return Promise.resolve([])
  }
  return Granters.getByAdminTemplate(Object.keys(user.badges))
    .then(granters => Promise.all(granters.map(g => Templates.getGranterTemplates(g.id))))
    .then(templates => {
      let flat = []
      for (var i = 0; i < templates.length; i++) {
        flat = flat.concat(templates[i])
      }
      return flat
    })
}

/**
 * Finds or creates a user based on an oauth provider.
 *
 * @param {Object} context   graph context
 * @param {Object} profile   profile information returned from the oauth provider
 * @param {String} provider  string identifying the provider ('google', 'facebook', etc)
 * @returns {Object} data    Object containing the user profile and any badges to be created.
 */

const findOrCreateFromAuth = ({conn}, authProfile, provider) => {
  // Either create the user or log them in
  return usersTable
    .getAll(authProfile.id, {index: provider})
    .union(usersTable.getAll(authProfile.email || '', {index: 'email'}))
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(([user]) => {
      if (user) {
        return user[provider]
        ? {
          user,
          authProfile
        }
        : usersTable
          .get(user.id)
          .update({[provider]: authProfile.id})
          .run(conn)
          .then(() => ({
            user,
            authProfile
          }))
      }

      const insertUser = (user) => Promise.all([
        usersTable.insert(user).run(conn),
        user
      ])
      let userObj = {
        displayNames: authProfile.displayNames.filter(name => name),
        images: [],
        [provider]: authProfile.id,
        createdAt: new Date(),
        badges: {},
        password: uuid.v4().replace(/-/g, ''),
        loginHash: uuid.v4().replace(/-/g, ''),
        unsubscribe: {}
      }

      if (authProfile.email) {
        userObj.email = authProfile.email
      }

      // Load an image if one exists, otherwise just insert the user
      const insertUserPromise = authProfile.providerPhotoUrl
        ? fromUrl(80, 80, authProfile.providerPhotoUrl)
        .then(({url}) => {
          if (!url) {
            return insertUser(userObj)
          }
          return insertUser(Object.assign({}, userObj, {images: [url]}))
        })
        : insertUser(userObj())

      return insertUserPromise
        .then(([rdbRes, userObject]) => {
          if (rdbRes.errors > 0) {
            return Promise.reject(new Error('Error while inserting user'))
          }
          return {
            user: Object.assign({}, userObject,
              {
                id: rdbRes.generated_keys[0]
              }),
            authProfile
          }
        })
    })
}

/**
* Adds default names and images to a user from an auth provider
*
* @param {Object} context   graph context
* @param {Object} authProfile   The profile info from the auth provider
*
*/

const addDefaultsFromAuth = (context, authProfile) => {
  const {user, conn} = context
  let userUpdates = authProfile.displayNames
  ? authProfile.displayNames
    .reduce((arr, name) => name && user.displayNames.indexOf(name) === -1
      ? arr.concat(appendUserArray(context, 'displayNames', name)) : arr, [])
  : []

  return fromUrl(80, 80, authProfile.providerPhotoUrl)
    .then(({url}) => Promise.all(
      userUpdates
      .concat(
        url && user.images && user.images.indexOf(url) === -1 ? appendUserArray(context, 'images', url) : null
      ).concat(
        usersTable.get(user.id).update({[authProfile.provider]: authProfile.id}).run(conn)
      )
    ))
}

/**
* Adds badges to a user from an auth provider
*
* @param {Object} context   graph context
* @param {Object} authProfile   The profile info from the auth provider
* @param {Object} user  The freshly authed user
*
*/

const addBadgesFromAuth = ({conn, user, models: {Templates, Granters}}, {badges = [], provider}) => {
  return Promise.all([
    user.badges ? Templates.getAll(Object.keys(user.badges)) : [],
    Granters.getByUrlCode('nametagauth')
  ])

    // Check to see if the a badge has already been granted. If not, grant one.
    .then(([templates, granter]) => {
      const templateNames = templates
        .filter(template => template.granter === granter.id)
        .map(template => template.name)

      const templateDescriptions = templates
        .filter(template => template.granter === granter.id)
        .map(template => template.description)

      let promises = []

      for (var i = 0; i < badges.length; i++) {
        const badge = badgesFromAuth(badges[i], provider)
        if (
          templateNames.indexOf(badge.name) === -1 &&
          templateDescriptions.indexOf(badge.description) === -1
        ) {
          promises.push(
            Templates.createAndGrant({
              name: badge.name,
              description: badge.description,
              image: badge.image,
              granter: granter.id
            }, badge.note)
          )
        }
      }
      return Promise.all(promises)
    })
}

const badgesFromAuth = (badge, provider) => {
  switch (Object.keys(badge)[0]) {
    case 'name':
      return {
        name: badge.name,
        description: `This individual uses the name ${badge.name} on Facebook.`,
        image: '/public/images/fb.jpg',
        note: 'Confirmed via Facebook.'
      }
    case 'gender':
      return {
        name: badge.gender,
        description: `This individual has listed their gender as ${badge.gender} on Facebook.`,
        image: '/public/images/fb.jpg',
        note: 'Confirmed via Facebook.'
      }
    case 'twitter':
      return {
        name: `@${badge.twitter}`,
        description: `This individual owns the account @${badge.twitter} on Twitter.`,
        image: '/public/images/twitter.jpg',
        note: 'Confirmed via Twitter.'
      }
  }
}

/**
 * Finds or creates a user based from email auth.
 *
 * @param {Object} context   graph context
 * @param {String} email     E-mail address of the user
 * @param {String} password  Hashed password from the user
 *
 */
const createLocal = ({conn}, email, password) => {
  const emailHash = MD5(email.trim().toLowerCase())
  return fetch(`https://gravatar.com/${emailHash}.json`)
  .then(res => res.ok ? res.json() : null)
  .then(gravatarInfo => {
    let displayNames = [email.match(/^[^@]+/)[0]]
    let images = []
    if (gravatarInfo) {
      const {entry: [{preferredUsername, thumbnailUrl, displayName}]} = gravatarInfo
      if (displayName) {
        displayNames.push(displayName)
      }
      if (preferredUsername) {
        displayNames.push(preferredUsername)
      }
      if (thumbnailUrl) {
        images.push(thumbnailUrl)
      }
    }
    // Make displayNames unique
    displayNames = displayNames.reduce(
      (arr, item) => arr.indexOf(item) === -1 ? arr.concat(item) : arr, []
    )
    return r.branch(
      usersTable.getAll(email, {index: 'email'}).count().eq(0),
      usersTable.insert({
        email,
        createdAt: new Date(),
        displayNames,
        images: images,
        badges: {},
        loginHash: uuid.v4().replace(/-/g, ''),
        unsubscribe: {}
      }),
      {exists: true}
    )
   .run(conn)
  })
 .then(res => {
   if (res.errors) {
     return Promise.reject(new Error('Could not insert user', res.error))
   }
   if (res.exists) {
     return Promise.reject(ErrEmailTaken)
   }
   const id = res.generated_keys[0]
   return Promise.all([
     id,
     emailConfirmationRequest({conn}, email),
     usersTable.get(id).update({
       password: hashPassword(`${password}${passwordsalt}`)
     }).run(conn)
   ])
     .then(([id]) => id)
 })
}

/**
 * Sets a forgot password token.
 *
 * @param {Object} context   graph context
 * @param {String} email     E-mail address of the user
 *
 */

const passwordResetRequest = ({conn}, email) => {
  const token = uuid.v4()
  return usersTable.getAll(email, {index: 'email'}).update({forgotPassToken: token}).run(conn)
    .then(res => {
      if (res.errors > 0) {
        return Promise.reject(new APIError(res.error))
      }
      if (res.replaced > 0) {
        return sendEmail({
          from: {
            email: 'info@nametag.chat',
            name: 'Nametag Password Reset'
          },
          to: email,
          template: 'passwordReset',
          params: {token}
        })
      }
    })
}

/**
 * Resets a password based on a user's token.
 * @param {Object} context   graph context
 * @param {String} token     Password reset token
 * @param {String} password The new hashed password
 *
 */

const passwordReset = ({conn}, token, password) =>
  token
  ? usersTable.getAll(token, {index: 'forgotPassToken'})
    .update({
      password: hashPassword(`${password}${passwordsalt}`),
      forgotPassToken: null
    }).run(conn)
    .then(res => {
      if (res.errors > 0) {
        return new Error(res.error)
      }
      if (res.replaced > 0) {
        return
      } else {
        return Promise.reject(ErrInvalidToken)
      }
    })
    .catch(() => Promise.reject(ErrInvalidToken))
    : Promise.reject(ErrInvalidToken)

/**
 * Sets an email confirmation token.
 *
 * @param {Object} context   graph context
 * @param {String} email     E-mail address of the user
 *
 */

const emailConfirmationRequest = ({conn}, email) => {
  const token = uuid.v4()
  return usersTable.getAll(email, {index: 'email'}).update({confirmation: token}).run(conn)
    .then(res => {
      if (res.errors > 0) {
        return Promise.reject(new APIError(res.error))
      }
      if (res.replaced > 0) {
        return sendEmail({
          from: {
            email: 'info@nametag.chat',
            name: 'Nametag Confirmation'
          },
          to: email,
          template: 'emailConfirm',
          params: {email, token}
        })
      }
    })
}

/**
 * Confirms an e-mail.
 *
 * @param {Object} context   graph context
 * @param {String} Token     Token confirming the user's e-mail
 *
 */

const emailConfirmation = ({conn}, token) =>
  usersTable.getAll(token, {index: 'confirmation'}).update({confirmation: 'confirmed'}).run(conn)
    .then(res => res.replaced === 0 ? ErrNotFound : null)

/**
 * Sends an e-mail allowing a user to log in with a token
 *
 * @param {Object} context   graph context
 * @param {String} email     Token confirming the user's e-mail
 * @param {String} path      Optional: path to direct the user to upon successful login
 *
 */

const hashLoginRequest = ({conn}, email, path) =>
  getByEmail({conn}, email)
    .then(({email, loginHash}) => {
      sendEmail({
        from: {
          email: 'noreply@nametag.chat',
          name: 'Nametag Login'
        },
        to: email,
        template: 'hashLogin',
        params: {loginHash, path}
      })
    })

/**
 * Unsubscribes to a room or to all email.
 *
 * @param {Object} context   graph context
 * @param {String} loginHash     Unique token identifying the user
 * @param {String} roomId    Id of the room to be unsubscribed from
 *
 */

const unsubscribe = ({conn}, loginHash, roomId) =>
  usersTable.getAll(loginHash, {index: 'loginHash'})
    .update({unsubscribe: {[roomId]: true}})
    .run(conn)
    .then(res => res.replaced === 0 ? ErrNotFound : null)

/**
 * Determines whether a hashed password is valid
 * TODO: Make this one db call with findemail.
 * @param {Object} context   graph context
 * @param {String} id     E-mail address of the user
 * @param {String} password  Hashed password from the user
 *
 */

const validPassword = ({conn}, id, password) =>
  usersTable.get(id)('password').eq(hashPassword(`${password}${passwordsalt}`)).run(conn)

const hashPassword = (password) => {
  let hashedPassword = SHA3(password, {outputLength: 224})
  return hashedPassword.toString(enc.Base64)
}

/**
 * Sends an e-mail digest to all valid users
 * @param {Object} context   graph context
 *
 */

const emailDigest = ({conn}) =>

  /* Query will return results of the form:
  * [{
  *  group, -The email to be delivered to
  *  reduction: [
  *    room: {title}, - The title of the room
  *    mod: {name, image}, - The name and image of the room's mod
  *    newMessages,  - The number of new messages in the room
  *    newNametags   - The number of new nametags in the room
  *  ]}]
  */

  db.table('nametags')
  .filter(n => n('room'))
  .eqJoin('room', db.table('rooms'))
  .filter(join => r.not(join('right')('closed')))
  .map(join => ({
    room: join('right').pluck('title', 'mod', 'id'),
    nametag: join('left').pluck('latestVisit', 'user')
  }))
  .eqJoin(join => join('nametag')('user'), db.table('users'))
  .filter(join => join('right')('email')
    .and(r.not(join('right')('unsubscribe').keys().contains('digest'))))
  .map(join =>
      join('left').merge({
        email: join('right')('email'),
        loginHash: join('right')('loginHash')
      }))
  .eqJoin(join => join('room')('mod'), db.table('nametags'))
  .map(join => ({
    id: join('left')('room')('id'),
    title: join('left')('room')('title'),
    email: join('left')('email'),
    loginHash: join('left')('loginHash'),
    mod: join('right').pluck('name', 'image'),
    newNametags: db.table('nametags')
        .getAll(join('left')('room')('id'), {index: 'room'})
        .filter(nt => nt('createdAt').gt(join('left')('nametag')('latestVisit')))
        .count(),
    newMessages: db.table('messages')
        .getAll([join('left')('room')('id'), false], {index: 'room_recipient'})
        .filter(msg => msg('createdAt').gt(join('left')('nametag')('latestVisit')))
        .count()
  }))
  .filter(join => join('newMessages').gt(0))
  .map(join => join.merge({
    latestMessage: db.table('messages')
      .getAll([join('id'), false], {index: 'room_recipient'})
      .orderBy(r.desc('createdAt'))
      .nth(0)('text')
  }))
  .group('email')
  .run(conn)
  .then(results => {
    let sent = {}
    for (var i = 0; i < results.length; i++) {
      const {group, reduction} = results[i]
      const loginHash = reduction[0].loginHash
      if (!sent[group]) {
        sent[group] = true
        sendEmail({
          from: {
            email: 'noreply@nametag.chat',
            name: 'Nametag Update'
          },
          to: group,
          template: 'digest',
          params: {loginHash, rooms: reduction}
        })
      }
    }
  })

module.exports = (context) => ({
  Users: {
    get: (id) => get(context, id),
    getByEmail: (email) => getByEmail(context, email),
    getByNametag: (nametagId) => getByNametag(context, nametagId),
    getByHash: (hash) => getByHash(context, hash),
    addEmail: (userId, email) => addEmail(context, userId, email),
    getAdminTemplates: () => getAdminTemplates(context),
    findOrCreateFromAuth: (profile, provider) => findOrCreateFromAuth(context, profile, provider),
    createLocal: (email, password) => createLocal(context, email, password),
    validPassword: (id, password) => validPassword(context, id, password),
    appendUserArray: (property, value) => appendUserArray(context, property, value),
    addNametag: (nametagId, roomId) => addNametag(context, nametagId, roomId),
    addBadge: (badgeId, templateId, nametagId) => addBadge(context, badgeId, templateId, nametagId),
    addToken: (token) => addToken(context, token),
    getTokens: (nametagIds) => getTokens(context, nametagIds),
    getEmails: (nametagId) => getEmails(context, nametagId),
    addBadgesFromAuth: (authProfile, user) => addBadgesFromAuth(context, authProfile, user),
    addDefaultsFromAuth: (authProfile, user) => addDefaultsFromAuth(context, authProfile, user),
    passwordResetRequest: (email) => passwordResetRequest(context, email),
    passwordReset: (token, password) => passwordReset(context, token, password),
    emailConfirmationRequest: (email) => emailConfirmationRequest(context, email),
    emailConfirmation: (token) => emailConfirmation(context, token),
    hashLoginRequest: (email, path) => hashLoginRequest(context, email, path),
    unsubscribe: (loginHash, roomId) => unsubscribe(context, loginHash, roomId),
    emailDigest: () => emailDigest(context)
  }
})
