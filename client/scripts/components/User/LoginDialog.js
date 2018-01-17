import React, {PropTypes} from 'react'
import Login from '../../containers/User/LoginContainer'
import Dialog from 'material-ui/Dialog'
import {grey} from '../../../styles/colors'

const LoginDialog = ({toggleLogin, showLogin, message, refetch}) => <Dialog
  modal={false}
  contentStyle={styles.dialog}
  bodyStyle={styles.body}
  open={showLogin || false}
  onRequestClose={() => toggleLogin()}>
  <Login
    onLogin={() => refetch().then(toggleLogin)}
    message={message} />
  <div style={styles.tos}>
    <a href='/privacy'>Privacy Policy</a> and <a href='/tos'>Terms of Service</a>
  </div>
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
  },
  tos: {
    color: grey,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20
  }
}
