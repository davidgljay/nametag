import React, {PropTypes} from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import {grey} from '../../../../styles/colors'

const defaultPrompts = [
  'What brings you to this conversation?',
  'Why are you interested in this topic?',
  'Briefly share your background.'
]

const WelcomeForm = ({welcome, updateRoom, error}) =>
  <div style={styles.titleForm}>
    <h1>Get People Talking</h1>
    <h2>Start by choosing a welcome prompt.</h2>
    <div style={styles.helpText}>Users will be asked this question when they enter the room.</div>
    <AutoComplete
      style={styles.textfield}
      textFieldStyle={styles.textFieldInput}
      searchText={welcome}
      menuStyle={styles.menu}
      listStyle={styles.menu}
      id='welcomeField'
      multiLine
      errorText={error && error.welcomeError}
      onUpdateInput={(e) => updateRoom('welcome', e.target.value)}
      openOnFocus
      filter={(text) => text.length === 0}
      dataSource={defaultPrompts}
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
    fontSize: 14
  },
  menu: {
    width: 350
  }
}
