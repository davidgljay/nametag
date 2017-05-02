import React, {Component, PropTypes} from 'react'
import NavBar from '../Utils/NavBar'
import LoginDialog from './LoginDialog'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import hashPassword from '../utils/pwHash'

class PasswordReset extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showLogin: false
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
        this.setState({passwordAlert: 'Your password must be at least 8 characters'})
        return false
      }
      return true
    }

    this.passwordReset = () => {
      const {password, confirm} = this.state
      if (this.validatePassword(password, confirm)) {
        this.props.resetPassword(this.props.params.token, hashPassword(password))
      }
    }

    this.updateField = field => e => {
      this.setState({[field]: e.value.text})
    }
  }

  resolve () {
    const {data: {me}, registerUser, loginUser} = this.props
    const {passwordAlert} = this.state

    return <div id='passwordReset'>
      <NavBar
        me={me}
        toggleLogin={this.toggleLogin} />
      <div>
        <TextField
          floatingLabelText='Password'
          id='resetPassword'
          type='password'
          errorText={passwordAlert}
          onBlur={this.validatePassword}
          style={styles.field}
          onChange={this.updateField('password')} />
        <TextField
          floatingLabelText='Confirm Password'
          style={styles.field}
          id='resetConfirm'
          errorText={passwordAlert}
          type='password'
          onChange={this.updateField('confirm')} />
      </div>
      <div>
        <RaisedButton
          style={styles.button}
          id='resetPwButton'
          label='RESET PASSWORD'
          primary
          onClick={this.passwordReset} />
      </div>
      <LoginDialog
        showLogin={this.state.showLogin}
        toggleLogin={this.toggleLogin}
        registerUser={registerUser}
        loginUser={loginUser}
        message='Log In or Register' />
    </div>
  }
}

export default PasswordReset

const styles = {
  field: {
    width: 200
  },
  button: {
    margin: 4
  }
}
