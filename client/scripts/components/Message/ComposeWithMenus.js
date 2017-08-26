import React, {Component, PropTypes} from 'react'
import Compose from './Compose'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import CommandMenu from './CommandMenu'
import NametagIcon from '../Nametag/NametagIcon'
import {mobile} from '../../../styles/sizes'
import {grey} from '../../../styles/colors'
import radium from 'radium'

class ComposeWithMenu extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showComposeMenu: '',
      nametagList: [],
      message: ''
    }

    this.onUpdateText = (text) => {
      if (/@\S*$/.test(text)) {
        this.setState({showComposeMenu: 'mention'})
      } else if (/^\/\S*$/.test(text)) {
        this.setState({showComposeMenu: 'command'})
      } else {
        this.setState({showComposeMenu: ''})
      }
      this.setState({
        nametagList: this.nametagList(text),
        message: text
      })
    }

    this.onPost = (message) => {
      this.slashCommand(message)
    }

    this.closeMenus = () => {
      this.setState({showComposeMenu: ''})
    }

    this.slashCommand = (message) => {
      const {updateRoom, updateNametag, roomId, myNametag, welcomeModal} = this.props
      if (welcomeModal) {
        return
      }
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

    this.nametagList = (text) => {
      const query = /@\S*/.exec(text)
      const {nametags} = this.props
      return query ? nametags.filter(n => n.name.toLowerCase().match(query[0].slice(1).toLowerCase()))
        .map(n => n.name)
        : nametags.map(n => n.name)
    }

    this.getTypingPrompt = (nametagId) => {
      const {nametags} = this.props
      return nametags.filter((nametag) => nametag.id === nametagId)[0]
    }

    this.addMention = mention => e => {
      e.preventDefault()
      this.props.setDefaultMessage(this.state.message.replace(/@\S*(?=[^@]*$)/, mention))
      this.setState({
        showComposeMenu: false
      })
    }

    this.addCommand = command => e => {
      e.preventDefault()
      this.props.setDefaultMessage(this.state.message.replace(/\/\S*(?=[^/]*$)/, command))
      this.setState({
        showComposeMenu: false
      })
    }

    this.closeMenus = () => {
      this.setState({showComposeMenu: false})
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // The menu popovers seem like to steal focus from the compose box
    // This is a hack to take focus back, there is probably a better solution
    if (this.state.showComposeMenu || prevState.showComposeMenu) {
      document.getElementById('composeTextInput').focus()
      setTimeout(() => document.getElementById('composeTextInput').focus(), 0)
      setTimeout(() => document.getElementById('composeTextInput').focus(), 250)
      setTimeout(() => document.getElementById('composeTextInput').focus(), 400)
    }
  }

  render () {
    const {
      roomId,
      myNametag,
      showTypingPrompt,
      typingPrompts,
      createMessage,
      defaultMessage,
      mod,
      topic,
      recipient,
      nametags,
      setDefaultMessage,
      setRecipient
    } = this.props
    const {nametagList, showComposeMenu} = this.state

    const containerStyle = recipient ? {...styles.container, ...styles.privMessageContainer} : styles.container
    return <div style={containerStyle}>
      <Compose
        roomId={roomId}
        recipient={recipient}
        myNametag={myNametag}
        showTypingPrompt={showTypingPrompt}
        nametags={nametags}
        createMessage={createMessage}
        defaultMessage={defaultMessage}
        setDefaultMessage={setDefaultMessage}
        setRecipient={setRecipient}
        mod={mod}
        topic={topic}
        onPost={this.onPost}
        onUpdateText={this.onUpdateText}
      />
      <div style={styles.typingPrompts}>
        {
          typingPrompts.length > 0 && <div style={styles.typingPromptText}>Typing:</div>
        }
        {
          typingPrompts.map(nametagId => {
            const prompt = this.getTypingPrompt(nametagId)
            // TODO: Add style
            return <NametagIcon
              key={nametagId}
              name={prompt.name}
              image={prompt.image}
              diameter={20} />
          })
        }
      </div>
      <Popover
        open={showComposeMenu === 'mention' && nametagList.length > 0}
        anchorEl={document.getElementById('compose')}
        anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
        targetOrigin={{horizontal: 'middle', vertical: 'bottom'}}
        onRequestClose={this.closeMenus} >
        <Menu style={styles.mentionMenu}>
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
        isMod={!!myNametag && myNametag.id === mod.id}
        open={showComposeMenu === 'command'}
        anchor={document.getElementById('compose')}
        onRequestClose={this.closeMenus}
        setDefaultMessage={setDefaultMessage} />
    </div>
  }
}

const {object, string, func} = PropTypes

ComposeWithMenu.propTypes = {
  roomId: string.isRequired,
  myNametag: object,
  createMessage: func.isRequired,
  defaultMessage: string,
  setDefaultMessage: func.isRequired,
  showTypingPrompt: func.isRequired,
  setRecipient: func.isRequired,
  topic: string,
  recipient: string,
  mod: object.isRequired
}

export default radium(ComposeWithMenu)

const styles = {
  mentionMenu: {
    maxHeight: '50vh'
  },
  container: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    flexDirection: 'column',
    borderCollapse: 'separate',
    paddingBottom: 20,
    paddingTop: 10,
    width: 'calc(100% - 300px)',
    paddingRight: 15,
    zIndex: 40,
    marginLeft: 290,
    background: '#FFF',
    [mobile]: {
      marginLeft: 20,
      width: 'calc(100% - 40px)'
    }
  },
  privMessageContainer: {
    background: '#f3f3f3',
    borderTop: '2px solid rgba(168, 168, 168, 0.75)'
  },
  typingPrompts: {
    minHeight: 20,
    display: 'flex',
    paddingLeft: 40
  },
  typingPromptText: {
    color: grey,
    fontStyle: 'italic',
    fontSize: 12,
    marginRight: 10
  }
}
