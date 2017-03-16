const UsersLoader = require('../graph/loaders/Users')
const LocalStrategy = require('passport-local').Strategy


const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new LocalStrategy(
  (email, password, done) => {
    Users(conn).getByEmail(email)
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
