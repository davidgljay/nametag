import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import Notifications from '../Room/Notifications'
import {lightBlue200} from 'material-ui/styles/colors'
import trackEvent from '../../utils/analytics'

class RoomCards extends Component {

  constructor (props) {
    super(props)

    this.mapRoomCards = (roomId) => {
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
        addUserNametag={addUserNametag} />
    }
  }

  componentDidMount () {
    trackEvent('ROOMS_PAGE_LOAD')
    const {getAuth, watchUserNametags, watchNametags, fetchBadges, subscribe} = this.props
    subscribe()
    getAuth()
      .then((user) => user &&
        Promise.all([
          watchUserNametags(user.id),
          fetchBadges(user.data.badges || [])
        ])
      )
      .then((res) => {
        if (res) {
          watchNametags(res[0].map((nt) => nt.nametag))
        }
      })
  }

  componentWillUnmount () {
    const {unsubscribe, unWatchNametags, unWatchUserNametags} = this.props
    unsubscribe()
    unWatchUserNametags()
    unWatchNametags()
  }

  getChildContext () {
    return {
      user: this.props.user
    }
  }

  render () {
    const {user, logout, setting, rooms, providerAuth, userNametags} = this.props
    return <div>
      <Navbar
        user={user}
        logout={logout}
        setting={setting} />
      <div style={styles.roomCards}>
        {
          userNametags &&
          <Notifications userNametags={userNametags} rooms={rooms} homepage />
        }
        {Object.keys(rooms)
          .filter((r) => !userNametags[r])
          .map(this.mapRoomCards)}
      </div>
      <LoginDialog
        showLogin={user.showLogin}
        setting={setting}
        providerAuth={providerAuth} />
    </div>
  }
}

RoomCards.propTypes = {
  rooms: PropTypes.object.isRequired
}

RoomCards.childContextTypes = {
  user: PropTypes.object
}

RoomCards.contextTypes = {
  dispatch: PropTypes.func
}

export default RoomCards

const styles = {
  roomCards: {
    background: lightBlue200,
    paddingBottom: 50,
    paddingTop: 20,
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  }
}
