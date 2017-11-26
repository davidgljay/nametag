const UsersLoader = require('../graph/models/Users')
const HashStrategy = require('passport-hash').Strategy
const {ErrBadAuth} = require('../errors')
const Users = (conn) => UsersLoader({conn}).Users

module.exports = conn => new HashStrategy(
  (hash, done) => {
    Users(conn).getByHash(hash)
      .then(user => {
        if (!user) {
          return done(null, false, ErrBadAuth)
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
    return next(ErrBadAuth)
  }
  // Perform the login of the user!
  req.login(user, (err) => {
    if (err) {
      return next(err)
    }
    // We logged in the user! Let's send back the user id.
    res.redirect('/')
  })
}
