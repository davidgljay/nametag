

import React, { Component, PropTypes } from 'react'
import RoomCard from './RoomCard'
import errorLog from '../../utils/errorLog'
import Navbar from '../Utils/Navbar'
import fbase from '../../api/firebase'
import style from '../../../styles/RoomCard/RoomCards'


class RoomCards extends Component {
  constructor(props) {
    super(props)
    this.state = {rooms: []}
  }

  componentDidMount() {
    this.props.subscribe()

    let self = this
    const roomsRef = fbase.child('rooms')
    roomsRef.on('child_added', function onChildAdded(value) {
      self.setState(function setState(prevState) {
        const room = value.val()
        room.id = value.key()
        prevState.rooms.push(room)
        return prevState
      })
    }, errorLog('Error getting roomCards'))
  }

  componentWillUnmount() {
    this.props.unsubscribe()
    const roomsRef = fbase.child('rooms')
    roomsRef.off('child_added')
  }

  showRoomCard(room) {
    return (
        <RoomCard room={room} key={room.id}/>
      )
  }

  render() {
    return <div style={style.roomSelection}>
        <Navbar userAuth={this.context.userAuth} unAuth={this.context.unAuth}/>
        <div style={style.roomCards}>
          {this.state.rooms.map(this.showRoomCard)}
        </div>
      </div>
  }
}

RoomCards.contextTypes = {
  userAuth: PropTypes.object,
  unAuth: PropTypes.func,
  checkAuth: PropTypes.func,
}

export default RoomCards
