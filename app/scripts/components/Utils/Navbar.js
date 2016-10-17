import React from 'react'
import {logout} from '../../actions/UserActions'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import { indigo500 } from 'material-ui/styles/colors'

const Navbar = (props) => {
  const auth = <div>
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

export default Navbar

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
