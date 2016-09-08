import errorLog from '../utils/errorLog'

export const hz = Horizon()

export function hzAuth(provider) {
  //   hz({authType: 'token'})
  let promise
  if (!hz.hasAuthToken()) {
    promise = new Promise((resolve, reject) => {
      hz.authEndpoint(provider).subscribe((endpoint) => {
        // TODO: Add certificates and replace with https
        window.location = 'https://localhost:8181' + endpoint
        resolve()
      }, (err) => reject(err))
    }).catch(errorLog('Error authenticating'))
  } else {
    console.log('Authed!')
    promise = new Promise(resolve => resolve('Already authed!'))
    // We have a token already, do authenticated Horizon stuff here
  }
  return promise
}

export function getAuth() {
  if (hz.hasAuthToken()) {
    return new Promise((resolve) => {
      hz.currentUser().fetch().subscribe((user) => {
        resolve(user)
      })
    }).catch(errorLog('Getting auth token'))
  }
  return new Promise((resolve) => resolve(false))
}

export function unAuth() {
  Horizon.clearAuthTokens()
}
