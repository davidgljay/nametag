import React, { Component, PropTypes } from 'react'
import Login from '../User/Login'
import EditNametag from '../Nametag/EditNametag'
import UserBadges from '../Badge/UserBadges'
import {grey400, indigo500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton'
import Alert from '../Utils/Alert'

class Join extends Component {

  constructor (props) {
    super(props)

    this.state = {alert: null}

    this.onJoinClick = () => {
      const {room, nametag, createNametag, normsChecked} = this.props
      if (normsChecked) {
        const nametagForPost = {
          ...nametag,
          badges: nametag.badges ? nametag.badges.map(badge => badge.id) : []
        }
        createNametag(nametagForPost)
          .then(() => {
            window.location = `/rooms/${room}`
          })
      } else {
        this.setState({alert: 'You must agree to this room\'s norms.'})
      }
    }
  }

  render () {
    let join
    const {
      nametag,
      removeNametagEditBadge,
      addNametagEditBadge,
      updateNametagEdit,
      loginUser,
      registerUser,
      room,
      me
    } = this.props
    if (me) {
      join =
        <div style={styles.join}>
          <h4>Edit Your Nametag For This Conversation</h4>
          {
            <EditNametag
              nametagEdit={nametag}
              me={me}
              addNametagEditBadge={addNametagEditBadge}
              removeNametagEditBadge={removeNametagEditBadge}
              updateNametagEdit={updateNametagEdit}
              room={room} />
          }
          <div style={styles.userBadges}>
            {
              <UserBadges
                selectedBadges={nametag && nametag.badges}
                badges={me.badges} />
            }
          </div>
          <br />
          <Alert alert={this.state.alert} />
          <RaisedButton
            id='joinRoomButton'
            backgroundColor={indigo500}
            labelStyle={styles.button}
            onClick={this.onJoinClick}
            label='JOIN' />
        </div>
    } else {
      join = <Login loginUser={loginUser} registerUser={registerUser} />
    }
    return join
  }
}

Join.propTypes = {
  room: PropTypes.string.isRequired,
  normsChecked: PropTypes.bool.isRequired,
  nametag: PropTypes.object,
  addNametagEditBadge: PropTypes.func.isRequired,
  removeNametagEditBadge: PropTypes.func.isRequired,
  updateNametagEdit: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired
}

export default Join

const styles = {
  join: {
    textAlign: 'center'
  },
  userBadges: {
    width: 240,
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 100,
    verticalAlign: 'top',
    justifyContent: 'center',
    padding: 5,
    margin: 5
  },
  userBadgeText: {
    fontStyle: 'italic',
    fontSize: 16,
    color: grey400
  },
  userBadgeIcon: {
    color: grey400,
    fontSize: 18,
    verticalAlign: 'middle'
  },
  button: {
    color: '#fff',
    fontWeight: 'bold'
  }
}
