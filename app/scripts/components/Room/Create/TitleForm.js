import React from 'react'
import TextField from 'material-ui/TextField'

const TitleForm = (props) =>
  <div style={styles.titleForm}>
    <TextField
      style={styles.textfield}
      value={props.title}
      onChange={(e) => props.updateRoom('title', e.target.value)}
      floatingLabelText="Title"
      /><br/>
    <TextField
      style={styles.textfield}
      value={props.desc}
      multiLine={true}
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
}
