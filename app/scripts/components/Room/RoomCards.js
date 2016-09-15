

import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import {subscribe, unsubscribe} from '../../actions/RoomActions'
import style from '../../../styles/RoomCard/RoomCards.css'


class RoomCards extends Component {

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

  showRoomCards(rooms) {
    let roomCards = []
    for (let id in rooms) {
      if (!rooms.hasOwnProperty(id)) {
        continue
      }
      roomCards.push(
        <RoomCard
          room={rooms[id]}
          id={id}
          key={id}
          getUserNametag={this.props.getUserNametag}/>
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

RoomCards.childContextTypes = {
  user: PropTypes.object,
}

RoomCards.contextTypes = {
  dispatch: PropTypes.func,
}

export default RoomCards
