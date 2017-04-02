const UsersLoader = require('../graph/models/Users')
const LocalStrategy = require('passport-local').Strategy
const ErrBadAuth = require('../../errors')
const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new LocalStrategy(
  (email, password, done) => {
    Users.getByEmail(email)
      .then(user => {
        if (!user) {
          return done(null, false, ErrBadAuth)
        }
        if (!Users.validPassword(user.id, password)) {
          return done(null, false, ErrBadAuth)
        }
        return done(null, user)
      })
      .catch(done)
  }
)
