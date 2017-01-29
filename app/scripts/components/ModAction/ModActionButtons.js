import React, {PropTypes} from 'react'
import { CardActions, Button } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {indigo500, red500} from 'material-ui/styles/colors'

const ModActionButtons = (props) => <CardActions>
    <RaisedButton
      fullWidth={true}
      backgroundColor={indigo500}
      labelStyle={styles.primary}
      onClick={props.remindOfNorms}
      label='SEND MESSAGE'/>
    {
      props.isMod &&
      <div>
        <FlatButton
          style={styles.severe}
          onClick={props.removeMessage}
          label='REMOVE MESSAGE'/>
        <FlatButton
          style={styles.severe}
          onClick={props.removeUser}
          label='BAN USER'/>
        <FlatButton
          style={styles.severe}
          onClick={props.notifyBadge}
          label='REPORT USER'/>
      </div>
    }
  </CardActions>

ModActionButtons.propTypes = {
  remindOfNorms: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  authorName: PropTypes.string.isRequired,
  notifyBadge: PropTypes.func.isRequired,
}

export default ModActionButtons

const styles = {
  primary: {
    color: '#FFF',
    padding: '0px 10px',
  },
  severe: {
    color: red500,
    marginTop: 10,
  },
}
