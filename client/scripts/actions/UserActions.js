// import errorLog from '../utils/errorLog'
import hashPassword from '../utils/pwHash'

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
