import React, {Component, PropTypes} from 'react'
import Norms from './Norms'
import Navbar from '../Utils/Navbar'
import RoomCard from './RoomCard'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {track} from '../../utils/analytics'
import {primary} from '../../../styles/colors'

class JoinRoom extends Component {

  componentDidMount () {
    const {room, me} = this.props
    track('JOIN_ROOM_VIEW', {loggedIn: !!me})
    document.title = `${room.title}`
  }

  render () {
    const {
      me,
      room
    } = this.props

    let banned = false
    // Check to see if the user is banned
    if (me) {
      const myNametag = me.nametags.find(nt => nt.room && nt.room.id === room.id)
      banned = !!myNametag && myNametag.banned
    }

    return <div id='room' style={styles.container}>
      <Navbar me={me} empty />
      <div style={styles.hintText}>
        Small, private conversations with people you trust.
      </div>
      <div id='roomInfoContainer' style={styles.roomInfoContainer}>
        <h3 style={styles.introText}>{
            banned
            ? 'You have been banned from this conversation:'
            : ''
          }</h3>
        <RoomCard room={room} disabled={room.closed || banned} />
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
    marginTop: 10
  },
  hintText: {
    fontSize: 13,
    color: primary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  introText: {
    marginBottom: 60,
    fontWeight: 300
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
