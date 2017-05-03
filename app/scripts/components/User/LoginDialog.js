import React from 'react'
import Login from './Login'
import Dialog from 'material-ui/Dialog'

const LoginDialog = ({toggleLogin, showLogin, message, loginUser, registerUser, passwordResetRequest}) => <Dialog
  modal={false}
  contentStyle={styles.dialog}
  open={showLogin || false}
  onRequestClose={() => toggleLogin()}>
  <Login
    message={message}
    registerUser={registerUser}
    loginUser={loginUser}
    passwordResetRequest={passwordResetRequest}
    />
</Dialog>

export default LoginDialog

const styles = {
  dialog: {
    width: 250
  }
}
