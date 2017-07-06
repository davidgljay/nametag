import React, { Component, PropTypes } from 'react'
import Badges from '../Badge/Badges'
import { DropTarget } from 'react-dnd'
import { dragTypes } from '../../constants'
import {Card} from 'material-ui/Card'
import AutoComplete from 'material-ui/AutoComplete'
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
      const {room, template, updateNametagEdit} = this.props
      return (e) => {
        updateNametagEdit(
          room || template,
          property,
          e.target.value
          )
      }
    }

    this.removeBadge = (badge) => {
      const {removeNametagEditBadge, room, template} = this.props
      removeNametagEditBadge(badge, room || template)
    }

    this.requiredBadges = () =>
      this.props.me.badges.filter(badge => this.props.requiredTemplates.indexOf(badge.template.id) > -1)
  }

  componentDidMount () {
    const {nametagEdit = {}, updateNametagEdit, me = {}, room, template} = this.props
    if (room) {
      updateNametagEdit(room || template, 'room', room)
    } else {
      updateNametagEdit(room || template, 'template', template)
    }

    if (!nametagEdit.name &&
      me.displayNames &&
      me.displayNames.length >= 1) {
      updateNametagEdit(room || template, 'name', me.displayNames[0])
    }
    if (!nametagEdit.image &&
      me.images.length > 0) {
      updateNametagEdit(room || template, 'image', me.images[0])
    }

    updateNametagEdit(room || template, 'badges', this.requiredBadges())
  }

  render () {
    const {
      error,
      me = {},
      updateNametagEdit,
      room,
      template,
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
      image: ''
    }

    return this.props.connectDropTarget(<div id='editNametag' style={styles.container}>
      <Card style={styles.editNametag} className='profile'>
        <div style={styles.cardInfo}>
          <NTIconMenu
            images={me.images}
            image={nametag.image}
            about={room || template}
            updateNametagEdit={updateNametagEdit} />
          <div style={{width: 190, flex: 1}}>
            <AutoComplete
              floatingLabelText='Name'
              filter={AutoComplete.noFilter}
              id='editNametagName'
              openOnFocus
              disableFocusRipple={false}
              dataSource={me.displayNames || []}
              errorText={error && error.nameError}
              onUpdateInput={name => updateNametagEdit(room || template, 'name', name)}
              animated
              style={nameStyle}
              textFieldStyle={nameTextfieldStyle}
              fullWidth={false}
              floatingLabelStyle={floatingLabelStyle}
              underlineShow={false}
              searchText={nametag.name} />
          </div>
        </div>
        <Badges
          badges={nametag.badges}
          requiredBadges={this.requiredBadges().map(b => b.id)}
          draggable
          removeFromSource={this.removeBadge} />
      </Card>
    </div>)
  }
}

const {shape, string, arrayOf, object, func, bool} = PropTypes

EditNametag.propTypes = {
  nametagEdit: shape({
    name: string,
    bio: string,
    image: string,
    badges: arrayOf(object)
  }),
  me: shape({
    images: arrayOf(string),
    displayNames: arrayOf(string).isRequired,
    badges: arrayOf(shape({
      id: string.isRequired
    })).isRequired
  }).isRequired,
  room: string,
  template: string,
  isOver: bool.isRequired,
  requiredTemplates: arrayOf(string).isRequired,
  updateNametagEdit: func.isRequired,
  addNametagEditBadge: func.isRequired,
  removeNametagEditBadge: func.isRequired
}

export default DropTarget(dragTypes.badge, nametagTarget, collect)(EditNametag)

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  editNametag: {
    width: 250,
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
