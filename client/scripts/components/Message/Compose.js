import React, { Component, PropTypes } from 'react'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {grey} from '../../../styles/colors'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Emojis from '../Utils/Emojis'
import key from 'keymaster'

class Compose extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      showEmoji: false,
      showMentionMenu: false,
      nametagList: [],
      // TODO: lastMessage in nametag
      posted: false
    }

    this.onChange = (e) => {
      if (e.target.value.slice(-1) === '@') {
        this.setState({showMentionMenu: true})
      } else if (e.target.value.slice(-1) === ' ') {
        this.setState({showMentionMenu: false})
      }
      this.setState({
        message: e.target.value,
        nametagList: this.nametagList()
      })
    }

    this.post = (e) => {
      const {myNametag, roomId, createMessage} = this.props
      const {message} = this.state
      e.preventDefault()
      if (message.length > 0) {
        let msg = {
          text: message,
          author: myNametag.id,
          room: roomId
        }
        this.setState({message: '', showEmoji: false, showMentionMenu: false, posted: true})
        this.slashCommand(msg)
        createMessage(msg, myNametag)
      }
    }

    this.slashCommand = (message) => {
      const {updateRoom, room: {id}} = this.props
      const command = /^\/(\S+)\s(.+)/.exec(message)
      if (!command) {
        return
      }
      switch (command[1]) {
        case 'welcome':
          updateRoom(id, 'welcome', command[2])
          break
        default:
          return
      }
    }

    this.toggleEmoji = (open) => () => {
      this.setState({showEmoji: open})
    }

    this.handleEmoji = (emoji) => {
      this.setState({message: this.state.message + ':' + emoji + ':'})
    }

    this.nametagList = () => {
      const query = /@\S*/.exec(this.state.message)
      return query ? this.props.nametags.filter(n => n.name.match(query[0].slice(1)))
        .map(n => n.name)
        : []
    }

    this.addMention = mention => e => {
      e.preventDefault()
      this.setState({
        message: this.state.message.replace(/@\S*(?=[^@]*$)/, mention),
        showMentionMenu: false
      })
    }
  }

  componentWillMount () {
    key('enter', 'compose', this.post)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.defaultMessage !== prevProps.defaultMessage) {
      this.setState({message: this.props.defaultMessage})
    }
    if (this.state.showMentionMenu) {
      document.getElementById('composeTextInput').focus()
    }
  }

  componentWillUnmount () {
    key.deleteScope('compose')
  }

  render () {
    // TODO: Add GIFs, image upload

    const {welcome, mod} = this.props
    const {showEmoji, message, showMentionMenu, posted} = this.state
    const topic = posted ? '' : welcome
    return <div style={styles.container}>
      {
        topic && <div style={styles.topicContainer}>
          {
          mod.image
          ? <img style={styles.modImg} src={mod.image} />
          : <div style={{...styles.modImg, ...styles.defaultImage}}>{mod.name.slice(0, 2)}</div>
          }
          <div id='topic' style={styles.topic}>{topic}</div>
        </div>
      }
      <div style={styles.compose} id='compose'>
        <Emojis
          open={showEmoji}
          closeModal={this.toggleEmoji(false)}
          onEmojiClick={emoji => this.setState({message: message + emoji})} />
        <IconButton
          onClick={this.toggleEmoji(!showEmoji)}>
          <FontIcon
            className='material-icons'>
            tag_faces
          </FontIcon>
        </IconButton>
        <form onSubmit={this.post} style={styles.form} onClick={this.toggleEmoji(false)}>
          <TextField
            name='compose'
            id='composeTextInput'
            style={styles.textfield}
            onChange={this.onChange}
            autoComplete='off'
            value={this.state.message} />
          <FlatButton
            style={styles.sendButton}
            id='sendMessageButton'
            type='submit'
            icon={
              <FontIcon
                className='material-icons'>
                send
              </FontIcon>
              } />
        </form>
        <Popover
          open={showMentionMenu}
          anchorEl={document.getElementById('compose')}
          anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
          targetOrigin={{horizontal: 'middle', vertical: 'bottom'}}
          onRequestClose={() => this.setState({showMentionMenu: false})} >
          <Menu>
            {
              this.nametagList().map(name =>
                <MenuItem
                  key={name}
                  primaryText={`@${name}`}
                  onClick={this.addMention(`@${name} `)} />
              )
            }
          </Menu>
        </Popover>
      </div>
    </div>
  }
}

const {string, func, shape, bool} = PropTypes

Compose.propTypes = {
  roomId: string.isRequired,
  myNametag: shape({
    id: string.isRequired,
    name: string.isRequired
  }).isRequired,
  createMessage: func.isRequired,
  updateRoom: func.isRequired,
  defaultMessage: string,
  welcome: string,
  posted: bool,
  mod: shape({
    name: string.isRequired,
    image: string.isRequired
  })
}

export default radium(Compose)

const styles = {
  container: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    flexDirection: 'column',
    borderCollapse: 'separate',
    paddingBottom: 20,
    paddingTop: 10,
    background: '#FFF',
    width: '100%',
    paddingRight: 15,
    zIndex: 40,
    marginLeft: 290,
    [mobile]: {
      marginLeft: 20
    }
  },
  topic: {
    fontStyle: 'italic',
    fontSize: 14,
    color: grey
  },
  topicContainer: {
    display: 'flex',
    paddingLeft: 25
  },
  modImage: {
    marginRight: 10
  },
  compose: {
    display: 'flex'
  },
  showEmoji: {
    cursor: 'pointer',
    fontSize: 18
  },
  textfield: {
    flex: 1,
    width: 'inherit'
  },
  mobileSelector: {
    left: 20,
    width: 'inherit'
  },
  sendButton: {
    minWidth: 45
  },
  form: {
    flex: 1,
    display: 'flex'
  }
}
