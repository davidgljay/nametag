import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import Notifications from '../Room/Notifications'
import {lightBlue200} from 'material-ui/styles/colors'

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
        hash[nametag.room.id] = nametag
        return hash
      }, {})
    }
    return <div>
      <Navbar
        me={me}
        toggleLogin={this.toggleLogin} />
      <div style={styles.roomCards}>
        {
          me &&
          <Notifications nametags={me.nametags} homepage />
        }
        {
          !loading && rooms
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
        toggleLogin={this.toggleLogin} />

    </div>
  }
}

RoomCards.propTypes = {
  data: PropTypes.shape({
    me: PropTypes.shape({
      id: PropTypes.string.isRequired,
      nametags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        room: PropTypes.shape({
          id: PropTypes.string.isRequired
        }).isRequired
      })).isRequired
    }),
    rooms: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    )
  }).isRequired
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
