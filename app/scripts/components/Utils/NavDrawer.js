import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

const onCreateRoomClick = () => {
  window.location = '/rooms/create'
}

const onCreateCertClick = () => {
  window.location = '/badges/create'
}

const onHomeClick = () => {
  window.location = '/rooms'
}

const NavDrawer = (props) => <Drawer
  docked={false}
  width={200}
  open={props.open}
  style={styles.drawer}
  onRequestChange={props.setOpen}>
  <div style={styles.drawerTitle}><h2>Nametag</h2></div>
  {
      props.user.id
      ? <div>
        <MenuItem onClick={onHomeClick}>Home</MenuItem>
        <MenuItem onClick={onCreateRoomClick}>Create Room</MenuItem>
        <MenuItem onClick={onCreateCertClick}>Create Badge</MenuItem>
        <MenuItem
          onClick={() => props.logout()}>Log Out</MenuItem>
      </div>
      : <MenuItem onClick={() => props.setting('showLogin', true)}>Log In</MenuItem>
      }
</Drawer>

export default NavDrawer

const styles = {
  drawerTitle: {
    marginLeft: 15
  }
}
