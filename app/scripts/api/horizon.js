export const hz = Horizon({host: 'localhost:8181'})

export function auth(provider) {
  hz({authType: 'token'})
  if (!hz.hasAuthToken()) {
    hz.authEndpoint(provider).subscribe((endpoint) => {
      //TODO: Add certificates and replace with https
      window.location = 'https://localhost:8181' + endpoint
    })
  } else {
    console.log("Authed!")
    // We have a token already, do authenticated Horizon stuff here 
  }
}
