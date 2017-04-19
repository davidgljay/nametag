const {db} = require('../../db')
const r = require('rethinkdb')
const {fromUrl} = require('../../routes/images/imageUpload')
const {ErrBadAuth, ErrNotLoggedIn, ErrEmailTaken} = require('../../errors')
const {passwordsalt} = require('../../secrets.json')
const {enc, SHA3} = require('crypto-js')

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
  : Promise.reject(ErrNotLoggedIn)

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
 * @param {String} nametagId   the nametagId which need to be sent a message
 *
 */

const getToken = ({conn}, nametagId) =>
  usersTable.getAll(nametagId, {index: 'nametags'})('token').nth(0).run(conn)

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

const addBadge = ({user, conn}, badgeId, templateId) =>
  usersTable.get(user.id).update({badges: {[templateId]: badgeId}}).run(conn)

/**
 * Finds or creates a user based on an oauth provider.
 *
 * @param {Object} context   graph context
 * @param {Object} profile   profile information returned from the oauth provider
 * @param {String} provider  string identifying the provider ('google', 'facebook', etc)
 *
 */

const findOrCreateFromAuth = ({user, conn, models: {Templates, Granters, Badges}}, profile, provider) => {
  const authProfile = userFromAuth(provider, profile)
  let userPromise

  // If the user is logged in, add displayNames and images
  if (user) {
    let userUpdates = authProfile.displayNames
      .reduce((arr, name) =>
        user.displayNames.indexOf(name) === -1
        ? arr.concat(Users.appendUserArray('displayNames', name)) : arr, [])
    userPromise = fromUrl(50, 50, authProfile.providerPhotoUrl)
      .then(imageUrl => Promise.all(
        userUpdates.concat(
          user.images.indexOf(imageUrl) === -1 ? Users.appendUserArray('images', imageUrl) : null
        )
      ))

  // If the user is not logged in, either create the user or log them in
  } else {
    userPromise = usersTable
    .getAll(authProfile.id, {index:[provider]}).run(conn)
    .then(cursor => cursor.toArray())
    .then(([usr]) => {
      if (usr) {
        return usr
      }
      return fromUrl(50, 50, authProfile.providerPhotoUrl)
        .then(imageUrl => {
          const userObj = {
            displayNames: authProfile.displayNames,
            images: [imageUrl.url],
            [provider]: authProfile.id,
            createdAt: Date.now()
          }
        })
        .then(([rdbRes, userObj]) => {
          if (rdbRes.errors > 0) {
            return Promise.reject(new Error('Error while inserting user'))
          }
          return Object.assign({}, userObj,
            {
              id: rdbRes.generated_keys[0]
            })
        })
    })
  }

  const addBadges = ((user, providerInfo) =>
    Promise.all([
      Templates.getAll(Object.keys(user.badges)).run(conn),
      Granters.getByUrlCode('nametag').run(conn)
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

      for (var i=0; i < providerInfo.badges.length; i++ ) {
        const badgeInfo = badgesFromAuth(providerInfo.badges[i], provider)
        if (
          templateNames.indexOf(badgeInfo.name) === -1
          && templateDescriptions.indexOf(badgeInfo.description) === -1
        ) {
          promises.push(
            Templates.create({
              name: badge.name,
              description: badge.description,
              image: badge.image,
              granter: granter.id
            })
            .then(template => Promise.all([
              template,
              Nametags.create({
                name: badge.name,
                bio: badge.description,
                template: template.id
              })
            ])
            .then([template, nametag] => {
              Badges.create(badge.note, template.id, nametag.id)
            })
          )
        }
      }
      return promises
    })
  )
}

const badgesFromAuth = (badge, provider) => {
  switch (Object.keys(badge)[0]) {
  case 'name':
    return {
      name: badge.name,
      description: `This individual uses the name ${badge.name} on Facebook.`,
      image: '/images/fb.jpg',
      note: 'Confirmed via Facebook.'
    }
  case 'twitter':
    return {
      name: `@${badge.twitter}`,
      description: `This has the account @${badge.twitter} on Twitter.`,
      image: '/images/twitter.jpg',
      note: 'Confirmed via Twitter.'
    }
  }
}

const userFromAuth = (provider, profile) => {
  switch (provider) {
    case 'facebook':
      return {
        displayNames: [profile.displayName],
        providerPhotoUrl: profile.photos[0].value,
        id: profile.id,
        badges: [{
          name: profile.displayName
        }]
      }
    case 'twitter':
      return {
        displayNames: [profile.displayName, profile.username],
        providerPhotoUrl: profile.photos[0].value,
        id: profile.id,
        badges: [{
          twitter: profile.username
        }]
      }
    case 'google':
      return {
        displayNames: [profile.displayName],
        providerPhotoUrl: profile.photos[0].value,
        id: profile.id
      }
  }
}

const hashPassword = (password) => {
  let hashedPassword = SHA3(password, {outputLength: 224})
  return hashedPassword.toString(enc.Base64)
}

/**
 * Finds or creates a user based from local auth.
 *
 * @param {Object} context   graph context
 * @param {String} email     E-mail address of the user
 * @param {String} password  Hashed password from the user
 *
 */

const createLocal = ({conn}, email, password) =>
 r.branch(
   usersTable.getAll(email, {index: 'email'}).count().eq(0),
   usersTable.insert({
     email,
     createdAt: new Date(),
     badges: [],
     displayNames: [],
     images: []
   }),
   {exists: true}
 )
  .run(conn).then(res => {
    if (res.errors) {
      return Promise.reject(new Error('Could not insert user', res.error))
    }
    if (res.exists) {
      return Promise.reject(ErrEmailTaken)
    }
    const id = res.generated_keys[0]
    return usersTable.get(id).update({
      password: hashPassword(`${password}${passwordsalt}${id}`)
    }).run(conn)
    .then(() => id)
  })

/**
 * Determines whether a hashed password is valid
 * TODO: Make this once function with findemail.
 * @param {Object} context   graph context
 * @param {String} id     E-mail address of the user
 * @param {String} password  Hashed password from the user
 *
 */

const validPassword = ({conn}, id, password) =>
  usersTable.get(id)('password').eq(hashPassword(`${password}${passwordsalt}${id}`)).run(conn)

module.exports = (context) => ({
  Users: {
    get: (id) => get(context, id),
    getByEmail: (email) => getByEmail(context, email),
    findOrCreateFromAuth: (profile, provider) => findOrCreateFromAuth(context, profile, provider),
    createLocal: (email, password) => createLocal(context, email, password),
    validPassword: (id, password) => validPassword(context, id, password),
    appendUserArray: (property, value) => appendUserArray(context, property, value),
    addNametag: (nametagId, roomId) => addNametag(context, nametagId, roomId),
    addBadge: (badgeId, templateId) => addBadge(context, badgeId, templateId),
    addToken: (token) => addToken(context, token),
    getToken: (nametagId) => getToken(context, nametagId)
  }
})
