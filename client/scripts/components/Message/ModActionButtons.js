import React from 'react'
import { CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {red} from '../../../styles/colors'

const ModActionButtons = (props) => <CardActions>
  <RaisedButton
    fullWidth
    primary
    labelStyle={styles.primary}
    onClick={props.remindOfNorms}
    label='SEND MESSAGE' />
  {
      props.isMod &&
      <div>
        <FlatButton
          style={styles.severe}
          onClick={props.removeMessage}
          label='REMOVE MESSAGE' />
        <FlatButton
          style={styles.severe}
          onClick={props.removeUser}
          label='EXPEL AUTHOR' />
        <FlatButton
          style={styles.severe}
          onClick={props.notifyBadge}
          label='REPORT AUTHOR' />
      </div>
    }
</CardActions>

export default ModActionButtons

const styles = {
  primary: {
    color: '#FFF',
    padding: '0px 10px'
  },
  severe: {
    color: red,
    marginTop: 10
  }
}
