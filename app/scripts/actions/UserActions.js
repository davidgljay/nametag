import {hz, hzAuth, getAuth, unAuth} from '../api/horizon'
import constants from '../constants'
import errorLog from '../utils/errorLog'

export function addUser(id, data) {
  return {
    type: constants.ADD_USER,
    data,
    id,
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
export function providerAuth(provider) {
  return () => {
    return hzAuth(provider)
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
export function getUser() {
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
export function logout() {
  return (dispatch) => {
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
export function setting(option, value) {
  return {
    type: constants.USER_SETTING,
    option,
    value,
  }
}

/*
* Update an array in the user's data object (e.g. adding an iconurl)
* @params
*  option
*  value
*
* @returns
*   null
*/
export function appendUserArray(property, value) {
  return (dispatch) => {
    dispatch({
      type: constants.APPEND_USER_ARRAY,
      property,
      value,
    })
    return new Promise((resolve, reject) => {
      hz.currentUser().fetch().subscribe((user) => {
        let data = user.data
        data[property].push(value)
        hz('users').update({id: user.id, data}).subscribe((res) => {
          resolve(res)
        }, reject)
      }, reject)
    }).catch(errorLog('Updating user array'))
  }
}
