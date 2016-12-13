import React, { Component, PropTypes } from 'react'
import Login  from '../User/Login'
import EditNametag  from '../Nametag/EditNametag'
import UserCertificates  from '../Certificate/UserCertificates'
import {grey400, indigo500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
  join: {
    textAlign: 'center',
  },
  userCertificates: {
    width: 270,
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 100,
    verticalAlign: 'top',
    padding: 5,
    margin: 5,
  },
  userCertificateText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: grey400,
  },
  button: {
    color: '#fff',
    fontWeight: 'bold',
  },
}

class Join extends Component {

  static propTypes = {
    room: PropTypes.string.isRequired,
    normsChecked: PropTypes.bool.isRequired,
    userNametag: PropTypes.object,
    addUserNametagCert: PropTypes.func.isRequired,
    removeUserNametagCert: PropTypes.func.isRequired,
    updateUserNametag: PropTypes.func.isRequired,
    providerAuth: PropTypes.func.isRequired,
    fetchCertificate: PropTypes.func.isRequired,
    joinRoom: PropTypes.func.isRequired,
  }

  static contextTypes = {
    user: PropTypes.object,
  }

  onJoinClick() {
    // TODO: Add new user name to displayNames list.
    this.props.joinRoom(this.props.room, this.props.userNametag, this.context.user.id)
      .then(() => {
        window.location = `/rooms/${this.props.room}`
      })
  }

  render() {
    let join
    if (this.context.user.id) {
      join =
        <div style={styles.join}>
          <h4>Write Your Nametag For This Conversation</h4>
          <EditNametag
            userNametag={this.props.userNametag}
            userDefaults={this.context.user.data}
            appendUserArray={this.props.appendUserArray}
            addUserNametagCert={this.props.addUserNametagCert}
            removeUserNametagCert={this.props.removeUserNametagCert}
            updateUserNametag={this.props.updateUserNametag}
            room={this.props.room}/>
          <div style={styles.userCertificates}>
            <p style={styles.userCertificateText}>
              Click to view your certificates.<br/>
              Drag them over to show them in this conversation.
            </p>
            <UserCertificates
              fetchCertificate={this.props.fetchCertificate}
              selectedCerts={this.props.userNametag.certificates}/>
          </div>
          <br/>
          <RaisedButton
            backgroundColor={indigo500}
            labelStyle={styles.button}
            onClick={this.onJoinClick.bind(this)}
            label='JOIN'/>
        </div>
    } else {
      join = <Login providerAuth={this.props.providerAuth}/>
    }
    return join
  }
}

export default Join
