

import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import CreateRoom from './CreateRoom'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import {subscribe, unsubscribe} from '../../actions/RoomActions'
import {lightBlue200} from 'material-ui/styles/colors'
import trackEvent from '../../utils/analytics'

const styles = {
  roomCards: {
    background: lightBlue200,
    paddingBottom: 50,
    paddingTop: 20,
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  roomCard: {
  },
}

class RoomCards extends Component {

  constructor(props) {
    super(props)
    this.mapRoomCards = this.mapRoomCards.bind(this)
  }

  componentDidMount() {
    trackEvent('ROOMS_PAGE_LOAD')
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
      style={styles.roomCard}
      userNametag={this.props.userNametags[roomId]}
      addUserNametag={this.props.addUserNametag}
      watchUserNametags={this.props.watchUserNametags}
      watchNametag={this.props.watchNametag}
      unWatchNametag={this.props.unWatchNametag}/>
  }

  render() {
    const {user, logout, setting, rooms, providerAuth} = this.props
    return <div>
        <Navbar
          user={user}
          logout={logout}
          setting={setting}/>
        <div style={styles.roomCards}>
          {Object.keys(rooms).map(this.mapRoomCards)}
        </div>
        <LoginDialog
          showLogin={user.showLogin}
          setting={setting}
          providerAuth={providerAuth}/>
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
