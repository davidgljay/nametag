import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import CreateRoomForms from './Create/CreateRoomForms'
import Stepper from './Create/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import {indigo500} from 'material-ui/styles/colors'

class CreateRoom extends Component {

  constructor(props) {
    super(props)
    this.state = {
      room: {},
      hostNametag: {
        certificates: [],
      },
      image: '',
      norms: {},
      newRoom: false,
      finsihed: false,
      stepIndex: 0,
    }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.updateRoom = this.updateRoom.bind(this)
    this.updateNametag = this.updateNametag.bind(this)
    this.addNametagCert = this.addNametagCert.bind(this)
    this.removeNametagCert = this.removeNametagCert.bind(this)
    this.updateRoom = this.updateRoom.bind(this)
    this.addNorm = this.addNorm.bind(this)
    this.removeNorm = this.removeNorm.bind(this)
    this.postRoom = this.postRoom.bind(this)
  }

  static propTypes = {
    searchImage: PropTypes.func.isRequired,
    postRoom: PropTypes.func.isRequired,
    joinRoom: PropTypes.func.isRequired,
    watchNametag: PropTypes.func.isRequired,
    unWatchNametag: PropTypes.func.isRequired,
    setRoomProp: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    fetchCertificate: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    user: PropTypes.object,
  }

  getChildContext() {
    return {
      user: this.props.user,
    }
  }

  handleNext() {
    this.setState((prevState) => {
      prevState.stepIndex ++
      prevState.finished = prevState.stepIndex > 3
      return prevState
    })
  }

  handlePrev() {
    this.setState((prevState) => {
      if (prevState.stepIndex > 0) {
        prevState.stepIndex --
      }
      return prevState
    })
  }

  updateNametag(room, prop, val) {
    this.setState((prevState) => {
      prevState.hostNametag[prop] = val
      return prevState
    })
  }

  addNametagCert(cert) {
    this.setState((prevState) => {
      prevState.hostNametag.certificates.push(cert)
      return prevState
    })
  }

  addNorm(norm, key) {
    this.setState((prev) => {
      prev.norms[key] = norm
      prev.room.norms = Object.keys(prev.norms).map((k) => prev.norms[k])
      return prev
    })
  }

  removeNorm(key) {
    this.setState((prev) => {
      delete prev.norms[key]
      prev.room.norms = Object.keys(prev.norms).map((k) => prev.norms[k])
      return prev
    })
  }

  removeNametagCert(certId) {
    this.setState((prevState) => {
      let certs = prevState.hostNametag.certificates
      for (let i = 0; i < certs.length; i++) {
        if (certs[i].id === certId) {
          certs = certs.slice(0, i).concat(certs.slice(i + 1, certs.length))
        }
      }
      return prevState
    })
  }

  postRoom() {
    let id
    this.props.postRoom(this.state.room)
      .then((roomId) => {
        id = roomId
        return this.props.joinRoom(roomId, this.state.hostNametag, this.props.user.id)
      })
      .then((nametagId) => {
        return this.props.updateRoom(id, 'mod', nametagId)
      })
      .then(() => {
        window.location = '/#/'
      })
  }

  updateRoom(prop, val) {
    this.setState((prevState) => {
      prevState.room[prop] = val
      return prevState
    })
  }

  render() {
    const {user, logout} = this.props
    const {room, stepIndex} = this.state
    return <div>
      <Navbar user={user} logout={logout}/>
        <div style={styles.title}>
          <h1>Start a Conversation</h1>
          <Stepper stepIndex={stepIndex}/>
        </div>
        <div style={styles.roomPreview}>
          <RoomCard
            room={room}
            id={'new'}
            style={styles.previewCard}
            creating={true}
            hostNametag={this.state.hostNametag}/>
        </div>
        <div style={styles.createRoom}>
          <CreateRoomForms
            stepIndex={this.state.stepIndex}
            updateNametag={this.updateNametag}
            room={this.state.room}
            hostNametag={this.state.hostNametag}
            updateRoom={this.updateRoom}
            searchImage={this.props.searchImage}
            addNametagCert={this.addNametagCert}
            removeNametagCert={this.removeNametagCert}
            updateNametag={this.updateNametag}
            fetchCertificate={this.props.fetchCertificate}
            addNorm={this.addNorm}
            norms={this.state.norms}
            removeNorm={this.removeNorm}/>
          <div>
            {
              this.state.stepIndex > 0 &&
              <RaisedButton
                style={styles.button}
                backgroundColor={indigo500}
                onClick={this.handlePrev}>
                BACK
              </RaisedButton>
            }
            {
              this.state.stepIndex >= 4 ?
              <RaisedButton
                style={styles.button}
                backgroundColor={indigo500}
                onClick={this.postRoom}>
                PUBLISH
              </RaisedButton>
              : <RaisedButton
                style={styles.button}
                backgroundColor={indigo500}
                onClick={this.handleNext}>
                NEXT
              </RaisedButton>
            }

        </div>

        </div>
    </div>
  }
}

export default CreateRoom

const styles = {
  createRoom: {
    textAlign: 'center',
  },
  title: {
    margin: 40,
  },
  roomPreview: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'left',
  },
  previewCard: {
    margin: 0,
  },
  button: {
    color: '#fff',
    margin: 20,
  },

}
