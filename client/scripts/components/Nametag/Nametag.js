import React, {PropTypes, Component} from 'react'
import Badges from '../Badge/Badges'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import {primary, white} from '../../../styles/colors'

class Nametag extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showMenu: false,
      element: null
    }

    this.toggleMenu = e => {
      e.preventDefault()
      this.setState({
        showMenu: !this.state.showMenu,
        element: e.currentTarget
      })
    }

    this.setMessage = message => e => {
      e.preventDefault()
      this.props.setDefaultMessage(message)
      this.toggleMenu(e)
    }
  }

  render () {
    const {mod, nametag: {id, name, image, bio, badges}, setDefaultMessage} = this.props
    const {showMenu, element} = this.state
    let ismod = ''

    // Show if user is a mod.
    if (mod === id) {
      ismod = <div style={styles.ismod}>Host</div>
    }

    return <div
      key={id}
      style={styles.nametag}
      onClick={this.toggleMenu}>
      <div style={styles.main}>
        {
          image
          ? <img src={image} alt={name} style={styles.image} />
        : <div style={{...styles.image, ...styles.defaultImage}}>{name.slice(0, 2)}</div>
        }
        <div style={styles.details}>
          <div style={styles.name}>{name}</div>
          <div style={styles.bio}>{bio}</div>
        </div>
        {ismod}
      </div>
      <Badges badges={badges} />
      {
        setDefaultMessage &&
        <Popover
          open={showMenu}
          anchorEl={element}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.toggleMenu}>
          <Menu>
            <MenuItem
              key='Mention'
              primaryText={`Message Publicly`}
              onClick={this.setMessage(`@${name} `)} />
            <MenuItem
              key='DM'
              primaryText={`Message Privately`}
              onClick={this.setMessage(`d ${name} `)} />
          </Menu>
        </Popover>
      }
    </div>
  }
}

const {string, shape, arrayOf, bool, object, func} = PropTypes

Nametag.PropTypes = {
  mod: string,
  nametag: shape({
    id: string.isRequired,
    name: string.isRequired,
    image: string.isRequired,
    bio: string,
    present: bool,
    badges: arrayOf(object).isRequired
  }).isRequired,
  setDefaultMessage: func
}

export default Nametag

const styles = {
  ismod: {
    fontSize: 12,
    fontStyle: 'italic',
    margin: 3,
    cursor: 'default'
  },
  details: {
    flex: 1,
    cursor: 'default'
  },
  bio: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5
  },
  image: {
    float: 'left',
    margin: '3px 10px 3px 10px',
    width: 50,
    height: 50,
    borderRadius: 25
  },
  defaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    lineHeight: '50px',
    fontSize: 22,
    color: white,
    cursor: 'default'
  },
  nametag: {
    padding: 5,
    minHeight: 55
  },
  main: {
    display: 'flex'
  },
  noteText: {
    fontSize: 14,
    margin: 5
  }
}
