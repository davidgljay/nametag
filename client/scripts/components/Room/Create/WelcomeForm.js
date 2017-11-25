import React, {PropTypes} from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import {grey} from '../../../../styles/colors'
import t from '../../utils/i18n'

const defaultPrompts = t('create_room.welcome_options')

const WelcomeForm = ({welcome, updateRoom, error}) =>
  <div style={styles.titleForm}>
    <h1>{t('create_room.talking')}</h1>
    <h2>{t('create_room.welcome_start')}</h2>
    <div style={styles.helpText}>{t('create_room.welcome_helptext')}</div>
    <AutoComplete
      style={styles.textfield}
      textFieldStyle={styles.textFieldInput}
      searchText={welcome}
      menuStyle={styles.menu}
      listStyle={styles.menu}
      id='welcomeField'
      multiLine
      errorText={error && error.welcomeError}
      onUpdateInput={(text) => updateRoom('welcome', text)}
      openOnFocus
      filter={(text) => text.length === 0}
      dataSource={defaultPrompts}
      floatingLabelText={t('create_room.welcome_prompt')} />
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
