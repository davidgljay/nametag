import React, {PropTypes} from 'react'
import Dialog from 'material-ui/Dialog'

const WelcomeDialog = ({postMessage, welcome, nametags}) =>
  <Dialog
    modal={false}
    contentStyle={styles.dialog}
    open={showWelcome}
    onRequestClose={() => toggleWelcome()}>
  </Dialog>

const {func, string, arrayOf, object, bool} = PropTypes

WelcomeDialog.propTypes = {
  postMessage: func.isRequired,
  welcome: string.isRequired,
  nametags: arrayOf(object).isRequired
}

export default WelcomeDialog

const styles = {
  dialog: {
    width: 250
  }
}
