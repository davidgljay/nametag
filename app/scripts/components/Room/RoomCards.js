

import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import {subscribe, unsubscribe} from '../../actions/RoomActions'
import style from '../../../styles/RoomCard/RoomCards.css'


class RoomCards extends Component {

  constructor(props) {
    super(props)
    this.mapRoomCards = this.mapRoomCards.bind(this)
  }

  componentDidMount() {
    this.props.subscribe()
  }

  componentWillUnmount() {
    this.props.unsubscribe()
  }

  getChildContext() {
    return {
      user: this.props.user,
    }
  }

  mapRoomCards(roomId) {
    let room = this.props.rooms[roomId]
    return <RoomCard
      room={room}
      id={roomId}
      key={roomId}
      userNametag={this.props.userNametags[roomId]}
      addUserNametag={this.props.addUserNametag}
      getUserNametag={this.props.getUserNametag}
      watchNametag={this.props.watchNametag}
      unWatchNametag={this.props.unWatchNametag}/>
  }

  render() {
    return <div id={style.roomSelection}>
        <Navbar user={this.context.user} dispatch={this.context.dispatch}/>
        <div id={style.roomCards}>
          {Object.keys(this.props.rooms).map(this.mapRoomCards)}
        </div>
      </div>
  }
}

RoomCards.propTypes = {
  rooms: PropTypes.object.isRequired,
}

RoomCards.childContextTypes = {
  user: PropTypes.object,
}

RoomCards.contextTypes = {
  dispatch: PropTypes.func,
}

export default RoomCards
