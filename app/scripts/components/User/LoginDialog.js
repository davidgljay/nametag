import React from 'react'
import Login from '../../containers/User/LoginContainer'
import Dialog from 'material-ui/Dialog'

const LoginDialog = ({toggleLogin, showLogin, message}) => <Dialog
  modal={false}
  contentStyle={styles.dialog}
  open={showLogin || false}
  onRequestClose={() => toggleLogin()}>
  <Login
    message={message} />
</Dialog>

export default LoginDialog

const styles = {
  dialog: {
    width: 250
  }
}
