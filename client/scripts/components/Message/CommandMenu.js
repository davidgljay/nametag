import React, {PropTypes} from 'react'
import MenuItem from 'material-ui/MenuItem'
import Menu from 'material-ui/Menu'
import Popover from 'material-ui/Popover'

const CommandMenu = ({isMod, setDefaultMessage, onRequestClose, open, anchor}) => {
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
      command: 'description',
      mod: true,
      description: 'Update this room\'s description'
    },
    {
      command: 'topic',
      mod: true,
      description: 'Update the current topic of discussion'
    }
  ]

  const onMenuItemClick = command => e => {
    e.preventDefault()
    setDefaultMessage(`/${command} `)
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
    </Menu>
  </Popover>
}

const {bool, func, object} = PropTypes
CommandMenu.propTypes = {
  isMod: bool.isRequired,
  open: bool.isRequired,
  anchor: object,
  setDefaultMessage: func.isRequired,
  onRequestClose: func.isRequired
}

export default CommandMenu

const styles = {
  commandMenu: {}
}
