import React, {Component, PropTypes} from 'react'
import Compose from './Compose'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import CommandMenu from './CommandMenu'

class ComposeWithMenu extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showComposeMenu: '',
      nametagList: []
    }

    this.onUpdateText = (text) => {
      console.log('onUpdateText', text)
      if (/@\S*$/.test(text)) {
        this.setState({showComposeMenu: 'mention'})
      } else if (/^\/\S*$/.test(text)) {
        this.setState({showComposeMenu: 'command'})
      } else {
        this.setState({showComposeMenu: ''})
      }
      this.setState({
        nametagList: this.nametagList()
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

    this.nametagList = () => {
      const query = /@\S*/.exec(this.state.message)
      const {nametags} = this.props
      return query ? nametags.filter(n => n.name.toLowerCase().match(query[0].slice(1).toLowerCase()))
        .map(n => n.name)
        : nametags.map(n => n.name)
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
    const {roomId, myNametag, createMessage, defaultMessage, mod, topic, setDefaultMessage} = this.props
    const {nametagList, showComposeMenu} = this.state
    return <div>
      <Compose
        roomId={roomId}
        myNametag={myNametag}
        createMessage={createMessage}
        defaultMessage={defaultMessage}
        mod={mod}
        topic={topic}
        onPost={this.onPost}
        onUpdateText={this.onUpdateText}
      />
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
        isMod={myNametag.id === mod.id}
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
  myNametag: object.isRequired,
  createMessage: func.isRequired,
  defaultMessage: string,
  setDefaultMessage: func.isRequired,
  topic: string,
  mod: object.isRequired
}

export default ComposeWithMenu

const styles = {}
