import React, {PropTypes, Component} from 'react'
import Badges from '../Badge/Badges'
import MentionMenu from '../Message/MentionMenu'
import CommandMenu from '../Message/CommandMenu'
import NametagIcon from './NametagIcon'
import EmojiText from '../Message/EmojiText'

class Nametag extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showMenu: ''
    }

    this.toggleMenu = e => {
      const {nametag: {id}, myNametagId} = this.props
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      const target = id === myNametagId ? 'commands' : 'mentions'
      this.setState({
        showMenu: this.state.showMenu ? '' : target
      })
    }
  }

  render () {
    const {mod, nametag: {id, name, image, bio, badges}, setDefaultMessage, hideDMs, myNametagId} = this.props
    const {showMenu} = this.state
    let ismod = ''

    // Show if user is a mod.
    if (mod === id) {
      ismod = <div style={styles.ismod}>Host</div>
    }

    return <div
      key={id}
      id={id}
      style={styles.nametag}>
      <div style={styles.main}>
        <div style={styles.iconContainer} onClick={this.toggleMenu}>
          <NametagIcon name={name} image={image} diameter={50} />
        </div>
        <div style={styles.details}>
          <div style={styles.name} onClick={this.toggleMenu}>{name}</div>
          <div style={styles.bio}>
            <EmojiText text={bio} />
          </div>
        </div>
        {ismod}
      </div>
      <Badges badges={badges} />
      {
        setDefaultMessage &&
        <div>
          <MentionMenu
            name={name}
            hideDMs={hideDMs && mod !== id}
            open={showMenu === 'mentions'}
            anchor={document.getElementById(id)}
            toggleMenu={this.toggleMenu}
            setDefaultMessage={setDefaultMessage} />
          <CommandMenu
            open={showMenu === 'commands'}
            isMod={mod === myNametagId}
            anchor={document.getElementById(id)}
            onRequestClose={this.toggleMenu}
            setDefaultMessage={setDefaultMessage} />
        </div>
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
  iconContainer: {
    marginLeft: 8,
    marginRight: 8,
    cursor: 'pointer'
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
