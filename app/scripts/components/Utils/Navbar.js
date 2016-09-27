import React from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import { indigo500 } from 'material-ui/styles/colors'

const styles = {
  appBar: {
    fontWeight: 'bold',
    background: indigo500,
  },
  button: {
    color: '#fff',
    marginTop: 6,
  },
}

const Navbar = (props) => {
  const auth = <div>
      <FlatButton style={styles.button}>CREATE ROOM</FlatButton>
      {
      props.user && props.user.id ?
        <FlatButton style={styles.button} onClick={() => props.logout()}>LOG OUT</FlatButton>
        : <FlatButton style={styles.button}>LOG IN</FlatButton>
      }
    </div>
  return  <AppBar
    title="Nametag"
    style = {styles.appBar}
    iconElementRight={auth}/>
}

export default Navbar
