export const hz = Horizon()

export function hzAuth(provider) {
  hz({authType: 'token'})
  let promise
  if (!hz.hasAuthToken()) {
    promise = hz.authEndpoint(provider).subscribe((endpoint) => {
      // TODO: Add certificates and replace with https
      window.location = 'https://localhost:8181' + endpoint
    })
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
    })
  }
  return new Promise((resolve) => resolve(false))
}

export function unAuth() {
  Horizon.clearAuthTokens()
}
