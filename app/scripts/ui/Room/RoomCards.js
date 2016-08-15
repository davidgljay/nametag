

import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import {subscribe, unsubscribe} from '../../actions/RoomActions'
import style from '../../../styles/RoomCard/RoomCards.css'


class RoomCards extends Component {

  componentDidMount() {
    this.props.dispatch(subscribe())
  }

  componentWillUnmount() {
    this.props.dispatch(unsubscribe())
  }

  showRoomCards(rooms) {
    let roomCards = []
    for (let id in rooms) {
      if (!rooms.hasOwnProperty(id)) {
        continue
      }
      roomCards.push(
        <RoomCard room={rooms[id]} id={id} key={id} dispatch={this.props.dispatch}/>
      )
    }
    return roomCards
  }

  render() {
    return <div id={style.roomSelection}>
        <Navbar user={this.props.user} dispatch={this.props.dispatch}/>
        <div id={style.roomCards}>
          {this.showRoomCards(this.props.rooms)}
        </div>
      </div>
  }
}

RoomCards.propTypes = {
  dispatch: PropTypes.func.isRequired,
  rooms: PropTypes.object.isRequired,
  user: PropTypes.object,
}

export default RoomCards
