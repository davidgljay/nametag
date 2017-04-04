const UsersLoader = require('../graph/models/Users')
const LocalStrategy = require('passport-local').Strategy
const ErrBadAuth = require('../errors')
const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    Users(conn).getByEmail(email)
      .then(user => {
        if (!user) {
          return done(null, false, ErrBadAuth)
        }
        return Promise.all([Users(conn).validPassword(user.id, password), user])
      })
      .then(([valid, user]) => {
      if (!valid) {
          return done(null, false, ErrBadAuth)
        }
        return done(null, user)
      })
      .catch(done)
  }
)

module.exports.register = conn => (req, res, next) => {
  const {email, password} = req.body
  if (!email || !password) {
    next(ErrBadAuth)
  }
  Users(conn).createLocal(email, password)
    .then((id) => {
      res.send({id})
    })
    .catch(err => next(err))
}
