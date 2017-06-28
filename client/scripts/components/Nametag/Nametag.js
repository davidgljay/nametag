import React, {PropTypes, Component} from 'react'
import Badges from '../Badge/Badges'
import MentionMenu from '../Message/MentionMenu'
import {primary, white} from '../../../styles/colors'

class Nametag extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showMenu: null
    }

    this.toggleMenu = e => {
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      this.setState({
        showMenu: this.state.showMenu ? null : e.currentTarget
      })
    }
  }

  render () {
    const {mod, nametag: {id, name, image, bio, badges}, setDefaultMessage, hideDMs} = this.props
    const {showMenu} = this.state
    let ismod = ''

    // Show if user is a mod.
    if (mod === id) {
      ismod = <div style={styles.ismod}>Host</div>
    }

    return <div
      key={id}
      style={styles.nametag}>
      <div style={styles.main}>
        {
          image
          ? <img src={image} alt={name} style={styles.image} onClick={this.toggleMenu} />
        : <div style={{...styles.image, ...styles.defaultImage}}onClick={this.toggleMenu}>
          {name.slice(0, 2)}
        </div>
        }
        <div style={styles.details}>
          <div style={styles.name} onClick={this.toggleMenu}>{name}</div>
          <div style={styles.bio}>{bio}</div>
        </div>
        {ismod}
      </div>
      <Badges badges={badges} />
      {
        setDefaultMessage &&
        <MentionMenu
          name={name}
          hideDMs={hideDMs && mod !== id}
          showMenu={showMenu}
          toggleMenu={this.toggleMenu}
          setDefaultMessage={setDefaultMessage} />
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
  setDefaultMessage: func,
  hideDMs: bool
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
    marginTop: 5,
    cursor: 'pointer'
  },
  image: {
    float: 'left',
    margin: '3px 10px 3px 10px',
    width: 50,
    height: 50,
    borderRadius: 25,
    cursor: 'pointer'
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
