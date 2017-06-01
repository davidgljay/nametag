import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import SearchBar from './SearchBar'
import Notifications from '../Room/Notifications'

class RoomCards extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showLogin: false
    }

    this.toggleLogin = () => {
      this.setState({showLogin: !this.state.showLogin})
    }
  }

  componentWillMount () {
    const postAuth = window.sessionStorage.getItem('postAuth')
    if (postAuth) {
      window.sessionStorage.removeItem('postAuth')
      window.location = postAuth
    }
  }

  render () {
    const {
      data: {me, rooms, loading},
      updateNametagEdit,
      search,
      addNametagEditBadge,
      removeNametagEditBadge,
      nametagEdits,
      createNametag
    } = this.props
    let nametagHash = {}
    if (me) {
      nametagHash = me.nametags.reduce((hash, nametag) => {
        if (!nametag.room) {
          return hash
        }
        hash[nametag.room.id] = nametag
        return hash
      }, {})
    }
    return <div>
      <Navbar
        me={me}
        toggleLogin={this.toggleLogin} />
      <div style={styles.background}>
        <SearchBar
          search={search} />
        <div style={styles.roomCards}>
          {
            me &&
            <Notifications nametags={me.nametags} homepage />
          }
          {
            !loading &&
            rooms &&
            rooms.length > 0 &&
            rooms
            .filter(room => !nametagHash[room.id])
            .map(room =>
              <RoomCard
                key={room.id}
                room={room}
                me={me}
                nametagEdits={nametagEdits}
                createNametag={createNametag}
                updateNametagEdit={updateNametagEdit}
                addNametagEditBadge={addNametagEditBadge}
                removeNametagEditBadge={removeNametagEditBadge} />
            )
          }
        </div>
        <LoginDialog
          showLogin={this.state.showLogin}
          toggleLogin={this.toggleLogin}
          message='Log In or Register' />
      </div>
    </div>
  }
}

const {string, arrayOf, shape} = PropTypes

RoomCards.propTypes = {
  data: shape({
    me: shape({
      id: string.isRequired,
      nametags: arrayOf(shape({
        id: string.isRequired,
        room: shape({
          id: string
        })
      })).isRequired
    }),
    rooms: arrayOf(
      shape({
        id: string.isRequired
      }).isRequired
    )
  })
}

export default RoomCards

const styles = {
  background: {
    background: '#fbfbfb',
    paddingTop: 30
  },
  roomCards: {
    paddingBottom: 50,
    paddingTop: 20,
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  }
}
