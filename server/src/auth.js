const Users = require('./graph/loaders/Users')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('./secrets.json')

const local = new LocalStrategy(
  (email, password, done) => {
    User.getByEmail(email)
      .then(user => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' })
        }
        if (!User.validPassword(user, password)) {
          return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user);
      })
      .catch(done)
  }
)

const facebook = new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: "/auth/facebook/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('fb callback about to findOrCreate', accessToken, profile)
    return Users.findOrCreateFromAuth(profile, 'facebook')
      .then(user => {
        if (err) { return done(err); }
        done(null, user);
      })
      .catch(done)
  }
)

module.exports = {
  local,
  facebook
}
