import React, {PropTypes} from 'react'
import Login from '../../containers/User/LoginContainer'
import Dialog from 'material-ui/Dialog'

const LoginDialog = ({toggleLogin, showLogin, message, refetch}) => <Dialog
  modal={false}
  contentStyle={styles.dialog}
  open={showLogin || false}
  onRequestClose={() => toggleLogin()}>
  <Login
    refetch={refetch}
    message={message} />
</Dialog>

const {func, string} = PropTypes

LoginDialog.propTypes = {
  toggleLogin: func.isRequired,
  showLogin: func.isRequired,
  message: string,
  refetch: func.isRequired
}

export default LoginDialog

const styles = {
  dialog: {
    width: 250,
    bottom: window.innerWidth < 800 ? '15vh' : 0
  }
}
