const UsersLoader = require('../graph/models/Users')
const HashStrategy = require('passport-hash').Strategy
const {ErrBadHash} = require('../errors')
const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new HashStrategy(
  (hash, done) => {
    Users(conn).getByHash(hash)
      .then(user => {
        if (!user) {
          return done(null, false, ErrBadHash)
        }
        return done(null, user)
      })
      .catch(done)
  }
)

module.exports.handleHashCallback = (req, res, next) => (err, user) => {
  if (err) {
    return next(err)
  }

  if (!user) {
    return next(ErrBadHash)
  }
  // Perform the login of the user
  req.login(user, (err) => {
    if (err) {
      return next(err)
    }
    res.redirect(req.query && req.query.path ? decodeURIComponent(req.query.path) : '/')
  })
}
