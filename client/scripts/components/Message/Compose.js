import React, { Component, PropTypes } from 'react'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {grey} from '../../../styles/colors'
import FontIcon from 'material-ui/FontIcon'
import NametagIcon from '../Nametag/NametagIcon'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import {Picker} from 'emoji-mart'
import emojiText from 'emoji-text'
import MenuItem from 'material-ui/MenuItem'
import CommandMenu from './CommandMenu'
import key from 'keymaster'
import {track, increment} from '../../utils/analytics'

class Compose extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      showEmoji: false,
      showComposeMenu: '',
      nametagList: []
    }

    this.onChange = (e) => {
      const text = e.target.value
      if (/^@\S*$/.test(text)) {
        this.setState({showComposeMenu: 'mention'})
      } else if (/^\/\S*$/.test(text)) {
        this.setState({showComposeMenu: 'command'})
      } else {
        this.setState({showComposeMenu: ''})
      }
      if (text.slice(-1) === '\n') {
        this.post(e)
        return
      }
      this.setState({
        message: text,
        nametagList: this.nametagList()
      })
    }

    this.post = (e) => {
      const {myNametag, roomId, updateNametag, createMessage, posted} = this.props
      const {message} = this.state
      track('POST_MESSAGE', {room: roomId})
      increment('MESSAGES_POSTED')
      e.preventDefault()
      if (message.length > 0) {
        let msg = {
          text: emojiText.convert(message, {delimiter: ':'}),
          author: myNametag.id,
          room: roomId
        }
        if (!posted) {
          updateNametag(myNametag.id, {bio: emojiText.convert(message, {delimiter: ':'})})
        }
        this.setState({message: '', showEmoji: false, showMentionMenu: false, posted: true})
        this.slashCommand(message)
        createMessage(msg, myNametag)
      }
    }

    this.slashCommand = (message) => {
      const {updateRoom, updateNametag, roomId, myNametag} = this.props
      const commandRegex = /^\/(\S+)\s(.+)/.exec(message)
      if (!commandRegex) {
        return
      }
      const command = commandRegex[1]
      const text = commandRegex[2]
      switch (command) {
        case 'welcome':
          updateRoom(roomId, {welcome: text})
          break
        case 'intro':
          updateNametag(myNametag.id, {bio: text})
          break
        case 'name':
          updateNametag(myNametag.id, {name: text})
          break
        case 'title':
          updateRoom(roomId, {title: text})
          break
        case 'description':
          updateRoom(roomId, {description: text})
          break
        case 'topic':
          updateRoom(roomId, {topic: text})
          break
        default:
          return
      }
    }

    this.toggleEmoji = (open) => () => {
      if (open) {
        track('EMOJI_MENU_OPEN')
      }
      this.setState({showEmoji: open})
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
        showComposeMenu: false
      })
    }

    this.addCommand = command => e => {
      e.preventDefault()
      this.setState({
        message: this.state.message.replace(/\/\S*(?=[^/]*$)/, command),
        showComposeMenu: false
      })
    }

    this.closeMenus = () => {
      this.setState({showComposeMenu: false})
    }
  }

  componentWillMount () {
    key('enter', 'compose', this.post)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.defaultMessage !== prevProps.defaultMessage) {
      this.setState({message: this.props.defaultMessage})
    }

    // The menu popovers seem like to steal focus from the compose box
    // This is a hack to take focus back, there is probably a better solution
    if (this.state.showComposeMenu || prevState.showComposeMenu) {
      document.getElementById('composeTextInput').focus()
      setTimeout(() => document.getElementById('composeTextInput').focus(), 0)
      setTimeout(() => document.getElementById('composeTextInput').focus(), 250)
      setTimeout(() => document.getElementById('composeTextInput').focus(), 400)
    }
  }

  componentWillUnmount () {
    key.deleteScope('compose')
  }

  render () {
    // TODO: Add GIFs, image upload

    const {welcome, topic, mod, myNametag, setDefaultMessage, posted} = this.props
    const {showEmoji, message, showComposeMenu, nametagList} = this.state
    const prompt = posted ? topic : welcome
    return <div style={styles.container}>
      {
        prompt && <div style={styles.topicContainer}>
          <div style={styles.nametagIconContainer}>
            <NametagIcon
              image={mod.image}
              name={mod.name}
              diameter={20} />
          </div>
          <div id='topic' style={styles.topic}>{prompt}</div>
        </div>
      }
      <div style={styles.compose} id='compose'>
        <Popover
          open={showEmoji}
          anchorEl={document.getElementById('compose')}
          overlayStyle={{opacity: 0}}
          onRequestClose={this.toggleEmoji(false)}>
          <Picker
            set='emojione'
            autoFocus
            emoji='dancer'
            title='Skin Tone'
            onClick={emoji => this.setState({message: message + emoji.colons})} />
        </Popover>
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
            multiLine
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
          open={showComposeMenu === 'mention' && nametagList.length > 0}
          anchorEl={document.getElementById('compose')}
          anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
          targetOrigin={{horizontal: 'middle', vertical: 'bottom'}}
          onRequestClose={this.closeMenus} >
          <Menu>
            {
              nametagList.map(name =>
                <MenuItem
                  key={name}
                  primaryText={`@${name}`}
                  onClick={this.addMention(`@${name} `)} />
              )
            }
          </Menu>
        </Popover>
        <CommandMenu
          isMod={myNametag.id === mod.id}
          open={showComposeMenu === 'command'}
          anchor={document.getElementById('compose')}
          onRequestClose={this.closeMenus}
          setDefaultMessage={setDefaultMessage} />
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
  setDefaultMessage: func.isRequired,
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
    width: 'calc(100% - 300px)',
    paddingRight: 15,
    zIndex: 40,
    marginLeft: 290,
    [mobile]: {
      marginLeft: 20,
      width: 'calc(100% - 40px)'
    }
  },
  emojiSelector: {
    background: 'none',
    boxShadow: 'none'
  },
  nametagIconContainer: {
    marginRight: 5
  },
  topic: {
    fontStyle: 'italic',
    fontSize: 18,
    color: grey
  },
  topicContainer: {
    display: 'flex',
    paddingLeft: 25
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
    width: '100%'
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
