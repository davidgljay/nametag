const TwitterStrategy = require('passport-twitter').Strategy
const UsersLoader = require('../graph/models/Users')
const config = require('../secrets.json')
const Context = require('../graph/context')

const Users = (conn) =>
  UsersLoader(new Context({}, conn)).Users

module.exports = conn => new TwitterStrategy(
  {
    consumerKey: config.twitter.id,
    consumerSecret: config.twitter.secret,
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },
  (req, token, tokenSecret, profile, done) => {
    const authProfile = {
      provider: 'twitter',
      displayNames: [profile.displayName, profile.username],
      providerPhotoUrl: profile.photos[0].value,
      id: profile.id,
      badges: [{
        twitter: profile.username
      }]
    }
    return req.user
    ? Promise.resolve(done(null, {user: req.user, authProfile}))
    : Users(conn).findOrCreateFromAuth(authProfile, 'twitter')
      .then(user => done(null, user))
      .catch(done)
  }
)
