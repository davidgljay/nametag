import React from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import _ from 'lodash'

const TitleForm = (props) =>
  <div style={styles.titleForm}>
    <TextField
      style={styles.textfield}
      value={props.title}
      errorText={props.error && props.error.titleError}
      onChange={(e) => props.updateRoom('title', e.target.value.slice(0, 40))}
      floatingLabelText="Title" />
    <div style={styles.counter}>{40 - props.title.length}</div><br/>
    <TextField
      style={styles.textfield}
      value={props.desc}
      multiLine={true}
      errorText={props.error && props.error.descriptionError}
      inputStyle={styles.descriptionField}
      onChange={(e) => props.updateRoom('description', e.target.value)}
      floatingLabelText="Description"/>
    <div
      style={styles.textfield}>
      <SelectField
            value={props.closedIn.quantity}
            autoWidth={true}
            style={{width: 36, margin: 10}}
            maxHeight={200}
            onChange={(e, i, v) => props.setClosed('quantity', v)}>
            {
              _.range(12).map((n) =>
                <MenuItem value={n + 1} primaryText={n + 1} key={n + 1}/>
              )
            }
      </SelectField>
      <SelectField
            value={props.closedIn.unit}
            autoWidth={true}
            style={{width: 100, margin: 10}}
            onChange={(e, i, v) => props.setClosed('unit', v)}>
            {
              ['Hours', 'Days'].map((n) =>
                <MenuItem value={n} primaryText={n} key={n} />
                )
            }
      </SelectField>
    </div>
  </div>

export default TitleForm

const styles = {
  textfield: {
    fontSize: 20,
    padding: 0,
    textAlign: 'left',
    margin: '20px 20px 0px 20px',
  },
  titleForm: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  descriptionField: {
    fontSize: 16,
  },
  counter: {
    marginLeft: 240,
    fontSize: 12,
    color: '#008000',
  },
}
