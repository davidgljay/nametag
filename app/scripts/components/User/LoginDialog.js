import React from 'react'
import Login from './Login'
import Dialog from 'material-ui/Dialog'

const LoginDialog = ({showLogin, setting, providerAuth}) => <Dialog
  modal={false}
  contentStyle={styles.dialog}
  open={showLogin || false}
  onRequestClose={() => setting('showLogin', false)}>
  <Login providerAuth={providerAuth} />
</Dialog>

export default LoginDialog

const styles = {
  dialog: {
    width: 250
  }
}
