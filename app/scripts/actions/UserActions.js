import {hzAuth} from '../api/horizon'

/*
* Log in via a provider
*
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
