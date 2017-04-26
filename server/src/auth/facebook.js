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
  ],
  passReqToCallback: true
},
  (req, accessToken, refreshToken, profile, done) => {
    const authProfile = {
      provider: 'facebook',
      displayNames: [profile.displayName],
      providerPhotoUrl: profile.photos[0].value,
      id: profile.id,
      badges: [{
        name: profile.displayName
      }, {
        gender: profile.gender
      }]
    }

    return req.user
      ? done(null, {user: req.user, authProfile})
      : Users(conn).findOrCreateFromAuth(authProfile, 'facebook')
      .then(data => done(null, data))
      .catch(done)
  }
)
