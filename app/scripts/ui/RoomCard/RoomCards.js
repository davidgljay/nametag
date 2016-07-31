

import React, { Component, PropTypes } from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import style from '../../../styles/RoomCard/RoomCards'


class RoomCards extends Component {

  componentDidMount() {
    this.props.subscribe()
  }

  componentWillUnmount() {
    this.props.unsubscribe()
  }

  showRoomCards(rooms) {
    let roomCards = []
    for (let id in rooms) {
      if (!rooms.hasOwnProperty(id)) {
        continue
      }
      roomCards.push(<RoomCard room={rooms[id]} key={id}/>)
    }
    return roomCards
  }

  render() {
    return <div style={style.roomSelection}>
        <Navbar userAuth={this.context.userAuth} unAuth={this.context.unAuth}/>
        <div style={style.roomCards}>
          {this.showRoomCards(this.props.rooms)}
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
