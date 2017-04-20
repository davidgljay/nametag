const FacebookStrategy = require('passport-facebook').Strategy
const UsersLoader = require('../graph/models/Users')
const config = require('../secrets.json')
const Context = require('../graph/context')

const Users = (req, conn) =>
  UsersLoader(new Context(req || {}, conn)).Users

module.exports = conn => new FacebookStrategy({
  clientID: config.facebook.id,
  clientSecret: config.facebook.secret,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'name', 'picture', 'displayName']
},
  (accessToken, refreshToken, profile, done) => {
    return Users(null, conn).findOrCreateFromAuth(profile, 'facebook')
      .then(data => done(null, data))
      .catch(done)
  }
)

module.exports.handleFacebookCallback = (req, res, next, conn) => (err, data) => {
  if (err) {
    next(err)
    return
  }
  const {user, authProfile} = data
  const reqWithUser = Object.assign({}, req, {user})
  return Promise.all([
        Users(reqWithUser, conn).addDefaultsFromAuth(authProfile),
        Users(reqWithUser, conn).addBadgesFromAuth(authProfile),
      ]).then(() => {
        req.login(user, (err) => {
          if (err) {
            return next(err)
          }
          res.redirect('/')
        })
      }).catch(next)

}
