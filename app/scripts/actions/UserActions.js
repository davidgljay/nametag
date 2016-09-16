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


/*
* Puts a record linking a nametag to the user's account
*
*@params
*   room -The id of the room that the nametag appears in
*   user - The id of the user
*   nametag - The id of the nametag
*
* @returns
*   Promise resolving to nametag id
*/
export function putUserNametag(room, user, nametag) {
  return () => {
    return new Promise((resolve, reject) => {
      hz('user_nametags').insert({room, user, nametag}).subscribe((id) => {
        resolve(id)
      }, reject)
    }).catch(errorLog('Putting user nametag'))
  }
}

/*
* Adds a user nametag to the redux store
*
*@params
*   room -The id of the room that the nametag appears in
*   nametag - The complete nametag to be stored
*
* @returns
*   Action object
*/
export function addUserNametag(room, nametag) {
  return {
    type: constants.ADD_USER_NAMETAG,
    room: room,
    nametag: nametag,
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
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('user_nametags').findAll({user}).fetch().subscribe((userNametags) => {
        let userNametag = null
        for (let i = 0; i < userNametags.length; i++) {
          if (userNametags[i].room === room) {
            userNametag = userNametags[i]
          }
        }
        if (userNametag) {
          dispatch(addUserNametag(userNametags[0].room, userNametags[0].nametag))
          resolve(userNametags[0])
        } else {
          dispatch(addUserNametag(room, null))
          resolve(null)
        }
      }, reject)
    }).catch(errorLog('Getting user nametag'))
  }
}




