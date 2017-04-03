import errorLog from '../utils/errorLog'
import {SHA1} from 'crypto-js'

export function registerUser (email, password) {

  const options = {
    method: 'POST',
    path: '/auth/local/register',
    body: JSON.stringify({
      email,
      password: hashPassword(password)
    })
  }
  return fetch(options)
    .then(res => {
      console.log(res)
      //Redirect to login
    })
    .catch(errorLog('registering user'))
}

export function loginUser (email, password) {
  const options = {
    method: 'POST',
    path: '/auth/local/register',
    body: JSON.stringify({
      email,
      password: hashPassword(password)
    })
  }
}

const hashPassword = (password) => {
  let hashedPassword = password
  for (let i=0; i < 1000; i++ ) {
    hashedPassword = SHA1(hashedPassword)
  }
  return hashedPassword
}
