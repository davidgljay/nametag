import React, {Component, PropTypes} from 'react'
import Navbar from '../Utils/Navbar'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import hashPassword from '../../utils/pwHash'
import CircularProgress from 'material-ui/CircularProgress'
import {red} from '../../../styles/colors'
import {track} from '../../utils/analytics'
import t from '../../utils/i18n'

class PasswordReset extends Component {
  constructor (props) {
    super(props)

    this.state = {
      password: '',
      confirm: '',
      passwordAlert: '',
      complete: false
    }

    this.toggleLogin = () => {
      this.setState({showLogin: !this.state.showLogin})
    }

    this.validatePassword = (password, confirm) => {
      if (password !== confirm) {
        this.setState({passwordAlert: t('user.pw_match')})
        return false
      }

      if (password.length < 8) {
        this.setState({passwordAlert: t('user.pw_short')})
        return false
      }
      this.setState({passwordAlert: ''})
      return true
    }

    this.passwordReset = () => {
      const {password, confirm} = this.state
      track('PASSWORD_RESET')
      if (this.validatePassword(password, confirm)) {
        this.props.passwordReset(this.props.params.token, hashPassword(password))
          .then(res => {
            if (res.data.passwordReset && res.data.passwordReset.errors) {
              this.setState({errors: res.data.passwordReset.errors})
            } else {
              this.setState({complete: true})
            }
          })
      }
    }

    this.updateField = field => (e, text) => {
      e.preventDefault()
      this.setState({[field]: text})
    }
  }

  componentWillUpdate (newProps, newState) {
    const {password, confirm, passwordAlert, complete} = newState
    if (passwordAlert && (password !== this.state.password || confirm !== this.state.confirm)) {
      this.validatePassword(password, confirm)
    }
    if (complete && !this.state.complete) {
      setTimeout(() => {
        window.location = '/'
      }, 1000)
    }
  }

  render () {
    const {passwordAlert, password, confirm, complete, errors} = this.state

    return <div id='passwordReset'>
      <Navbar
        empty />
      {
        complete
        ? <div style={styles.resetPasswordContainer}>
          <h3>{t('user.pw_updated')}</h3>
          <div>{t('user.redirecting')}</div>
          <CircularProgress />
        </div>
        : <div style={styles.resetPasswordContainer}>
          <h3>{t('user.reset_pw')}</h3>
          {
            errors && <div style={styles.errorsContainer}>
              {
                errors.map(err => <h4 key={err.message}>{err.message}</h4>)
              }
            </div>
          }
          <TextField
            floatingLabelText={t('user.password')}
            id='resetPassword'
            type='password'
            errorText={passwordAlert}
            style={styles.field}
            onChange={this.updateField('password')} />
          <TextField
            floatingLabelText={t('user.confirm')}
            style={styles.field}
            id='resetConfirm'
            errorText={passwordAlert}
            onBlur={() => this.validatePassword(password, confirm)}
            type='password'
            onChange={this.updateField('confirm')} />
          <RaisedButton
            style={styles.button}
            id='resetPwButton'
            label={t('user.reset')}
            primary
            onClick={this.passwordReset} />
        </div>
      }
    </div>
  }
}

const {func} = PropTypes
PasswordReset.propTypes = {
  passwordReset: func.isRequired
}

export default PasswordReset

const styles = {
  field: {
    width: 200,
    margin: 10
  },
  button: {
    margin: 20
  },
  resetPasswordContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10
  },
  errorsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: red
  }
}
