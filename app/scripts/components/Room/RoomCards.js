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
      loginUser,
      registerUser,
      passwordResetRequest,
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
              registerUser={registerUser}
              loginUser={loginUser}
              passwordResetRequest={passwordResetRequest}
              removeNametagEditBadge={removeNametagEditBadge} />
          )
        }
      </div>
      <LoginDialog
        showLogin={this.state.showLogin}
        toggleLogin={this.toggleLogin}
        registerUser={registerUser}
        loginUser={loginUser}
        passwordResetRequest={passwordResetRequest}
        message='Log In or Register' />

    </div>
  }
}

const {func, string, arrayOf, shape} = PropTypes

RoomCards.propTypes = {
  registerUser: func.isRequired,
  loginUser: func.isRequired,
  passwordResetRequest: func.isRequired,
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
