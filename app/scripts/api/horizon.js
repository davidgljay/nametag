import errorLog from '../utils/errorLog'

export const hz = Horizon()

export function hzAuth(provider) {
  //   hz({authType: 'token'})
  let promise
  if (!hz.hasAuthToken()) {
    promise = new Promise((resolve, reject) => {
      hz.authEndpoint(provider).subscribe((endpoint) => {
        window.location = endpoint
        resolve()
      }, reject)
    }).catch(errorLog('Error authenticating'))
  } else {
    promise = Promise.resolve()
    // We have a token already, do authenticated Horizon stuff here
  }
  return promise
}

export function getAuth() {
  if (hz.hasAuthToken()) {
    return new Promise((resolve, reject) => {
      hz.currentUser().fetch().subscribe((user) => {
        resolve(user)
      }, reject)
    }).catch(errorLog('Getting auth token'))
  }
  return new Promise((resolve) => resolve(false))
}

export function unAuth() {
  Horizon.clearAuthTokens()
}
