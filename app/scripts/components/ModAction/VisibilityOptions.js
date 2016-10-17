import React from 'react'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

const VisibilityOptions = (props) => <div style={styles.chooseVis}>
    <div style={styles.visText}>
      {
        props.isPublic ?
        <p>
          <IconButton onClick={props.setPublic(false)} style={styles.button}>
            <FontIcon
              className='material-icons'>
               visibility
            </FontIcon>
          </IconButton>
          Visible to everyone in the room.
        </p>
        :
        <p>
          <IconButton onClick={props.setPublic(true)} style={styles.button}>
            <FontIcon
              className='material-icons'>
               visibility_off
            </FontIcon>
          </IconButton>
          Visible only to the author of this message.
        </p>
      }
    </div>
  </div>

export default VisibilityOptions

const styles = {
  chooseVis: {
    marginTop: 10,
    marginBottom: 20,
  },
  visText: {
    fontStyle: 'italic',
  },
  button: {
    verticalAlign: 'middle',
  },
}
