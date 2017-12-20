import React, {PropTypes} from 'react'
import MenuItem from 'material-ui/MenuItem'
import Menu from 'material-ui/Menu'
import Popover from 'material-ui/Popover'
import t from '../../utils/i18n'

const CommandMenu = ({
  isMod,
  setDefaultMessage,
  toggleNametagImageMenu,
  onRequestClose,
  open,
  anchor,
  messageId,
  messageText,
  deleteMessage = () => {},
  setEditing = () => {},
  roomId
}) => {
  const commands = [
    {
      command: 'welcome',
      mod: true,
      description: t('message.commands.welcome')
    },
    {
      command: 'intro',
      mod: false,
      description: t('message.commands.intro')
    },
    {
      command: 'name',
      mod: false,
      description: t('message.commands.name')
    },
    {
      command: 'image',
      mod: false,
      description: t('message.commands.image')
    },
    {
      command: 'title',
      mod: true,
      description: t('message.commands.title')
    },
    {
      command: 'announce',
      mod: true,
      description: t('message.commands.announce')
    }
  ]

  const onMenuItemClick = command => e => {
    e.preventDefault()
    switch (command) {
      case 'image':
        toggleNametagImageMenu(true)
        break
      default:
        setDefaultMessage(`/${command} `)
    }
    onRequestClose()
  }

  const onDeleteClick = e => {
    e.preventDefault()
    deleteMessage(messageId, roomId)
    onRequestClose()
  }

  const onEditClick = e => {
    e.preventDefault()
    setEditing(messageId)
    setDefaultMessage(messageText)
    onRequestClose()
  }

  return <Popover
    open={open}
    anchorEl={anchor}
    anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
    targetOrigin={{horizontal: 'middle', vertical: 'bottom'}}
    onRequestClose={onRequestClose} >
    <Menu>
      {
        commands.filter(command => !command.mod || isMod)
          .map(({command, description}) =>
            <MenuItem
              key={command}
              style={styles.commandMenu}
              primaryText={`/${command}: ${description}`}
              onClick={onMenuItemClick(command)} />
            )
      }
      {
        messageId &&
          <div>
            <MenuItem
              key='edit'
              style={styles.commandMenu}
              primaryText={t('message.edit')}
              onClick={onEditClick} />
            <MenuItem
              key='delete'
              style={styles.commandMenu}
              primaryText={t('message.delete')}
              onClick={onDeleteClick} />
          </div>
      }
    </Menu>
  </Popover>
}

const {bool, func, object, string} = PropTypes
CommandMenu.propTypes = {
  isMod: bool.isRequired,
  open: bool.isRequired,
  anchor: object,
  setDefaultMessage: func.isRequired,
  onRequestClose: func.isRequired,
  messageId: string,
  messageText: string,
  deleteMessage: func,
  setEditing: func,
  roomId: string
}

export default CommandMenu

const styles = {
  commandMenu: {}
}
