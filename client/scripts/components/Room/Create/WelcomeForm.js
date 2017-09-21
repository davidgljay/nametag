import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import {grey} from '../../../../styles/colors'

const WelcomeForm = ({welcome, updateRoom, error}) =>
  <div style={styles.titleForm}>
    <h3>Choose Welcome Prompt</h3>
    <div style={styles.helpText}>
      Users will be asked this question when they enter the room.
    </div>
    <TextField
      style={styles.textfield}
      inputStyle={styles.textFieldInput}
      value={welcome}
      id='welcomeField'
      multiLine
      errorText={error && error.welcomeError}
      onChange={(e) => updateRoom('welcome', e.target.value)}
      hintText='e.g. What brings you to this conversation?'
      floatingLabelText='Welcome Prompt' />
  </div>

const {string, object, func} = PropTypes
WelcomeForm.propTypes = {
  welcome: string.isRequired,
  updateRoom: func.isRequired,
  error: object
}

export default WelcomeForm

const styles = {
  textfield: {
    fontSize: 20,
    padding: 0,
    textAlign: 'left',
    width: 374,
    margin: '20px 20px 10px 10px'
  },
  textFieldInput: {
    width: '100%'
  },
  helpText: {
    color: grey,
    fontSize: 14,
    fontStyle: 'italic'
  }
}
