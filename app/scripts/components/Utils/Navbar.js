import React, {Component, PropTypes} from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import {indigo500} from 'material-ui/styles/colors'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'

const onCreateRoomClick = () => {
  window.location = '/#/rooms/create'
}

class Navbar extends Component {
  state = {
    open: false
  }

  render() {
    const auth = <div style={styles.buttons}>
        <FlatButton
          style={styles.button}
          onTouchTap={onCreateRoomClick} label='CREATE ROOM'/>
        {
        this.props.user && this.props.user.id ?
          <FlatButton
            style={styles.button}
            onTouchTap={() => this.props.logout()}
            label='LOG OUT'/>
          : <FlatButton style={styles.button} label='LOG IN'/>
        }
      </div>
    return  <div>
      <AppBar
        title="Nametag"
        style = {styles.appBar}
        iconElementRight={auth}
        onLeftIconButtonTouchTap={() => this.setState({open: true})}/>
      <Drawer
        docked={false}
        width={200}
        open={this.state.open}
        style={styles.drawer}
        onRequestChange={(open) => this.setState({open})}>
        <div style={styles.drawerTitle}><h2>Nametag</h2></div> 
          {
          this.props.user.id ?
            <div>
              <MenuItem onTouchTap={onCreateRoomClick}>Create Room</MenuItem>
              <MenuItem
                onTouchTap={() => this.props.logout()}>Log Out</MenuItem>
            </div>
            : <MenuItem>Log In</MenuItem>
          }
      </Drawer>
    </div>
  }
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
  drawerTitle: {
    marginLeft: 15,
  },
}
