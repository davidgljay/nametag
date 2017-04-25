const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const UsersLoader = require('../graph/models/Users')
const config = require('../secrets.json')

const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new GoogleStrategy(
  {
    clientID: config.google.id,
    clientSecret: config.google.secret,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },
  (req, token, tokenSecret, profile, done) => {
    const authProfile = {
      provider: 'google',
      displayNames: [profile.displayName],
      providerPhotoUrl: profile.photos[0].value,
      id: profile.id
    }
    return req.user
    ? done(null, {user: req.user, authProfile})
    : Users(conn).findOrCreateFromAuth(authProfile, 'google')
      .then(data => done(null, data))
      .catch(done)
  }
)
