import React, {Component, PropTypes} from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import {indigo500} from 'material-ui/styles/colors'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'

const onCreateRoomClick = () => {
  window.location = '/rooms/create'
}

const onCreateCertClick = () => {
  window.location = '/certificates/create'
}

const onHomeClick = () => {
  window.location = '/rooms'
}

class Navbar extends Component {
  state = {
    open: false,
  }

  render() {
    const auth = <div style={styles.buttons}>
        {
        this.props.user && this.props.user.id ?
        <div>
          <FlatButton
            style={styles.button}
            onClick={onHomeClick} label='HOME'/>
          <FlatButton
            style={styles.button}
            onClick={onCreateRoomClick} label='CREATE ROOM'/>
          <FlatButton
            style={styles.button}
            onClick={onCreateCertClick} label='CREATE CERTIFICATE'/>
          <FlatButton
            style={styles.button}
            onClick={() => this.props.logout()}
            label='LOG OUT'/>
        </div>
          : <FlatButton
            style={styles.button}
            onClick={() => this.props.setting('showLogin', true)}
            label='LOG IN'/>
        }
      </div>
    return  <div>
      <AppBar
        title="Nametag"
        style = {styles.appBar}
        onTitleTouchTap={onHomeClick}
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
              <MenuItem onClick={onCreateRoomClick}>Create Room</MenuItem>
              <MenuItem onClick={onCreateCertClick}>Create Certificate</MenuItem>
              <MenuItem
                onClick={() => this.props.logout()}>Log Out</MenuItem>
            </div>
            : <MenuItem onClick={() => this.props.setting('showLogin', true)}>Log In</MenuItem>
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
    cursor: 'pointer',
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
