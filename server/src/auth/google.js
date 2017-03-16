const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const UsersLoader = require('../graph/loaders/Users')
const config = require('../secrets.json')

const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new GoogleStrategy(
    {
    clientID: config.google.id,
    clientSecret: config.google.secret,
    callbackURL: '/auth/google/callback'
  },
  (token, tokenSecret, profile, done) => {
    return Users(conn).findOrCreateFromAuth(profile, 'google')
      .then(user => done(null, user))
      .catch(done)
  }
)
