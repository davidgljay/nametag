import React, {PropTypes} from 'react'
import Login from '../../containers/User/LoginContainer'
import Dialog from 'material-ui/Dialog'

const LoginDialog = ({toggleLogin, showLogin, message, refetch}) => <Dialog
  modal={false}
  contentStyle={styles.dialog}
  bodyStyle={styles.body}
  open={showLogin || false}
  onRequestClose={() => toggleLogin()}>
  <Login
    onLogin={() => refetch.then(toggleLogin)}
    message={message} />
</Dialog>

const {func, string, bool} = PropTypes

LoginDialog.propTypes = {
  toggleLogin: func.isRequired,
  showLogin: bool,
  message: string,
  refetch: func.isRequired
}

export default LoginDialog

const styles = {
  dialog: {
    width: 250,
    bottom: window.innerWidth < 800 ? '15vh' : 0
  },
  body: {
    overflowY: 'auto'
  }
}
