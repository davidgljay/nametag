import errorLog from '../utils/errorLog'
import constants from '../constants'
// import {addUserData} from './UserActions'

// Registers a serviceWorker and registers that worker with firebase
export const registerServiceWorker = () => (dispatch) => {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register('/sw.js', {scope: './'})
      .catch(errorLog('Error registering serviceWorker'))
      .then(reg => reg ? firebase.messaging().useServiceWorker(reg)
        : Promise.reject(new Error('No service worker returned!')))
      .then(res => dispatch(getFcmToken()))
      .then(() => dispatch(fcmTokenRefresh()))
      .catch(errorLog('Error registering serviceWorker with Firebase'))
  }
  return Promise.reject('ServiceWorker not supported in this browser')
}

// Initializes Firebase.
// Registers a serviceWorker if one is registered on the system.
export const firebaseInit = () => (dispatch) => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return Promise.resolve()
  // }
  return firebase.initializeApp({
    apiKey: constants.FIREBASE_WEB_KEY,
    databaseURL: constants.FIREBASE_DB_URL,
    messagingSenderId: constants.FIREBASE_SENDER_ID
  })
}

// Checks for a refreshed Firebase Cloud messaging token
export const fcmTokenRefresh = (updateToken) => (dispatch) =>
  firebase.messaging().onTokenRefresh(() => dispatch(getFcmToken(updateToken)))

// Sends a new FCM token to the server.
export const getFcmToken = (updateToken) => (dispatch) =>
 firebase.messaging().getToken()
 .then(updateToken)
 .catch(errorLog('Error receiving FCM token'))

// Requests permission to send notifications to the user.
export const requestNotifPermissions = (updateToken) => (dispatch) => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  firebase.messaging().requestPermission()
    .then(() => dispatch(getFcmToken(updateToken)))
    .then(() => dispatch(fcmTokenRefresh(updateToken)))
    .catch(() => console.log('Notification permission refused'))
}
