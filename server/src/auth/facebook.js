const FacebookStrategy = require('passport-facebook').Strategy
const UsersLoader = require('../graph/models/Users')
const config = require('../secrets.json')

const Users = (req, conn) => UsersLoader(new Context(req, conn)).Users

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

module.exports.handleFacebookCallback = conn => (req, res, next) => (err, {authProfile, user}) =>
  err
  ? next(err)
  : Promise.all([
      Users(req, conn).addDefaultsFromAuth(authProfile, user),
      Users(req, conn).addBadgesFromAuth(authProfile, user),
    ]).then(() => {
      res.redirect('/')
    }).catch(next)
