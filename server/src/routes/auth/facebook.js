const passport = require('passport')

/**
 * Facebook auth endpoint, this will redirect the user immediatly to facebook
 * for authorization.
 */
const facebook = passport.authenticate('facebook',
  {
    display: 'popup',
    authType: 'rerequest',
    scope: ['public_profile'],
    profileFields: ['id', 'displayName', 'email', 'picture']
  })

/**
 * Facebook callback endpoint, this will send the user a html page designed to
 * send back the user credentials upon sucesfull login.
 */
const facebookCallback = (req, res, next) => {

  // Perform the facebook login flow and pass the data back through the opener.
  passport.authenticate('facebook', (req, res, next) => {
    console.log('FB callback path', req.user)
  })(req, res, next)
}

module.exports = {
  facebook,
  facebookCallback
}
