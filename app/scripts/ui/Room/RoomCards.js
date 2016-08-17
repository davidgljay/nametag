

import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import {subscribe, unsubscribe} from '../../actions/RoomActions'
import style from '../../../styles/RoomCard/RoomCards.css'


class RoomCards extends Component {

  componentDidMount() {
    this.context.dispatch(subscribe())
  }

  componentWillUnmount() {
    this.context.dispatch(unsubscribe())
  }

  showRoomCards(rooms) {
    let roomCards = []
    for (let id in rooms) {
      if (!rooms.hasOwnProperty(id)) {
        continue
      }
      roomCards.push(
        <RoomCard
          room={rooms[id]}
          id={id} key={id}/>
      )
    }
    return roomCards
  }

  render() {
    return <div id={style.roomSelection}>
        <Navbar user={this.context.user} dispatch={this.context.dispatch}/>
        <div id={style.roomCards}>
          {this.showRoomCards(this.props.rooms)}
        </div>
      </div>
  }
}

RoomCards.propTypes = {
  rooms: PropTypes.object.isRequired,
}

RoomCards.contextTypes = {
  user: React.PropTypes.object,
  dispatch: React.PropTypes.func,
}

export default RoomCards
