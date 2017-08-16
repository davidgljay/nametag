import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {grey} from '../../../../styles/colors'
import _ from 'lodash'

const TitleForm = ({badges, selectedBadges, desc, title, welcome, updateRoom, setClosed, closedIn, error}) =>
  <div style={styles.titleForm}>
    <TextField
      style={styles.textfield}
      value={title}
      id='titleField'
      errorText={error && error.titleError}
      onChange={(e) => updateRoom('title', e.target.value.slice(0, 40))}
      floatingLabelText='Title' />
    <div style={styles.counter}>{40 - title.length}</div><br />
    <TextField
      style={styles.textfield}
      value={desc}
      id='descriptionField'
      multiLine
      errorText={error && error.descriptionError}
      inputStyle={styles.descriptionField}
      onChange={(e) => updateRoom('description', e.target.value)}
      floatingLabelText='Description' />
    <TextField
      style={styles.textfield}
      value={welcome}
      id='welcomeField'
      multiLine
      errorText={error && error.welcomeError}
      inputStyle={styles.welcomeField}
      onChange={(e) => updateRoom('welcome', e.target.value)}
      floatingLabelText='Welcome Prompt' />
    <div style={styles.helpText}>
      Users will be given this prompt when they enter the room.
    </div>
  </div>

const {string, object, func, shape, number} = PropTypes
TitleForm.propTypes = {
  title: string.isRequired,
  closedIn: shape({
    unit: string.isRequired,
    quantity: number.isRequired
  }).isRequired,
  updateRoom: func.isRequired,
  setClosed: func.isRequired,
  desc: string.isRequired,
  error: object
}

export default TitleForm

const styles = {
  textfield: {
    fontSize: 20,
    padding: 0,
    textAlign: 'left',
    margin: '20px 20px 10px 10px'
  },
  titleForm: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column'
  },
  descriptionField: {
    fontSize: 16
  },
  helpText: {
    color: grey,
    fontSize: 14,
    fontStyle: 'italic'
  },
  counter: {
    marginLeft: 240,
    fontSize: 12,
    color: '#008000'
  },
  quantitySelector: {
    width: 46,
    margin: 10
  },
  unitSelector: {
    width: 100,
    margin: 10
  }
}
