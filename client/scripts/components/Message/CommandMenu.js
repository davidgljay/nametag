import React, {PropTypes} from 'react'
import MenuItem from 'material-ui/MenuItem'
import Menu from 'material-ui/Menu'
import Popover from 'material-ui/Popover'

const CommandMenu = ({
  isMod,
  setDefaultMessage,
  onRequestClose,
  open,
  anchor,
  messageId,
  deleteMessage = () => {},
  roomId
}) => {
  const commands = [
    {
      command: 'welcome',
      mod: true,
      description: 'Update this room\'s welcome prompt'
    },
    {
      command: 'intro',
      mod: false,
      description: 'Update your intro message'
    },
    {
      command: 'name',
      mod: false,
      description: 'Update your name'
    },
    {
      command: 'title',
      mod: true,
      description: 'Update this room\'s title'
    },
    {
      command: 'announce',
      mod: true,
      description: 'Send an e-mail to everyone in the room'
    }
  ]

  const onMenuItemClick = command => e => {
    e.preventDefault()
    setDefaultMessage(`/${command} `)
    onRequestClose()
  }

  const onDeleteClick = e => {
    e.preventDefault()
    deleteMessage(messageId, roomId)
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
          <MenuItem
            key='delete'
            style={styles.commandMenu}
            primaryText='Delete Message'
            onClick={onDeleteClick} />
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
  deleteMessage: func,
  roomId: string
}

export default CommandMenu

const styles = {
  commandMenu: {}
}
