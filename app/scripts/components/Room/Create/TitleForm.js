import React from 'react'
import TextField from 'material-ui/TextField'

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
    width: '100%',
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
