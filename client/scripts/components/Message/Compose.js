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
import MenuItem from 'material-ui/MenuItem'
import Emojis from '../Utils/Emojis'
import key from 'keymaster'

class Compose extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      showEmoji: false,
      showComposeMenu: '',
      nametagList: [],
      // TODO: lastMessage in nametag
      posted: false
    }

    this.onChange = (e) => {
      const text = e.target.value
      if (text.slice(-1) === '@') {
        this.setState({showComposeMenu: 'mention'})
      } else if (text.slice(-1) === '/') {
        this.setState({showComposeMenu: 'command'})
      } else if (text.slice(-1) === ' ') {
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
      const {myNametag, roomId, updateNametag, createMessage} = this.props
      const {message, posted} = this.state
      e.preventDefault()
      if (message.length > 0) {
        let msg = {
          text: message,
          author: myNametag.id,
          room: roomId
        }
        if (!posted) {
          updateNametag(myNametag.id, {bio: message})
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
        showComposeMenu: false
      })
    }

    this.addCommand = command => e => {
      e.preventDefault()
      this.setState({
        message: this.state.message.replace(/\/\S*(?=[^\/]*$)/, command),
        showComposeMenu: false
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

    const commands = [
      {
        command: 'welcome',
        mod: true,
        description: 'Update this room\'s welcome prompt'
      },
      {
        command: 'intro',
        mod: false,
        description: 'Update the intro message on your nametag'
      },
      {
        command: 'title',
        mod: true,
        description: 'Update the room\'s title'
      },
      {
        command: 'description',
        mod: true,
        description: 'Update the room\'s description'
      },
      {
        command: 'topic',
        mod: true,
        description: 'Update the current topic of discussion'
      }
    ]

    const {welcome, topic, mod} = this.props
    const {showEmoji, message, showComposeMenu, posted} = this.state
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
          open={showComposeMenu}
          anchorEl={document.getElementById('compose')}
          anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
          targetOrigin={{horizontal: 'middle', vertical: 'bottom'}}
          onRequestClose={() => this.setState({showComposeMenu: false})} >
          <Menu>
            {
              showComposeMenu === 'mention' && this.nametagList().map(name =>
                <MenuItem
                  key={name}
                  primaryText={`@${name}`}
                  onClick={this.addMention(`@${name} `)} />
              )
            }
            {
              showComposeMenu === 'command' && commands.map(({command, description}) =>
                <MenuItem
                  key={command}
                  primaryText={`/${command} ${description}`}
                  onClick={this.addMention(`\${command} `)} />
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
    width: 'calc(100% - 300px)',
    paddingRight: 15,
    zIndex: 40,
    marginLeft: 290,
    [mobile]: {
      marginLeft: 20,
      width: 'calc(100% - 40px)'
    }
  },
  nametagIconContainer: {
    marginRight: 5
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
