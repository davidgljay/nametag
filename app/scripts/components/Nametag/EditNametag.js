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
    props.addNametagEditBadge(monitor.getItem(), props.room || props.template)
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
      const {room, template} = this.props
      return (e) => {
        this.props.updateNametagEdit(
          room || template,
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
    const {nametagEdit = {}, updateNametagEdit, me = {}, room, template} = this.props
    if (room) {
      updateNametagEdit(room, 'room', room)
    } else {
      updateNametagEdit(template, 'template', template)
    }

    if (!nametagEdit.name &&
      me.displayNames &&
      me.displayNames.length >= 1) {
      updateNametagEdit(room, 'name', me.displayNames[0])
    }
    if (!nametagEdit.icon &&
      me.icons.length > 0) {
      updateNametagEdit(room, 'icon', me.icons[0])
    }
  }

  render () {
    const {
      error,
      me = {},
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
            icons={me.icons || []}
            icon={nametag.icon}
            room={room}
            updateNametagEdit={updateNametagEdit} />
          <div style={{width: 190, flex: 1}}>
            <AutoComplete
              floatingLabelText='Name'
              filter={AutoComplete.noFilter}
              openOnFocus
              disableFocusRipple={false}
              dataSource={me.displayNames || []}
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
  me: PropTypes.shape({
    icons: PropTypes.arrayOf(PropTypes.string).isRequired,
    displayNames: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  room: PropTypes.string,
  template: PropTypes.string,
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
