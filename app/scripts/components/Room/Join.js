import React, { Component, PropTypes } from 'react'
import Login from '../User/Login'
import EditNametag from '../Nametag/EditNametag'
import UserCertificates from '../Certificate/UserCertificates'
import {grey400, indigo500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'
import Alert from '../Utils/Alert'

class Join extends Component {

  constructor (props) {
    super(props)

    this.state = {alert: null}

    this.propTypes = {
      room: PropTypes.string.isRequired,
      normsChecked: PropTypes.bool.isRequired,
      nametag: PropTypes.object,
      addNametagEditCert: PropTypes.func.isRequired,
      removeNametagEditCert: PropTypes.func.isRequired,
      updateNametagEdit: PropTypes.func.isRequired,
      providerAuth: PropTypes.func.isRequired,
      fetchCertificate: PropTypes.func.isRequired,
      joinRoom: PropTypes.func.isRequired
    }

    this.contextTypes = {
      user: PropTypes.object
    }

    this.onJoinClick = () => {
      const {room, nametag, joinRoom, normsChecked} = this.props
      // TODO: Add new user name to displayNames list.
      if (normsChecked) {
        joinRoom(room, nametag, this.context.user.id)
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
      appendUserArray,
      removeNametagEditCert,
      addNametagEditCert,
      updateNametagEdit,
      room,
      fetchCertificate,
      providerAuth
    } = this.props
    if (this.context.user.id) {
      join =
        <div style={styles.join}>
          <h4>Edit Your Nametag For This Conversation</h4>
          <EditNametag
            userNametag={nametag}
            userDefaults={this.context.user.data}
            appendUserArray={appendUserArray}
            addNametagEditCert={addNametagEditCert}
            removeNametagEditCert={removeNametagEditCert}
            updateNametagEdit={updateNametagEdit}
            room={room} />
          <div style={styles.userCertificates}>
            <p style={styles.userCertificateText}>
              <FontIcon
                style={styles.userCertificateIcon}
                className='material-icons'>arrow_upward</FontIcon>
              Drag to Share
              <FontIcon
                style={styles.userCertificateIcon}
                className='material-icons'>arrow_upward</FontIcon>
            </p>
            <UserCertificates
              fetchCertificate={fetchCertificate}
              selectedCerts={nametag && nametag.certificates} />
          </div>
          <br />
          <Alert alert={this.state.alert} />
          <RaisedButton
            backgroundColor={indigo500}
            labelStyle={styles.button}
            onClick={this.onJoinClick}
            label='JOIN' />
        </div>
    } else {
      join = <Login providerAuth={providerAuth} />
    }
    return join
  }
}

export default Join

const styles = {
  join: {
    textAlign: 'center'
  },
  userCertificates: {
    width: 240,
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 100,
    verticalAlign: 'top',
    justifyContent: 'center',
    padding: 5,
    margin: 5
  },
  userCertificateText: {
    fontStyle: 'italic',
    fontSize: 16,
    color: grey400
  },
  userCertificateIcon: {
    color: grey400,
    fontSize: 18,
    verticalAlign: 'middle'
  },
  button: {
    color: '#fff',
    fontWeight: 'bold'
  }
}
