// import errorLog from '../utils/errorLog'
import {enc, SHA3} from 'crypto-js'

export function registerUser (email, password) {
  return () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
        password: hashPassword(password)
      })
    }
    return fetch('/register', options)
      .then(res => res.json())
  }
}

export function loginUser (email, password) {
  return () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
        password: hashPassword(password)
      })
    }
    return fetch('/login', options)
      .then(res => {
        return res.json()
      })
  }
}

const hashPassword = (password) => {
  let hashedPassword = SHA3(password, {outputLength: 224})
  return hashedPassword.toString(enc.Base64)
}
