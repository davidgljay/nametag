const TwitterStrategy = require('passport-twitter').Strategy
const UsersLoader = require('../graph/loaders/Users')
const config = require('../secrets.json')

const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new TwitterStrategy(
    {
    consumerKey: config.twitter.id,
    consumerSecret: config.twitter.secret,
    callbackURL: "/auth/twitter/callback"
  },
  (token, tokenSecret, profile, done) => {
    return Users(conn).findOrCreateFromAuth(profile, 'twitter')
      .then(user => done(null, user))
      .catch(done)
  }
)
