import React, {Component, PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {grey} from '../../../styles/colors'
import key from 'keymaster'

/* Function to Log in users via an auth provider or e-mail.

Currently supports login via:
Twitter
Google
FB
E-mail
*/

const validEmail = (email) => {
  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i // eslint-disable-line
  return re.test(email)
}

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      confirm: '',
      alert: '',
      loading: false,
      state: 'LOGIN'
    }

    this.updateField = fieldName => e => {
      const {password, confirm, register} = this.state
      e.preventDefault()
      this.setState({[fieldName]: e.target.value})
      if (fieldName === 'email' && validEmail(e.target.value)) {
        this.setState({emailAlert: ''})
      }
      if (!register) {
        this.setState({passwordAlert: ''})
      }
      if (fieldName === 'password' && e.target.value.length >= 8 && e.target.value === confirm) {
        this.setState({passwordAlert: ''})
      }
      if (fieldName === 'confirm' && e.target.value.length >= 8 && e.target.value === password) {
        this.setState({passwordAlert: ''})
      }
    }

    this.validateEmail = () => {
      if (!validEmail(this.state.email)) {
        this.setState({emailAlert: 'Please enter a valid e-mail address'})
      }
    }

    this.validatePassword = () => {
      if (this.state.password.length < 8 && this.state.register) {
        this.setState({passwordAlert: 'Your password must be at least 8 characters'})
      }
    }

    this.register = () => {
      const {email, password, confirm} = this.state
      if (password !== confirm) {
        this.setState({passwordAlert: 'Passwords do not match'})
        return
      }

      if (password.length < 8) {
        this.setState({passwordAlert: 'Your password must be at least 8 characters'})
      }

      if (!validEmail(email)) {
        this.setState({emailAlert: 'Please enter a valid e-mail address'})
        return
      }
      this.props.registerUser(email.trim().toLowerCase(), password)
        .then(res => {
          if (res.error) {
            this.setState({alert: res.error.message})
          }
          if (res.id) {
            this.setState({
              message: 'Log In',
              alert: 'Your account has been created',
              state: 'LOGIN'
            })
          }
        })
    }

    this.login = () => {
      const {email, password} = this.state
      this.props.loginUser(email.trim().toLowerCase(), password)
        .then(res => {
          if (res.error) {
            this.setState({alert: res.error.message})
            return
          }
          window.location.reload()
        })
    }

    this.providerAuth = provider => e => {
      e.preventDefault()
      window.sessionStorage.setItem('postAuth', window.location)
      this.setState({loading: true})
      window.location = `/auth/${provider}`
    }

    this.enablePasswordReset = e => {
      e.preventDefault()
      this.setState({state: 'PW_REQ'})
    }

    this.passwordReset = e => {
      this.setState({loading: true})
      this.props.passwordResetRequest(this.state.email)
        .then(res => {
          if (res.error) {
            this.setState({alert: res.error})
            return
          }
          this.setState({
            loading: false,
            message: 'Please check your E-mail',
            alert: 'You should receive a password reset link shortly.',
            state: 'LOGIN'
          })
        })
    }

    this.onEnter = (e) => {
      e.preventDefault()
      switch (this.state.state) {
        case 'LOGIN':
          return this.login()
        case 'REGISTER':
          return this.register()
        case 'PW_REQ':
          return this.passwordReset()
      }
    }
  }

  componentWillMount () {
    this.setState({message: this.props.message})
    key('enter', this.onEnter)
  }

  componentWillUnmount () {
    key.unbind('enter')
  }

  render () {
    const {
      emailAlert,
      passwordAlert,
      alert,
      loading,
      message,
      state
    } = this.state

    return <div style={styles.login} id='loginForm'>
      <h4>{message || 'Log in to join'}</h4>
      <div style={styles.alert}>
        {alert}
      </div>
      <form className='localAuth' onSubmit={this.onEnter}>
        <TextField
          floatingLabelText='E-mail'
          id='loginEmail'
          style={styles.field}
          errorText={emailAlert}
          onBlur={this.validateEmail}
          onChange={this.updateField('email')} />
        <br />
        {
          state !== 'PW_REQ' &&
          <div>
            <TextField
              floatingLabelText='Password'
              id='loginPassword'
              type='password'
              errorText={passwordAlert}
              onBlur={this.validatePassword}
              style={styles.field}
              onChange={this.updateField('password')} />
            {
              state === 'LOGIN' &&
              <div style={styles.forgotPasswordLink} onClick={this.enablePasswordReset}>
                Forgot Password?
              </div>
            }
          </div>
        }
        {
          state === 'REGISTER' &&
          <div>
            <TextField
              floatingLabelText='Confirm Password'
              style={styles.field}
              id='loginConfirm'
              errorText={passwordAlert}
              type='password'
              onChange={this.updateField('confirm')} />
          </div>

        }
        {
          state === 'REGISTER' && <div style={styles.buttonContainer}>
            <FlatButton
              label='BACK'
              style={styles.button}
              secondary
              onClick={() => this.setState({state: 'LOGIN', message: this.props.message})} />
            <RaisedButton
              style={styles.button}
              id='registerButton'
              label='REGISTER'
              primary
              onClick={this.register} />
          </div>
        }
        {
          state === 'LOGIN' && <div style={styles.buttonContainer}>
            <FlatButton
              label='Register'
              id='enableRegisterButton'
              style={styles.button}
              secondary
              onClick={() => this.setState({state: 'REGISTER', message: 'Register'})} />
            <RaisedButton
              style={styles.button}
              label='LOG IN'
              id='submitLoginButton'
              primary
              onClick={this.login} />
          </div>
        }
        {
          state === 'PW_REQ' && <div style={styles.buttonContainer}>
            <FlatButton
              label='BACK'
              style={styles.button}
              secondary
              onClick={() => this.setState({state: 'LOGIN', message: this.props.message})} />
            <RaisedButton
              style={styles.button}
              id='resetPwButton'
              label='SEND LINK'
              primary
              onClick={this.passwordReset} />
          </div>
        }
        <input type='submit' style={styles.submit} />
      </form>
      <div style={styles.authProviders}>
        {
          loading
          ? <CircularProgress />
        : <div>
          <img
            style={styles.loginImg}
            src='/public/images/twitter.jpg'
            onClick={this.providerAuth('twitter')} />
          <img
            style={styles.loginImg}
            src='/public/images/fb.jpg'
            onClick={this.providerAuth('facebook')} />
          <img
            style={styles.loginImg}
            src='/public/images/google.png'
            onClick={this.providerAuth('google')} />
        </div>
        }
      </div>
    </div>
  }
}

Login.propTypes = {
  registerUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  passwordResetRequest: PropTypes.func.isRequired
}

export default Login

const styles = {
  login: {
    textAlign: 'center'
  },
  loginImg: {
    cursor: 'pointer'
  },
  field: {
    width: 200
  },
  buttonContainer: {
    marginTop: 10
  },
  button: {
    margin: 4,
    minWidth: 75
  },
  authProviders: {
    marginTop: 20
  },
  alert: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 14
  },
  forgotPasswordLink: {
    color: grey,
    fontStyle: 'italic',
    fontSize: 12,
    margin: 10,
    cursor: 'pointer'
  }
}
