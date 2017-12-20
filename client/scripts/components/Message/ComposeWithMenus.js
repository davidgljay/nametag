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
import t from '../../utils/i18n'

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

    this.closeMenus = () => {
      this.setState({showComposeMenu: ''})
    }

    this.nametagList = (text) => {
      const query = /@\S*/.exec(text)
      const {nametags} = this.props
      return query ? nametags.filter(n => n.name.toLowerCase().match(query[0].slice(1).toLowerCase()))
        .map(n => n.name)
        : nametags.map(n => n.name)
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
      closed,
      myNametag,
      badgeToGrant,
      showTypingPrompt,
      createMessage,
      defaultMessage,
      mod,
      topic,
      recipient,
      nametags,
      setDefaultMessage,
      editMessage,
      setRecipient,
      setBadgeToGrant,
      toggleNametagImageMenu,
      editing,
      setEditing
    } = this.props
    const {nametagList, showComposeMenu} = this.state
    const typingPrompts = this.props.typingPrompts.filter(nametag => nametag.id !== myNametag.id)

    const containerStyle = recipient || editing ? {...styles.container, ...styles.privMessageContainer} : styles.container
    return <div style={containerStyle}>
      <Compose
        roomId={roomId}
        recipient={recipient}
        badgeToGrant={badgeToGrant}
        editing={editing}
        myNametag={myNametag}
        showTypingPrompt={showTypingPrompt}
        nametags={nametags}
        closed={closed}
        hintText={closed ? t('message.closed') : ''}
        createMessage={createMessage}
        editMessage={editMessage}
        defaultMessage={defaultMessage}
        setDefaultMessage={setDefaultMessage}
        setEditing={setEditing}
        setRecipient={setRecipient}
        setBadgeToGrant={setBadgeToGrant}
        mod={mod}
        topic={topic}
        onUpdateText={this.onUpdateText}
      />
      <div style={styles.typingPrompts}>
        {
          typingPrompts.length > 0 && <div style={styles.typingPromptText}>t('message.typing')</div>
        }
        {
          typingPrompts.map(nametag =>
            <NametagIcon
              key={nametag.id}
              name={nametag.name}
              image={nametag.image}
              diameter={20} />)
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
        toggleNametagImageMenu={toggleNametagImageMenu}
        setDefaultMessage={setDefaultMessage} />
    </div>
  }
}

const {object, string, func} = PropTypes

ComposeWithMenu.propTypes = {
  roomId: string.isRequired,
  myNametag: object,
  createMessage: func.isRequired,
  editMessage: func.isRequired,
  defaultMessage: string,
  setDefaultMessage: func.isRequired,
  showTypingPrompt: func.isRequired,
  setRecipient: func.isRequired,
  setBadgeToGrant: func.isRequired,
  topic: string,
  recipient: string,
  badgeToGrant: object,
  mod: object.isRequired,
  toggleNametagImageMenu: func.isRequired
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
    paddingBottom: 10,
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
    lineHeight: '20px',
    marginRight: 10
  }
}
