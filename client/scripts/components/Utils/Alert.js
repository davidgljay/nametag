import React from 'react'
import FontIcon from 'material-ui/FontIcon'
import {red500} from 'material-ui/styles/colors'

const Alert = (props) => props.alert
  ? <div style={styles.alert}>
    <FontIcon className='material-icons' style={styles.alert} color={red500}>
      warning
    </FontIcon>
    {props.alert}
  </div>
  : null

export default Alert

const styles = {
  alert: {
    fontSize: 12,
    color: red500,
    margin: 10
  }
}
