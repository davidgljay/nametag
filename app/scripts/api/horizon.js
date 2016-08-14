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
