import React, {Component, PropTypes} from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import radium from 'radium'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import {mobile} from '../../../styles/sizes'
import {track} from '../../utils/analytics'
import NavDrawer from './NavDrawer'
import t from '../../utils/i18n'

const onHomeClick = () => {
  window.location = '/rooms'
}

const onLogoutClick = () => {
  track('LOGOUT_USER')
  window.location = '/logout'
}

class Navbar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      open: false
    }

    this.closeGranters = () => {
      this.setState({showGranters: false})
    }

    this.showGranters = (e) => {
      e.preventDefault()
      this.setState({
        showGranters: !this.state.showGranters,
        element: e.currentTarget
      })
    }

    this.openMenu = (e) => {
      e.preventDefault()
      track('APPBAR_MENU_OPEN')
      this.setState({open: true})
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
            onClick={onHomeClick} label={t('nav.home')} />
          {
            me.granters && me.granters.length === 1 &&
            <FlatButton
              style={styles.button}
              id='granterButton'
              onClick={() => { window.location = `/granters/${me.granters[0].urlCode}` }}
              label={me.granters[0].name} />
          }
          {
            me.granters && me.granters.length > 1 &&
              <FlatButton
                style={styles.button}
                id='granterButton'
                onClick={this.showGranters}
                label={t('nav.orgs')} />
          }
          {
            me.granters && me.granters.length > 1 &&
              <Popover
                open={showGranters}
                anchorEl={element}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.closeGranters}>
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
            id='logoutButton'
            onClick={onLogoutClick} label={t('login.logout')} />
        </div>
          : <FlatButton
            style={styles.button}
            id='loginButton'
            onClick={() => toggleLogin()}
            label={t('login.login')} />
        }
    </div>
    return <div>
      <AppBar
        title={<div style={styles.titleContainer}>
          <img src='https://s3.amazonaws.com/nametag_images/logo-inverted30.png' />
          <div style={styles.title}>Nametag</div>
        </div>}
        style={styles.appBar}
        onTitleTouchTap={onHomeClick}
        iconElementRight={mobile || empty ? null : auth}
        onLeftIconButtonTouchTap={this.openMenu} />
      <NavDrawer
        open={this.state.open}
        toggleLogin={toggleLogin}
        me={me}
        empty={empty}
        setOpen={(open) => this.setState({open})} />
    </div>
  }
}

Navbar.propTypes = {
  me: PropTypes.shape({
    id: PropTypes.string
  }),
  toggleLogin: PropTypes.func,
  empty: PropTypes.bool
}

export default radium(Navbar)

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
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10
  },
  title: {
    lineHeight: '46px',
    marginLeft: 10,
    fontWeight: 300
  },
  tagline: {
    lineHeight: '5px',
    fontSize: 14
  }
}
