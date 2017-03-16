const FacebookStrategy = require('passport-facebook').Strategy
const UsersLoader = require('../graph/loaders/Users')
const config = require('../secrets.json')

const Users = (conn) => UsersLoader({conn}).Users

const strategy = conn => new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'name', 'picture', 'displayName']
  },
  (accessToken, refreshToken, profile, done) => {
    return Users(conn).findOrCreateFromAuth(profile, 'facebook')
      .then(user => done(null, user))
      .catch(done)
  }
)

module.exports = {
  strategy
}
