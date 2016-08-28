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
*   none
*/
export function logout() {
  return (dispatch) => {
    unAuth()
    dispatch({type: constants.LOGOUT_USER})
  }
}

/*
* Adds a nametag to the user's account
*
*@params
*   room -The id of the room that the nametag appears in
*   user - The id of the user
*   nametag - The id of the nametag
*
* @returns
*   none
*/
export function addUserNametag(room, user, nametag) {
  return () => {
    return new Promise((resolve, reject) => {
      hz('user_nametags').insert({room, user, nametag}).subscribe((id) => {
        resolve(id)
      }, reject)
    }).catch(errorLog('Adding user nametag'))
  }
}

/*
* Gets the user's nametag for a particular room
*
*@params
*   nametagid
*
* @returns
*   none
*/
export function getUserNametag(room, user) {
  return () => {
    return new Promise((resolve, reject) => {
      hz('user_nametags').find({user: user}).subscribe((nametags) => {
        for (let i = 0; i < nametags.length; i++) {
          if (nametags[i].room === room) {
            resolve(nametags[i].nametag)
          }
        }
        reject('nametag not found for user ' + user + ' in room ' + room)
      }, reject)
    }).catch(errorLog('Getting user nametag'))
  }
}




