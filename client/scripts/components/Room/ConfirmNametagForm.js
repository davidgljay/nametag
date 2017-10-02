import React, {Component, PropTypes} from 'react'
import EditNametag from '../Nametag/EditNametag'
import UserBadges from '../Badge/UserBadges'
import RaisedButton from 'material-ui/RaisedButton'
import {grey} from '../../../styles/colors'
import {track, increment, setTimer} from '../../utils/analytics'

class ConfirmNametagForm extends Component {

  constructor (props) {
    super(props)

    this.onEnterClick = () => {
      const {roomId, nametag, templates, createNametag} = this.props
      track('JOIN_ROOM', {id: roomId, public: templates.length === 0})
      increment('ROOMS_JOINED')
      const nametagForPost = {
        ...nametag,
        badges: nametag.badges ? nametag.badges.map(badge => badge.id) : []
      }
      createNametag(nametagForPost)
        .then(this.props.onCreateNametag)
    }
  }

  componentDidMount () {
    setTimer('JOIN_ROOM')
  }

  render () {
    const {
      me,
      roomId,
      nametag,
      templates,
      addNametagEditBadge,
      removeNametagEditBadge,
      updateNametagEdit
    } = this.props

    return <div className='confirm-nametag'>
      <h3 style={styles.header}>How would you like to appear in this room?</h3>
      <EditNametag
        nametagEdit={nametag}
        me={me}
        requiredTemplates={templates}
        addNametagEditBadge={addNametagEditBadge}
        removeNametagEditBadge={removeNametagEditBadge}
        updateNametagEdit={updateNametagEdit}
        roomId={roomId} />
      <div style={styles.userBadges}>
        <UserBadges
          selectedBadges={nametag && nametag.badges}
          badges={me.badges} />
      </div>
      <div style={styles.accept}>
        <RaisedButton
          id='enterRoomButton'
          primary
          labelStyle={styles.button}
          onClick={this.onEnterClick}
          label='ENTER ROOM' />
      </div>
    </div>
  }
}

const {func, string, arrayOf, object, shape} = PropTypes

ConfirmNametagForm.propTypes = {
  roomId: string.isRequired,
  nametag: object,
  templates: arrayOf(shape({
    id: string.isRequired
  })),
  createNametag: func.isRequired,
  addNametagEditBadge: func.isRequired,
  removeNametagEditBadge: func.isRequired,
  updateNametagEdit: func.isRequired
}

export default ConfirmNametagForm

const styles = {
  header: {
    marginTop: 0,
    textAlign: 'center'
  },
  accept: {
    textAlign: 'center',
    paddingTop: 20
  },
  button: {
    color: '#fff',
    fontWeight: 'bold'
  },
  userBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    verticalAlign: 'top',
    justifyContent: 'center',
    padding: 5,
    margin: 5
  },
  userBadgeText: {
    fontStyle: 'italic',
    fontSize: 16,
    color: grey
  },
  userBadgeIcon: {
    color: grey,
    fontSize: 18,
    verticalAlign: 'middle'
  }
}
