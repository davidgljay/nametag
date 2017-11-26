const UsersLoader = require('../graph/models/Users')
// const LocalStrategy = require('passport-local').Strategy
// const {ErrBadAuth} = require('../errors')
const Users = (conn) => UsersLoader({conn}).Users

// module.exports = conn => new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// },
//   (req, email, path, done) => {
//     Users(conn).getByEmail(email)
//       .then(user => {
//         if (!user) {
//           return done(null, false, ErrBadAuth)
//         }
//         return Promise.all([Users(conn).validPassword(user.id, password), user])
//       })
//       .then(([valid, user]) => {
//         if (!valid) {
//           return done(null, false, ErrBadAuth)
//         }
//         return done(null, user)
//       })
//       .catch(done)
//   }
// )
//
// module.exports.handleLocalCallback = (req, res, next) => (err, user) => {
//   if (err) {
//     return next(err)
//   }
//
//   if (!user) {
//     return next(ErrBadAuth)
//   }
//   // Perform the login of the user!
//   req.login(user, (err) => {
//     if (err) {
//       return next(err)
//     }
//     // We logged in the user! Let's send back the user id.
//     res.json({id: user.id})
//   })
// }

module.exports.register = conn => (req, res, next) => {
  const {email, path} = req.body
  if (!email) {
    next(ErrBadAuth)
  }
  Users(conn).createLocal(email, path)
    .then(({id, newUser}) => {
      if (newUser) {
        res.json({id, newUser})
      } else {
        res.json({newUser})
      }
    })
    .catch(err => next(err))
}
