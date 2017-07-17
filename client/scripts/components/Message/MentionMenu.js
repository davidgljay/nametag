import React, {PropTypes} from 'react'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

const MentionMenu = ({name, hideDMs, open, anchor, toggleMenu, setDefaultMessage}) => {
  const setMessage = message => e => {
    e.preventDefault()
    setDefaultMessage(message)
    toggleMenu(e)
  }

  return <div>
    <Popover
      open={open}
      anchorEl={anchor}
      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      onRequestClose={toggleMenu}>
      <Menu>
        <MenuItem
          key='Mention'
          primaryText={`@Mention`}
          onClick={setMessage(`@${name} `)} />
        {
          !hideDMs &&
          <MenuItem
            key='DM'
            primaryText={`Private Message`}
            onClick={setMessage(`d ${name} `)} />
        }
      </Menu>
    </Popover>
  </div>
}

const {func, string, bool, object} = PropTypes
MentionMenu.propTypes = {
  toggleMenu: func.isRequired,
  name: string.isRequired,
  setDefaultMessage: func.isRequired,
  anchor: object,
  open: bool.isRequired
}

export default MentionMenu
