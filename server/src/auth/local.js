const UsersLoader = require('../graph/models/Users')
const LocalStrategy = require('passport-local').Strategy
const ErrBadAuth = require('../errors')
const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new LocalStrategy(
  (email, password, done) => {
    console.log(email, password)
    Users(conn).getByEmail(email)
      .then(user => {
        if (!user) {
          return done(null, false, ErrBadAuth)
        }
        if (!Users(conn).validPassword(user.id, password)) {
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
