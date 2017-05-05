import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

const NavDrawer = ({me, empty, toggleLogin, open, setOpen}) => {
  let items = null
  if (me) {
    items = <div>
      <MenuItem href='/rooms/create'>Create Room</MenuItem>
      {
        me.granters.map(granter =>
          <MenuItem
            key={granter.urlCode}
            primaryText={granter.name}
            href={`/granters/${granter.urlCode}`} />
        )
      }
      <MenuItem
        href='/logout'>Log Out</MenuItem>
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
    <MenuItem href='/'>Home</MenuItem>
    {items}
  </Drawer>
}

export default NavDrawer

const styles = {
  drawerTitle: {
    marginLeft: 15
  }
}
