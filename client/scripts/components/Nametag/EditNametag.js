import React, { Component, PropTypes } from 'react'
import Badges from '../Badge/Badges'
import { DropTarget } from 'react-dnd'
import { dragTypes } from '../../constants'
import {Card} from 'material-ui/Card'
import AutoComplete from 'material-ui/AutoComplete'
import NTIconMenu from './IconMenu'
import {track} from '../../utils/analytics'
import t from '../../utils/i18n'

const nametagTarget = {
  drop (props, monitor) {
    if (props.addNametagEditBadge) {
      props.addNametagEditBadge(monitor.getItem(), props.roomId || props.template)
    }
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
      showMenu: false,
      nameEdited: false
    }

    this.updateNametagProperty = (property) => {
      const {roomId, template, updateNametagEdit} = this.props
      if (property === 'name' && !this.state.nameEdited) {
        this.setState({nameEdited: true})
        track('NAMETAG_EDITED', 'name')
      } else if (property === 'image') {
        track('NAMETAG_EDITED', 'image')
      }
      return (e) => {
        updateNametagEdit(
          roomId || template,
          property,
          e.target.value
          )
      }
    }

    this.removeBadge = (badge) => {
      const {removeNametagEditBadge, roomId, template} = this.props
      if (removeNametagEditBadge) {
        removeNametagEditBadge(badge, roomId || template)
      }
    }

    this.requiredBadges = () =>
      this.props.me.badges.filter(badge => this.props.requiredTemplates.indexOf(badge.template.id) > -1)
  }

  componentDidMount () {
    const {nametagEdit = {}, updateNametagEdit, me = {}, roomId, template} = this.props
    if (roomId) {
      updateNametagEdit(roomId || template, 'room', roomId)
    } else {
      updateNametagEdit(roomId || template, 'template', template)
    }

    if (!nametagEdit.name &&
      me.displayNames &&
      me.displayNames.length >= 1) {
      updateNametagEdit(roomId || template, 'name', me.displayNames[0])
    }
    if (!nametagEdit.image &&
      me.images.length > 0) {
      updateNametagEdit(roomId || template, 'image', me.images[0])
    }

    updateNametagEdit(roomId || template, 'badges', this.requiredBadges())
  }

  render () {
    const {
      error,
      me = {},
      updateNametagEdit,
      roomId,
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
            about={roomId || template}
            updateNametagEdit={updateNametagEdit} />
          <div style={{width: 190, flex: 1}}>
            <AutoComplete
              floatingLabelText={t('nametag.name')}
              filter={AutoComplete.noFilter}
              id='editNametagName'
              openOnFocus
              disableFocusRipple={false}
              dataSource={me.displayNames || []}
              errorText={error && error.nameError}
              onUpdateInput={name => updateNametagEdit(roomId || template, 'name', name)}
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
  roomId: string,
  template: string,
  isOver: bool.isRequired,
  requiredTemplates: arrayOf(string).isRequired,
  updateNametagEdit: func.isRequired,
  addNametagEditBadge: func,
  removeNametagEditBadge: func
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
