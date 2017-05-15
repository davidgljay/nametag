import React, {Component, PropTypes} from 'react'
import NavBar from '../Utils/NavBar'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import hashPassword from '../../utils/pwHash'
import CircularProgress from 'material-ui/CircularProgress'
import {red} from '../../../styles/colors'

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
        this.setState({passwordAlert: 'Passwords do not match'})
        return false
      }

      if (password.length < 8) {
        this.setState({passwordAlert: 'Password must be at least 8 characters'})
        return false
      }
      this.setState({passwordAlert: ''})
      return true
    }

    this.passwordReset = () => {
      const {password, confirm} = this.state
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
      <NavBar
        empty />
      {
        complete
        ? <div style={styles.resetPasswordContainer}>
          <h3>Done! Your password has been updated.</h3>
          <div>Redirecting you to the homepage...</div>
          <CircularProgress />
        </div>
        : <div style={styles.resetPasswordContainer}>
          <h3>Great! You can reset your password below.</h3>
          {
            errors && <div style={styles.errorsContainer}>
              {
                errors.map(err => <h4 key={err.message}>{err.message}</h4>)
              }
            </div>
          }
          <TextField
            floatingLabelText='Password'
            id='resetPassword'
            type='password'
            errorText={passwordAlert}
            style={styles.field}
            onChange={this.updateField('password')} />
          <TextField
            floatingLabelText='Confirm Password'
            style={styles.field}
            id='resetConfirm'
            errorText={passwordAlert}
            onBlur={() => this.validatePassword(password, confirm)}
            type='password'
            onChange={this.updateField('confirm')} />
          <RaisedButton
            style={styles.button}
            id='resetPwButton'
            label='RESET PASSWORD'
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
