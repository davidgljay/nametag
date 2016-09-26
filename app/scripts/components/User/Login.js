import React, { Component, PropTypes } from 'react'
import {providerAuth} from '../../actions/UserActions'

/* Function to Log in users via an auth provider or e-mail.

Currently supports login via:
Twitter
Google
FB

TODO: create e-mail lookup archive and handle account merges
*/

const styles = {
  login: {
    textAlign: 'center',
  },
  loginImg: {
    cursor: 'pointer',
  },
}

class Login extends Component {

  render() {
  // TODO: Add e-mail (This will probably involve adding state, oh well.)

    return <div style={styles.login}>
        <h4>Log in to join</h4>
        <img
          style={styles.loginImg}
          src="./images/twitter.jpg"
          className={style.loginOption + ' img-circle'}
          onClick={() => this.context.dispatch(providerAuth('twitter'))}/>
        <img
          style={styles.loginImg}
          src="./images/fb.jpg"
          className={style.loginOption + ' img-circle'}
          onClick={() => this.context.dispatch(providerAuth('facebook'))}/>
        <img
          style={styles.loginImg}
          src="./images/google.png"
          className={style.loginOption + ' img-circle'}
          onClick={() => this.context.dispatch(providerAuth('google'))}/>
      </div>
  }
}

Login.contextTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default Login
