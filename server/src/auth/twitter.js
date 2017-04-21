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
    callbackURL: '/auth/twitter/callback'
  },
  (token, tokenSecret, profile, done) => {
    return Users(conn).findOrCreateFromAuth(profile, 'twitter')
      .then(user => done(null, user))
      .catch(done)
  }
)
