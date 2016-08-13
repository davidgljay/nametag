

import {Component} from 'react'
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
        <Navbar userAuth={this.context.userAuth} unAuth={this.context.unAuth}/>
        <div id={style.roomCards}>
          {this.showRoomCards(this.props.rooms)}
        </div>
      </div>
  }
}

export default RoomCards
