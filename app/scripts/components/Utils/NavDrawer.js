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

const onLogoutClick = () => {
  window.location = '/logout'
}

const NavDrawer = ({me, empty, toggleLogin, open, setOpen}) => {
  let items = null
  if (me) {
    items = <div>
      <MenuItem onClick={onHomeClick}>Home</MenuItem>
      <MenuItem onClick={onCreateRoomClick}>Create Room</MenuItem>
      <MenuItem
        onClick={onLogoutClick}>Log Out</MenuItem>
    </div>
  } else if (!empty) {
    items = <MenuItem onClick={() => toggleLogin()}>Log In</MenuItem>
  }
  return <Drawer
    width={200}
    open={open}
    style={styles.drawer}
    onRequestChange={setOpen}>
    <div style={styles.drawerTitle}><h2>Nametag</h2></div>
    <MenuItem onClick={onHomeClick}>Home</MenuItem>
    {items}
  </Drawer>
}

export default NavDrawer

const styles = {
  drawerTitle: {
    marginLeft: 15
  }
}
