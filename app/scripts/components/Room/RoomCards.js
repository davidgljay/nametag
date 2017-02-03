

import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import CreateRoom from './CreateRoom'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import Notifications from '../Room/Notifications'
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

  componentDidMount() {
    trackEvent('ROOMS_PAGE_LOAD')
    const {getAuth, watchUserNametags, watchNametag} = this.props
    this.props.subscribe()
    getAuth().then((user) => {
      return watchUserNametags(user.id)
    }).then((userNametags) => {
      for (let i = 0; i < userNametags.length; i++ ) {
        watchNametag(userNametags[i].nametag)
      }
    })
  }

  componentWillUnmount() {
    this.props.unsubscribe()
    this.props.unWatchUserNametags()
  }

  getChildContext() {
    return {
      user: this.props.user,
    }
  }

  mapRoomCards = (roomId) => {
    const {rooms, nametags, userNametags, addUserNametag, nametagEdits} = this.props

    // If a nametag has already been saved for this room then merge it in
    const nametag = userNametags[roomId]
    ? {...nametags[userNametags[roomId].nametag], ...nametagEdits[roomId]}
    : nametagEdits[roomId]
    return <RoomCard
      room={rooms[roomId]}
      id={roomId}
      key={roomId}
      style={styles.roomCard}
      nametag={nametag}
      addUserNametag={addUserNametag}/>
  }

  render() {
    const {user, logout, setting, rooms, providerAuth, userNametags} = this.props
    return <div>
        <Navbar
          user={user}
          logout={logout}
          setting={setting}/>
        <div style={styles.roomCards}>
          {
            userNametags &&
            <Notifications userNametags={userNametags} rooms={rooms} homepage={true}/>
          }
          {Object.keys(rooms)
            .filter((r) => !userNametags[r])
            .map(this.mapRoomCards)}
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
