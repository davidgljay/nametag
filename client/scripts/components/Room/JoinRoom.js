import React, {Component, PropTypes} from 'react'
import Norms from './Norms'
import Navbar from '../Utils/Navbar'
import RoomCard from './RoomCard'
import radium from 'radium'
import {grey} from '../../../styles/colors'
import {mobile} from '../../../styles/sizes'
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
      room
    } = this.props

    return <div id='room' style={styles.container}>
      <Navbar me={me} empty />
      <div id='roomInfoContainer' style={styles.roomInfoContainer}>
        <h2 style={styles.introText}>You've been invited to a conversation on Nametag.</h2>
        <RoomCard room={room} />
      </div>
      <div style={styles.joinContainer}>
        <div id='normsContainer' style={styles.normsContainer}>
          <div style={styles.norms}>
            <h3>Norms</h3>
            <Norms norms={room.norms} showChecks />
          </div>
        </div>
      </div>
    </div>
  }
}

const {shape, string, object} = PropTypes

JoinRoom.propTypes = {
  me: object,
  room: shape({
    title: string.isRequired,
    mod: shape({
      id: string.isRequired,
      image: string.isRequired
    })
  }).isRequired
}

export default radium(JoinRoom)

const styles = {
  container: {
    marginBottom: 100
  },
  roomInfoContainer: {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    marginTop: 40
  },
  introText: {
    marginBottom: 60
  },
  roomInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20,
    width: 300,
    padding: 10
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
