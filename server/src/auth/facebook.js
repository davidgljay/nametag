const FacebookStrategy = require('passport-facebook').Strategy
const UsersLoader = require('../graph/models/Users')
const config = require('../secrets.json')
const Context = require('../graph/context')

const Users = conn =>
  UsersLoader(new Context({}, conn)).Users

module.exports = conn => new FacebookStrategy({
  clientID: config.facebook.id,
  clientSecret: config.facebook.secret,
  callbackURL: '/auth/facebook/callback',
  profileFields: [
    'id',
    'about',
    'age_range',
    'link',
    'picture',
    'gender',
    'displayName'
  ]
},
  (accessToken, refreshToken, profile, done) => {
    return Users(conn).findOrCreateFromAuth(profile, 'facebook')
      .then(data => done(null, data))
      .catch(done)
  }
)
