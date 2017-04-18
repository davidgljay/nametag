import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import NavBar from '../Utils/NavBar'
import LoginDialog from '../User/LoginDialog'
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
      <NavBar
        me={me}
        toggleLogin={this.toggleLogin} />
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
        registerUser={this.props.registerUser}
        loginUser={this.props.loginUser}
        message='Log In or Register' />

    </div>
  }
}

RoomCards.propTypes = {
  registerUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  data: PropTypes.shape({
    me: PropTypes.shape({
      id: PropTypes.string.isRequired,
      nametags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        room: PropTypes.shape({
          id: PropTypes.string
        })
      })).isRequired
    }),
    rooms: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    )
  })
}

export default RoomCards

const styles = {
  roomCards: {
    background: '#fbfbfb',
    paddingBottom: 50,
    paddingTop: 20,
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  }
}
