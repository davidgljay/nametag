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
*   provider- The provider to auth with, one of 'facebook', 'twitter'
*
* @returns
*   Promise
*/
export function getUser() {
  return (dispatch) => {
    return getAuth().then((user) => {
      if (user) {
        dispatch(addUser(user.id, user.data))
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







