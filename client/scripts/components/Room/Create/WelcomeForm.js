import React, {PropTypes} from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import {grey} from '../../../../styles/colors'
import t from '../../../utils/i18n'

const defaultPrompts = t('create_room.welcome_options')

const WelcomeForm = ({welcome, nametagLimit, updateRoom, error}) =>
  <div style={styles.welcomeForm}>
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
    <h2>{t('create_room.room_size')}</h2>
    <div style={styles.helpText}>{t('create_room.room_size_helptext')}</div>
    <input
      type='number'
      step='1'
      id='roomSize'
      min='2'
      value={nametagLimit}
      onChange={val => updateRoom('nametagLimit', val)}
      style={styles.roomSizeInput} />
  </div>

const {string, object, number, func} = PropTypes
WelcomeForm.propTypes = {
  welcome: string.isRequired,
  nametagLimit: number.isRequired,
  updateRoom: func.isRequired,
  error: object
}

export default WelcomeForm

const styles = {
  textfield: {
    fontSize: 20,
    padding: 0,
    textAlign: 'left',
    width: 374
  },
  textFieldInput: {
    width: '100%'
  },
  helpText: {
    color: grey,
    fontSize: 14,
    maxWidth: 450
  },
  menu: {
    width: 350
  },
  roomSizeInput: {
    border: 'none',
    fontSize: '16px',
    borderBottom: `1px solid ${grey}`,
    width: 30,
    marginTop: 36,
    textAlign: 'center'
  },
  welcomeForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}
