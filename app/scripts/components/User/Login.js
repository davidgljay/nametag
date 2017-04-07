import React, {Component, PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'

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
      register: false,
      alert: '',
      loading: false
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
      this.props.registerUser(email, password)
        .then(res => {
          if (res.error) {
            this.setState({alert: res.error.message})
          }
          if (res.id) {
            this.setState({alert: 'Your account has been created', register: false})
          }
        })
    }

    this.login = () => {
      const {email, password} = this.state
      this.props.loginUser(email, password)
        .then(res => {
          if (res.error) {
            this.setState({alert: res.error.message})
          }
          window.location = '/'
        })
    }

    this.providerAuth = provider => e => {
      e.preventDefault()
      this.setState({loading: true})
      window.location = `/auth/${provider}`
    }
  }

  render () {
    const {message} = this.props
    const {emailAlert, passwordAlert, alert, loading} = this.state
    return <div style={styles.login}>
      <h4>{message || 'Log in to join'}</h4>
      <div style={styles.alert}>
        {alert}
      </div>
      <div className='localAuth'>
        <TextField
          floatingLabelText='E-mail'
          style={styles.field}
          errorText={emailAlert}
          onBlur={this.validateEmail}
          onChange={this.updateField('email')} />
        <br />
        <TextField
          floatingLabelText='Password'
          type='password'
          errorText={passwordAlert}
          onBlur={this.validatePassword}
          style={styles.field}
          onChange={this.updateField('password')} />
        {
          this.state.register &&
          <TextField
            floatingLabelText='Confirm Password'
            style={styles.field}
            errorText={passwordAlert}
            type='password'
            onChange={this.updateField('confirm')} />
        }
        {
          this.state.register
          ? <div style={styles.buttonContainer}>
            <FlatButton
              label='Back'
              style={styles.button}
              secondary
              onClick={() => this.setState({register: false})} />
            <RaisedButton
              style={styles.button}
              label='REGISTER'
              primary
              onClick={this.register} />
          </div>
          : <div style={styles.buttonContainer}>
            <FlatButton
              label='Register'
              style={styles.button}
              secondary
              onClick={() => this.setState({register: true})} />
            <RaisedButton
              style={styles.button}
              label='LOG IN'
              primary
              onClick={this.login} />
          </div>
        }
      </div>
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
  loginUser: PropTypes.func.isRequired
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
    margin: 4
  },
  authProviders: {
    marginTop: 20
  },
  alert: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 14
  }
}
