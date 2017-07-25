import React, {Component, PropTypes} from 'react'
import Badges from '../Badge/Badges'
import Nametag from '../Nametag/Nametag'
import Norms from './Norms'
import Join from './Join'
import Navbar from '../Utils/Navbar'
import {Card} from 'material-ui/Card'
import {track} from '../../utils/analytics'

class JoinRoom extends Component {

  componentDidMount () {
    if (this.props.me) {
      track('JOIN_ROOM_LOGGED_IN')
    } else {
      track('JOIN_ROOM_LOGGED_OUT')
    }
  }

  render () {
    const {
      me,
      room: {id, title, image, templates, norms, description, nametagCount, mod},
      nametagEdits,
      createNametag,
      addNametagEditBadge,
      removeNametagEditBadge,
      updateNametagEdit
    } = this.props

    return <div id='room'>
      <Navbar me={me} empty />
      <div id='roomInfoContainer' style={styles.roomInfoContainer}>
        <Card>
          <div style={styles.roomCard}>
            <div id='roomImage' style={styles.roomImageContainer}>
              <img
                style={styles.roomImage}
                onClick={this.flip}
                src={image} />
            </div>
            <div id='roomInfo' style={styles.roomInfo}>
              {
                templates && templates.length > 0 &&
                <div style={styles.privateText}>Conversation Requires:</div>
              }
              <Badges
                badges={templates.map(template => ({id: template.id, notes: [], template}))} />
              <div id='roomTitle' style={styles.title}>
                {title}
              </div>
              <div id='roomDescription' style={styles.description}>
                {description}
              </div>
              <div style={styles.count}>
                {nametagCount || 0} participant
                  {nametagCount === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div id='normsContainer' style={styles.normsContainer}>
        <div style={styles.modContainer}>
          <h3>Moderator</h3>
          <Card>
            <Nametag
              style={styles.mod}
              mod={mod.id}
              nametag={mod} />
          </Card>
        </div>
        <div style={styles.norms}>
          <h4>
            To keep the conversation respectful, {mod.name} has set these norms:
          </h4>
          <h1><Norms norms={norms} showChecks /></h1>
        </div>
      </div>
      <Join
        room={id}
        nametag={nametagEdits[id]}
        me={me}
        templates={templates.map(t => t.id)}
        createNametag={createNametag}
        addNametagEditBadge={addNametagEditBadge}
        removeNametagEditBadge={removeNametagEditBadge}
        updateNametagEdit={updateNametagEdit}
        />
    </div>
  }
}

const {shape, string, object, arrayOf, func} = PropTypes

JoinRoom.propTypes = {
  me: object,
  room: shape({
    title: string.isRequired,
    image: string.isRequired,
    description: string.isRequired,
    mod: shape({
      id: string.isRequired,
      image: string.isRequired
    })
  }).isRequired,
  templates: arrayOf(shape({
    id: string.isRequired
  })),
  nametagEdits: object.isRequired,
  createNametag: func.isRequired,
  addNametagEditBadge: func.isRequired,
  removeNametagEditBadge: func.isRequired,
  updateNametagEdit: func.isRequired
}

export default JoinRoom

const styles = {
  roomCard: {
    display: 'flex'
  },
  roomImageContainer: {
    height: 200
  },
  roomImage: {
    width: 300,
    height: 200,
    objectFit: 'cover',
    borderRadius: 3
  },
  roomInfoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap'
  },
  roomInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20,
    width: 300,
    padding: 10
  },
  title: {
    fontSize: 24,
    lineHeight: '34px',
    marginTop: 5,
    marginBottom: 5
  },
  description: {
    flex: 1,
    marginTop: 20
  },
  count: {
    textAlign: 'right',
    fontSize: 11,
    fontStyle: 'italic',
    color: 'rgb(168, 168, 168)'
  },
  mod: {
    width: 300
  },
  normsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20
  },
  norms: {
    width: 300
  }
}
