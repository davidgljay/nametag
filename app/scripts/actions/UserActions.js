import {hz, hzAuth, getAuth, unAuth} from '../api/horizon'
import constants from '../constants'
import errorLog from '../utils/errorLog'
// import trackEvent from '../utils/analytics'

export function addUser (id, data) {
  return {
    type: constants.ADD_USER,
    data,
    id
  }
}

/*
* Log in via a provider
* TODO: Add logic to save application state
* @params
*   provider- The provider to auth with, one of 'facebook', 'twitter'
*
* @returns
*   Promise
*/
export function providerAuth (provider) {
  return () => {
    // trackEvent(`AUTH_${provider.toUpperCase()}`)
    window.location = '/auth/facebook'
  }
}

/*
* Get currently authenticated user if one exists
*
* @params
*   none
*
* @returns
*   Promise
*/
export function getUser () {
  return (dispatch) => {
    return getAuth().then((user) => {
      if (user) {
        dispatch(addUser(user.id, user.data))

        // Horizon.watch isn't working for currentUser, so I need a workaround to
        // check for changes to profile images.

        if (user.data.loadingIcons) {
          setTimeout(() => dispatch(getUser()), 500)
        }
      }
      return user
    })
    .catch(errorLog('Error getting user info'))
  }
}

/*
* Log out the current user
*
*@params
*   none
*
* @returns
*   Function which accepts dispatch and logs the user out.
*/
export function logout () {
  return (dispatch) => {
    trackEvent('LOGOUT')
    unAuth()
    dispatch({type: constants.LOGOUT_USER})
  }
}

/*
* Set a generic option for the user (e.g. Toggle login dialog)
* @params
*  option
*  value
*
* @returns
*   null
*/
export function setting (option, value) {
  return {
    type: constants.USER_SETTING,
    option,
    value
  }
}

/*
* Update an array in the user's data object (e.g. adding an iconurl)
* @params
*  option
*  value
*
* @returns
*   Promise resolving to horizon update response
*/
export function appendUserArray (property, value) {
  return (dispatch) => {
    dispatch({
      type: constants.APPEND_USER_ARRAY,
      property,
      value
    })
    return new Promise((resolve, reject) => {
      hz.currentUser().fetch().subscribe(resolve, reject)
    })
    .then((user) => {
      return new Promise((resolve, reject) => {
        const data = {
          [property]: user.data[property] ? user.data[property].concat([value]) : [value]
        }
        hz('users').update({id: user.id, data}).subscribe(resolve, reject)
      })
    }).catch(errorLog('Updating user array'))
  }
}

/*
* Add generic information to the user's data object
* @params
*  option
*  value
*
* @returns
*   Promise resolving to horizon update reponse
*/
export function addUserData (property, value) {
  return (dispatch) => {
    dispatch({
      type: constants.ADD_USER_DATA,
      property,
      value
    })
    return new Promise((resolve, reject) => {
      hz.currentUser().fetch().subscribe(resolve, reject)
    })
    .then((user) => {
      return new Promise((resolve, reject) => {
        const data = {
          [property]: value
        }
        hz('users').update({id: user.id, data}).subscribe(resolve, reject)
      })
    }).catch(errorLog('Updating user array'))
  }
}
