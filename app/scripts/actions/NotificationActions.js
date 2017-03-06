import errorLog from '../utils/errorLog'
import constants from '../constants'

// Registers a serviceWorker and registers that worker with firebase
// Null op is a serviceWorker is already registered
export const registerServiceWorker = () => () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: './'})
      .then(reg => reg && firebase.messaging().useServiceWorker(reg))
      .catch(errorLog('Error registering serviceWorker'))
  }
}

// Initializes Firebase.
// Registers a serviceWorker if one is registered on the system.
export const firebaseInit = () => (dispatch) =>
  // Initialize Firebase
  firebase.initializeApp({
    apiKey: constants.FIREBASE_WEB_KEY,
    databaseURL: constants.FIREBASE_DB_URL,
    messagingSenderId: constants.FIREBASE_SENDER_ID
  })
  .then(() => {
    if ('serviceWorker' in navigator) {
      return navigator.serviceWorker.getRegistration()
    }
  })
  .then(reg => reg && firebase.messaging().useServiceWorker(reg))
  .then(() => dispatch(getFcmToken()))
  .catch(errorLog('Initializing Firebase and registering serviceWorker'))

// Checks for a refreshed Firebase Cloud messaging token
export const fcmTokenRefresh = () => (dispatch) =>
  firebase.messaging().onTokenRefresh(() => dispatch(getFcmToken()))
  .catch(errorLog('Refreshing FCM Token'))

// Sends a new FCM token to the server.
export const getFcmToken = () => () =>
 firebase.messaging().getToken()
 .then(token => console.log('Received FCM token, ready to send to server', token))
 .catch(errorLog('Receiving FCM token'))

// Requests permission to send notifications to the user.
export const requestNotifPermissions = () => (dispatch) =>
  firebase.messaging().requestPermission()
    .then(() => dispatch(getFcmToken()))
