import React, {Component, PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import {track, alias, setTimer} from '../../utils/analytics'
import {grey} from '../../../styles/colors'
import t from '../../utils/i18n'
import validEmail from '../../utils/validEmail'
import key from 'keymaster'

/* Function to Log in users via an auth provider or e-mail.

Currently supports login via:
Twitter
Google
FB
E-mail
*/

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      alert: '',
      providerLoading: false,
      emailClicked: false
    }

    this.updateField = fieldName => e => {
      e.preventDefault()
      this.setState({[fieldName]: e.target.value})
      if (fieldName === 'email' && validEmail(e.target.value)) {
        this.setState({emailAlert: ''})
      }
    }

    this.validateEmail = () => {
      if (!validEmail(this.state.email)) {
        this.setState({emailAlert: t('login.enter_email')})
      }
    }

    this.register = () => {
      const {registerUser, onLogin} = this.props
      const {email} = this.state
      const self = this

      if (!validEmail(email)) {
        self.setState({emailAlert: t('login.enter_email')})
        return
      }
      track('LOGIN_REGISTER_USER')
      registerUser(email.trim().toLowerCase())
        .then(res => {
          if (res.error) {
            self.setState({alert: res.error.message})
          }
          if (res.newUser) {
            alias(res.id)
            onLogin()
          } else {
            self.setState({alert: t('login.link_login'), message: t('login.hello')})
          }
        })
    }

    this.providerAuth = provider => e => {
      e.preventDefault()
      track('PROVIDER_AUTH', {provider})
      window.sessionStorage.setItem('postAuth', window.location)
      this.setState({providerLoading: true})
      window.location = `/auth/${provider}`
    }
  }

  componentWillMount () {
    const {message, alert} = this.props
    this.setState({message, alert})
    setTimer('LOGIN_REGISTER_USER')
    key('enter', this.register)
  }

  componentWillUnmount () {
    key.unbind('enter')
  }

  render () {
    const {
      emailAlert,
      alert,
      message,
      providerLoading
    } = this.state

    const {buttonMsg} = this.props

    return <div style={styles.login} id='loginForm'>
      <h2>{message}</h2>
      <div style={styles.alert}>
        {alert}
      </div>
      <form className='localAuth' onSubmit={this.register}>
        <TextField
          floatingLabelText={t('login.email')}
          id='loginEmail'
          style={styles.field}
          errorText={emailAlert}
          onBlur={this.validateEmail}
          onClick={() => this.setState({emailClicked: true})}
          onChange={this.updateField('email')} />
        <div style={styles.privacy}>{t('login.privacy_email')}</div>
        <input type='submit' style={styles.hiddenSubmit} />
      </form>
      <div style={styles.authProviders}>
        {
            providerLoading
            ? <CircularProgress />
            : <div>
              <div>
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
              <div style={styles.privacy}>{t('login.privacy_provider')}</div>
            </div>
        }
      </div>
      <div style={styles.buttonContainer}>
        <RaisedButton
          style={styles.button}
          id='registerButton'
          label={buttonMsg || t('login.login')}
          primary
          onClick={this.register} />
      </div>
    </div>
  }
}

const {func, string} = PropTypes

Login.propTypes = {
  registerUser: func.isRequired,
  onLogin: func.isRequired,
  message: string,
  alert: string,
  buttonMsg: string
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
    marginTop: 20
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
    fontSize: 14,
    fontWeight: 300
  },
  privacy: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
    color: grey,
    marginTop: 15,
    fontWeight: 300
  },
  hiddenSubmit: {
    display: 'none'
  }
}
