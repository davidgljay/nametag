import React from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import {indigo500} from 'material-ui/styles/colors'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'

const onCreateRoomClick = () => {
  window.location = '/#/rooms/create'
}

const Navbar = (props) => {
  const auth = <div style={styles.buttons}>
      <FlatButton
        style={styles.button}
        onClick={onCreateRoomClick} label='CREATE ROOM'/>
      {
      props.user && props.user.id ?
        <FlatButton
          style={styles.button}
          onClick={() => props.dispatch(logout())}
          label='LOG OUT'/>
        : <FlatButton style={styles.button} label='LOG IN'/>
      }
    </div>
  return  <AppBar
    title="Nametag"
    style = {styles.appBar}
    iconElementRight={auth}/>
}

export default radium(Navbar)

const styles = {
  appBar: {
    fontWeight: 'bold',
    background: indigo500,
  },
  button: {
    color: '#fff',
    marginTop: 6,

  },
  buttons: {
    [mobile]: {
      display: 'none',
    },
  },
}
