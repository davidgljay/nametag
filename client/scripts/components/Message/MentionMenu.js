import React, {PropTypes} from 'react'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import t from '../../utils/i18n'

const MentionMenu = ({nametagId, name, hideDMs, open, anchor, toggleMenu, setDefaultMessage, setRecipient}) => {
  const setMessage = message => e => {
    e.preventDefault()
    setDefaultMessage(message)
    toggleMenu(e)
  }

  const setDM = id => e => {
    e.preventDefault()
    setRecipient(id)
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
          primaryText={t('message.mention')}
          onClick={setMessage(`@${name} `)} />
        {
          !hideDMs &&
          <MenuItem
            key='DM'
            primaryText={t('message.private_msg')}
            onClick={setDM(nametagId)} />
        }
      </Menu>
    </Popover>
  </div>
}

const {func, string, bool, object} = PropTypes
MentionMenu.propTypes = {
  toggleMenu: func.isRequired,
  name: string.isRequired,
  nametagId: string.isRequired,
  setDefaultMessage: func.isRequired,
  setRecipient: func.isRequired,
  anchor: object,
  open: bool.isRequired
}

export default MentionMenu
