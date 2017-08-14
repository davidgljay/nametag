import React, {Component, PropTypes} from 'react'
import Badges from '../Badge/Badges'
import Nametag from '../Nametag/Nametag'
import Norms from './Norms'
import Join from './Join'
import Navbar from '../Utils/Navbar'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {Card} from 'material-ui/Card'
import {track, setTimer} from '../../utils/analytics'

class JoinRoom extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showNorms: false
    }

    this.showNorms = e => {
      e.preventDefault()
      track('NORMS_CLICK')
      this.setState({showNorms: !this.state.showNorms})
    }
  }

  componentDidMount () {
    const {me, room} = this.props
    if (me) {
      track('JOIN_ROOM_VIEW_LOGGED_IN')
      setTimer('JOIN_ROOM')
    } else {
      track('JOIN_ROOM_VIEW_LOGGED_OUT')
      setTimer('LOGIN')
    }
    document.title = `${room.title}`
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

    const {showNorms} = this.state

    return <div id='room' style={styles.container}>
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
      {
        templates && templates.length > 0 &&
        <div style={styles.privateText}>Private Conversation For:</div>
      }
      <Badges
        badges={templates.map(template => ({id: template.id, notes: [], template}))} />
      <div style={styles.modContainer}>
        <div>
          <h3>Moderator</h3>
          <Card>
            <Nametag
              style={styles.mod}
              mod={mod.id}
              nametag={mod} />
          </Card>
        </div>
      </div>
      <div style={styles.joinContainer}>
        <div id='normsContainer' style={styles.normsContainer}>
          <div style={styles.norms}>
            <Norms norms={norms} showChecks />
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
          updateNametagEdit={updateNametagEdit} />
      </div>
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

export default radium(JoinRoom)

const styles = {
  container: {
    marginBottom: 100
  },
  roomCard: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    [mobile]: {
      width: 300
    }
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
  privateText: {
    textAlign: 'center',
    marginTop: 30
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
  modContainer: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 50
  },
  mod: {
    width: 300
  },
  joinContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  normsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginRight: 50,
    paddingTop: 10,
    [mobile]: {
      marginRight: 0
    }
  },
  norms: {
    width: 300,
    marginRight: 20
  }
}
