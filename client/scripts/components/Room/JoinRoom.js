import React, {Component, PropTypes} from 'react'
import Badges from '../Badge/Badges'
import Nametag from '../Nametag/Nametag'
import Norms from './Norms'
import Join from './Join'
import Navbar from '../Utils/Navbar'
import {Card} from 'material-ui/Card'

class JoinRoom extends Component {

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
        <div id='roomImage'>
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
      <div id='normsContainer' style={styles.normsContainer}>
        <div style={styles.norms}>
          <h3>
            Norms In This Room
          </h3>
          <h1><Norms norms={norms} showChecks /></h1>
        </div>
        <div style={styles.modContainer}>
          <h3>Moderator</h3>
          <Card>
            <Nametag
              style={styles.mod}
              mod={mod.id}
              nametag={mod} />
          </Card>
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
    width: 300
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
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  norms: {
    width: 300
  }
}
