import React, { Component, PropTypes } from 'react'
import Badge from '../Badge/Badge'
import { DropTarget } from 'react-dnd'
import { dragTypes } from '../../constants'
import {Card} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import trackEvent from '../../utils/analytics'
import NTIconMenu from './IconMenu'

const nametagTarget = {
  drop (props, monitor) {
    props.addNametagEditBadge(monitor.getItem(), props.room)
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class EditNametag extends Component {

  constructor (props) {
    super(props)

    this.state = {
      alert: null,
      alertType: null,
      loading: false,
      showMenu: false
    }

    this.updateNametagProperty = (property) => {
      return (e) => {
        this.props.updateNametagEdit(
          this.props.room,
          property,
          e.target.value
          )
      }
    }

    this.removeCert = (badge) => {
      trackEvent('REMOVE_NT_CERT')
      this.props.removeNametagEditBadge(badge, this.props.room)
    }
  }

  componentDidMount () {
    const {nametagEdit = {}, updateNametagEdit, user = {}, room} = this.props
    updateNametagEdit(room, 'room', room)
    if (!nametagEdit.name &&
      user.displayNames &&
      user.displayNames.length >= 1) {
      updateNametagEdit(room, 'name', user.displayNames[0])
    }
    if (!nametagEdit.icon &&
      user.icons.length > 0) {
      updateNametagEdit(room, 'icon', user.icons[0])
    }
  }

  render () {
    const {
      error,
      user = {},
      updateNametagEdit,
      room,
      nametagEdit
    } = this.props

    const {
      nameStyle,
      nameTextfieldStyle,
      floatingLabelStyle
    } = styles

    let nametag = nametagEdit || {
      name: '',
      bio: '',
      icon: ''
    }

    return this.props.connectDropTarget(<div>
      <Card style={styles.editNametag} className='profile'>
        <div style={styles.cardInfo}>
          <NTIconMenu
            icons={user.icons || []}
            icon={nametag.icon}
            room={room}
            updateNametagEdit={updateNametagEdit} />
          <div style={{width: 190, flex: 1}}>
            <AutoComplete
              floatingLabelText='Name'
              filter={AutoComplete.noFilter}
              openOnFocus
              disableFocusRipple={false}
              dataSource={user.displayNames || []}
              errorText={error && error.nameError}
              onUpdateInput={(name) => updateNametagEdit(room, 'name', name)}
              animated
              style={nameStyle}
              textFieldStyle={nameTextfieldStyle}
              fullWidth={false}
              floatingLabelStyle={floatingLabelStyle}
              underlineShow={false}
              searchText={nametag.name} />
            <TextField
              style={{width: 160}}
              rows={2}
              multiLine
              fullWidth
              errorText={error && error.bioError}
              onChange={this.updateNametagProperty('bio')}
              value={nametag.bio}
              hintText='What brings you to this conversation?' />
          </div>
        </div>
        <div className='badges'>
          {nametag.badges && nametag.badges.map(
                (badge) =>
                  <Badge
                    badge={badge}
                    draggable
                    removeFromSource={this.removeCert}
                    key={badge.id} />
                )}
        </div>
      </Card>
    </div>)
  }
}

EditNametag.propTypes = {
  nametagEdit: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    icon: PropTypes.string,
    badges: PropTypes.arrayOf(PropTypes.string)
  }),
  user: PropTypes.shape({
    icons: PropTypes.arrayOf(PropTypes.string).isRequired,
    displayNames: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  room: PropTypes.string.isRequired,
  isOver: PropTypes.bool.isRequired,
  updateNametagEdit: PropTypes.func.isRequired,
  addNametagEditBadge: PropTypes.func.isRequired,
  removeNametagEditBadge: PropTypes.func.isRequired
}

export default DropTarget(dragTypes.badge, nametagTarget, collect)(EditNametag)

const styles = {
  editNametag: {
    width: 250,
    minHeight: 100,
    verticalAlign: 'top',
    padding: 5,
    margin: 5
  },
  cardInfo: {
    display: 'flex'
  },
  nameStyle: {
    width: 150,
    height: 40,
    marginLeft: 10
  },
  nameTextfieldStyle: {
    width: 150,
    height: 40
  },
  floatingLabelStyle: {
    top: 20
  }

}
