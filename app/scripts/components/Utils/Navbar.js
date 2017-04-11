import React, {Component, PropTypes} from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import NavDrawer from './NavDrawer'

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

class NavBar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }

  render () {
    const {toggleLogin = () => {}, me} = this.props
    const mobile = window.innerWidth <= 800
    const auth = <div style={styles.buttons}>
      {
        me && me.id
        ? <div>
          <FlatButton
            style={styles.button}
            onClick={onHomeClick} label='HOME' />
          <FlatButton
            style={styles.button}
            onClick={onCreateRoomClick} label='CREATE ROOM' />
          <FlatButton
            style={styles.button}
            onClick={onCreateCertClick} label='CREATE BADGE' />
          <FlatButton
            style={styles.button}
            onClick={onLogoutClick} label='LOG OUT' />
        </div>
          : <FlatButton
            style={styles.button}
            onClick={() => toggleLogin()}
            label='LOG IN' />
        }
    </div>
    return <div>
      <AppBar
        title='Nametag'
        style={styles.appBar}
        onTitleTouchTap={onHomeClick}
        imageElementRight={mobile ? null : auth}
        onLeftIconButtonTouchTap={() => this.setState({open: true})} />
      <NavDrawer
        open={this.state.open}
        toggleLogin={toggleLogin}
        me={me}
        setOpen={(open) => this.setState({open})} />
    </div>
  }
}

NavBar.propTypes = {
  me: PropTypes.shape({
    id: PropTypes.string
  }),
  toggleLogin: PropTypes.func
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
    [mobile]: {
      display: 'none'
    }
  },
  drawerTitle: {
    marginLeft: 15
  }
}
