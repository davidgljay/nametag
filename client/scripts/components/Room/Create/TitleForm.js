import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {grey500} from 'material-ui/styles/colors'
import _ from 'lodash'

const TitleForm = ({badges, selectedBadges, desc, title, updateRoom, setClosed, closedIn, error}) =>
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
    <div
      style={styles.textfield}>
      <div style={styles.closedAtHeader}>Keep conversation active for</div>
      <SelectField
        value={closedIn.quantity}
        autoWidth
        style={styles.quantitySelector}
        maxHeight={200}
        onChange={(e, i, v) => setClosed('quantity', v)}>
        {
              _.range(12).map((n) =>
                <MenuItem value={n + 1} primaryText={n + 1} key={n + 1} />
              )
            }
      </SelectField>
      <SelectField
        value={closedIn.unit}
        autoWidth
        style={styles.unitSelector}
        onChange={(e, i, v) => setClosed('unit', v)}>
        {
              ['Hours', 'Days'].map((n) =>
                <MenuItem value={n} primaryText={n} key={n} />
                )
            }
      </SelectField>
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
    margin: '20px 20px 0px 20px'
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
  },
  closedAtHeader: {
    color: grey500,
    fontSize: 14
  }
}
