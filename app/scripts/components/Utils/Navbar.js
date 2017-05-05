import React, {Component, PropTypes} from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import radium from 'radium'
import Popover from 'material-ui/PopOver'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import {mobile} from '../../../styles/sizes'
import NavDrawer from './NavDrawer'

const onCreateRoomClick = () => {
  window.location = '/rooms/create'
}

const onHomeClick = () => {
  window.location = '/rooms'
}

const onLogoutClick = () => {
  window.location = '/logout'
}

class NavBar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      open: false
    }

    this.showGranters = (e) => {
      this.setState({
        showGranters: !this.state.showGranters,
        element: e.currentTarget
      })
    }
  }

  render () {
    const {toggleLogin = () => {}, me, empty} = this.props
    const {showGranters, element} = this.state
    const mobile = window.innerWidth <= 800
    const auth = <div style={styles.buttons}>
      {
        me && me.id
        ? <div>
          <FlatButton
            style={styles.button}
            id='homeButton'
            onClick={onHomeClick} label='HOME' />
          {
            me.granters.length === 1 &&
            <FlatButton
              style={styles.button}
              id='granterButton'
              onClick={() => { window.location = `/granters/${me.granters[0].urlCode}` }}
              label={me.granters[0].name} />
          }
          {
            me.granters.length > 1 &&
              <FlatButton
                style={styles.button}
                id='granterButton'
                onClick={this.showGranters}
                label={'ORGANIZATIONS'} />
          }
          {
            me.granters.length > 1 &&
              <Popover
                open={showGranters}
                anchorEl={element}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}>
                <Menu>
                  {
                    me.granters.map(granter =>
                      <MenuItem
                        key={granter.urlCode}
                        primaryText={granter.name}
                        href={`/granters/${granter.urlCode}`} />
                    )
                  }
                </Menu>
              </Popover>
          }
          <FlatButton
            style={styles.button}
            id='createRoomButton'
            onClick={onCreateRoomClick} label='CREATE ROOM' />
          <FlatButton
            style={styles.button}
            id='logoutButton'
            onClick={onLogoutClick} label='LOG OUT' />
        </div>
          : <FlatButton
            style={styles.button}
            id='loginButton'
            onClick={() => toggleLogin()}
            label='LOG IN' />
        }
    </div>
    return <div>
      <AppBar
        title='Nametag'
        style={styles.appBar}
        onTitleTouchTap={onHomeClick}
        iconElementRight={mobile || empty ? null : auth}
        onLeftIconButtonTouchTap={() => this.setState({open: true})} />
      <NavDrawer
        open={this.state.open}
        toggleLogin={toggleLogin}
        me={me}
        empty={empty}
        setOpen={(open) => this.setState({open})} />
    </div>
  }
}

NavBar.propTypes = {
  me: PropTypes.shape({
    id: PropTypes.string
  }),
  toggleLogin: PropTypes.func,
  empty: PropTypes.bool
}

export default radium(NavBar)

const styles = {
  appBar: {
    fontWeight: 'bold',
    background: '#12726a',
    cursor: 'pointer'
  },
  button: {
    color: '#fff',
    marginTop: 6

  },
  buttons: {
    display: 'flex',
    [mobile]: {
      display: 'none'
    }
  },
  drawerTitle: {
    marginLeft: 15
  }
}
