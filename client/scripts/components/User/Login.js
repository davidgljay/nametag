import React, {Component, PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {grey} from '../../../styles/colors'
import {track, alias, setTimer} from '../../utils/analytics'
import t from '../../utils/i18n'
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
      alert: '',
      loading: false,
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
      const {email} = this.state

      if (!validEmail(email)) {
        this.setState({emailAlert: t('login.enter_email')})
        return
      }
      track('LOGIN_REGISTER_USER')
      this.props.registerUser(email.trim().toLowerCase())
        .then(res => {
          if (res.error) {
            this.setState({alert: res.error.message})
          }
          if (res.newUser) {
            alias(res.id)
            this.login()
          } else {
            this.setState({alert: t('login.link_login'), message: t('login.hello')})
          }
        })
    }

    this.providerAuth = provider => e => {
      e.preventDefault()
      track('PROVIDER_AUTH', {provider})
      window.sessionStorage.setItem('postAuth', window.location)
      this.setState({loading: true})
      window.location = `/auth/${provider}`
    }
  }

  componentWillMount () {
    const {message} = this.props
    this.setState({message})
    setTimer('LOGIN_REGISTER_USER')
    key('enter', this.onEnter)
  }

  componentWillUnmount () {
    key.unbind('enter')
  }

  render () {
    const {
      emailAlert,
      alert,
      message
    } = this.state

    return <div style={styles.login} id='loginForm'>
      <form className='localAuth' onSubmit={this.onEnter}>
        <TextField
          floatingLabelText={t('login.email')}
          id='loginEmail'
          style={styles.field}
          errorText={emailAlert}
          onBlur={this.validateEmail}
          onClick={() => this.setState({emailClicked: true})}
          onChange={this.updateField('email')} />
        <div style={styles.alert}>{t('login.privacy_email')}</div>
        <input type='submit' style={styles.hiddenSubmit} />
      </form>
      <div style={styles.authProviders}>
        <h4>{message}</h4>
        <div style={styles.alert}>
          {alert}
        </div>
        <div>
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
          <div style={styles.alert}>{t('login.privacy_provider')}</div>
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <RaisedButton
          style={styles.button}
          id='registerButton'
          label={t('login.login')}
          primary
          onClick={this.register} />
      </div>
    </div>
  }
}

const {func, string} = PropTypes

Login.propTypes = {
  registerUser: func.isRequired,
  message: string
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
    fontSize: 14,
    fontWeight: 300
  },
  hiddenSubmit: {
    display: 'none'
  }
}
