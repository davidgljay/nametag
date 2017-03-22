import React from 'react'

/* Function to Log in users via an auth provider or e-mail.

Currently supports login via:
Twitter
Google
FB

TODO: create e-mail lookup archive and handle account merges
*/

const styles = {
  login: {
    textAlign: 'center'
  },
  loginImg: {
    cursor: 'pointer'
  }
}

const Login = (props) => {
  // TODO: Add e-mail (This will probably involve adding state, oh well.)

  return <div style={styles.login}>
    <h4>{props.message || 'Log in to join'}</h4>
    <img
      style={styles.loginImg}
      src='/public/images/twitter.jpg'
      onClick={() => {
        window.location = '/auth/twitter'
      }} />
    <img
      style={styles.loginImg}
      src='/public/images/fb.jpg'
      onClick={() => {
        window.location = '/auth/facebook'
      }} />
    <img
      style={styles.loginImg}
      src='/public/images/google.png'
      onClick={() => {
        window.location = '/auth/google'
      }} />
  </div>
}

export default Login
