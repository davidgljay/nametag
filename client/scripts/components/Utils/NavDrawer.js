import React, {PropTypes} from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import {track} from '../../../analytics'

const NavDrawer = ({me, empty, toggleLogin, open, setOpen}) => {
  let items = null
  if (me && !empty) {
    items = <div>
      <MenuItem href='/rooms/create'>Create Room</MenuItem>
      {
        me.granters.map(granter =>
          <MenuItem
            key={granter.id}
            primaryText={granter.name}
            href={`/granters/${granter.urlCode}`} />
        )
      }
      <MenuItem
        onClick={() => track('LOGOUT_USER')}
        href='/logout'>Log Out</MenuItem>
    </div>
  } else if (!empty) {
    items = <MenuItem onClick={() => toggleLogin()}>Log In</MenuItem>
  }
  return <Drawer
    width={200}
    open={open}
    docked={false}
    style={styles.drawer}
    onRequestChange={setOpen}>
    <div style={styles.drawerTitle}><h2>Nametag</h2></div>
    <MenuItem href='/'>Home</MenuItem>
    {items}
  </Drawer>
}

const {func, shape, bool, string} = PropTypes

NavDrawer.propTypes = {
  me: shape({
    granter: shape({
      id: string.isRequired,
      name: string.isRequired
    })
  }),
  empty: bool,
  toggleLogin: func.isRequired,
  open: bool.isRequired,
  setOpen: func.isRequired
}

export default NavDrawer

const styles = {
  drawerTitle: {
    marginLeft: 15
  }
}
