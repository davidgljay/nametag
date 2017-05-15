import React, { Component, PropTypes } from 'react'
import Login from '../../containers/User/LoginContainer'
import EditNametag from '../Nametag/EditNametag'
import UserBadges from '../Badge/UserBadges'
import RaisedButton from 'material-ui/RaisedButton'
import Alert from '../Utils/Alert'
import {grey} from '../../../styles/colors'

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
      room,
      templates,
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
              requiredTemplates={templates}
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
            primary
            labelStyle={styles.button}
            onClick={this.onJoinClick}
            label='JOIN' />
        </div>
    } else {
      join = <Login />
    }
    return join
  }
}

const {string, bool, object, func, arrayOf} = PropTypes

Join.propTypes = {
  room: string.isRequired,
  normsChecked: bool.isRequired,
  nametag: object,
  addNametagEditBadge: func.isRequired,
  removeNametagEditBadge: func.isRequired,
  updateNametagEdit: func.isRequired,
  templates: arrayOf(string).isRequired
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
    color: grey
  },
  userBadgeIcon: {
    color: grey,
    fontSize: 18,
    verticalAlign: 'middle'
  },
  button: {
    color: '#fff',
    fontWeight: 'bold'
  }
}
