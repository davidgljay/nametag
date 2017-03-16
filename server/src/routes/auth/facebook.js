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
const facebookCallback = passport.authenticate('facebook',
  { successRedirect: '/',
    failureRedirect: '/#login' })


module.exports = {
  facebook,
  facebookCallback
}
