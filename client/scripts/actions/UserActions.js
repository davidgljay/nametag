// import errorLog from '../utils/errorLog'
export function registerUser (email) {
  return () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
        path: window.location.href
      })
    }
    return fetch('/register', options)
      .then(res => res.json())
  }
}

// export function loginUser (email, password) {
//   return () => {
//     const options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'same-origin',
//       body: JSON.stringify({
//         email,
//         password: hashPassword(password)
//       })
//     }
//     return fetch('/login', options)
//       .then(res => {
//         return res.json()
//       })
//   }
// }
