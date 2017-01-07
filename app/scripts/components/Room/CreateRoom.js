import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import CreateRoomForms from './Create/CreateRoomForms'
import Stepper from './Create/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import {indigo500} from 'material-ui/styles/colors'

class CreateRoom extends Component {

  state = {
    room: {
      title: '',
      description: '',
    },
    hostNametag: {
      certificates: [],
    },
    image: '',
    norms: {},
    newRoom: false,
    finsihed: false,
    stepIndex: 0,
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

  getChildContext = () => {
    return {
      user: this.props.user,
    }
  }

  handleNext = () => {
    const validation = this.validate(this.state.stepIndex)
    if (validation.valid) {
      this.setState((prevState) => {
        delete prevState.error
        prevState.stepIndex ++
        prevState.finished = prevState.stepIndex > 3
        return prevState
      })
    } else {
      this.setState({error: validation.error})
    }
  }

  handlePrev= () => {
    const validation = this.validate(this.state.stepIndex)
    if (validation.valid) {
      this.setState((prevState) => {
        delete prevState.error
        if (prevState.stepIndex > 0) {
          prevState.stepIndex --
        }
        return prevState
      })
    } else {
      this.setState({error: validation.error})
    }
  }

  updateNametag = (room, prop, val) => {
    this.setState((prevState) => {
      prevState.hostNametag[prop] = val
      return prevState
    })
  }

  addNametagCert = (cert) => {
    this.setState((prevState) => {
      prevState.hostNametag.certificates.push(cert)
      return prevState
    })
  }

  addNorm = (norm, key) => {
    this.setState((prev) => {
      prev.norms[key] = norm
      prev.room.norms = Object.keys(prev.norms).map((k) => prev.norms[k])
      return prev
    })
  }

  removeNorm = (key) => {
    this.setState((prev) => {
      delete prev.norms[key]
      prev.room.norms = Object.keys(prev.norms).map((k) => prev.norms[k])
      return prev
    })
  }

  removeNametagCert = (certId) => {
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

  postRoom = () => {
    let id
    this.props.postRoom(this.state. room)
      .then((roomId) => {
        id = roomId
        return this.props.joinRoom(
          roomId,
          {...this.state.hostNametag, room: roomId},
          this.props.user.id
        )
      })
      .then((nametagId) => {
        return this.props.updateRoom(id, 'mod', nametagId)
      })
      .then(() => {
        window.location = '/rooms'
      })
  }

  updateRoom = (prop, val) => {
    this.setState((prevState) => {
      prevState.room[prop] = val
      return prevState
    })
  }

  validate = (stepIndex) => {
    switch (stepIndex) {
    case 0:
      return {
        valid: this.state.room.title && this.state.room.description ? true : false,
        error: {
          titleError: this.state.room.title ? '' : 'Please add a title',
          descriptionError: this.state.room.description ? '' : 'Please add a description',
        },
      }
    case 1:
      return {
        valid: this.state.room.image ? true : false,
        error: this.state.room.image ? '' : 'Please provide an image',
      }
    case 2:
      return {
        valid: this.state.hostNametag.name && this.state.hostNametag.bio ? true : false,
        error: {
          nameError: this.state.hostNametag.name ? '' : 'Please choose a name for this room',
          bioError: this.state.hostNametag.bio ? '' : 'Please provide a brief bio',
        },
      }
    case 3:
      return {
        valid: this.state.room.norms && this.state.room.norms.length > 0 ? true : false,
        error: this.state.room.norms && this.state.room.norms.length > 0 ? '' :
          'Please select at least one norm',
      }
    default:
      return {
        valid: true,
        error: '',
      }
    }
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
            flipped={stepIndex === 3}
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
            setImageFromUrl={this.props.setImageFromUrl}
            addNametagCert={this.addNametagCert}
            removeNametagCert={this.removeNametagCert}
            updateNametag={this.updateNametag}
            fetchCertificate={this.props.fetchCertificate}
            addNorm={this.addNorm}
            norms={this.state.norms}
            removeNorm={this.removeNorm}
            user={this.props.user}
            error={this.state.error}/>
          <div>
            {
              this.state.stepIndex > 0 &&
              <RaisedButton
                style={styles.button}
                labelStyle={styles.buttonLabel}
                backgroundColor={indigo500}
                onClick={this.handlePrev}
                label='BACK'/>
            }
            {
              this.state.stepIndex >= 4 ?
              <RaisedButton
                style={styles.button}
                labelStyle={styles.buttonLabel}
                backgroundColor={indigo500}
                onClick={this.postRoom}
                label='PUBLISH'/>
              : <RaisedButton
                style={styles.button}
                labelStyle={styles.buttonLabel}
                backgroundColor={indigo500}
                onClick={this.handleNext}
                label='NEXT'/>
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
  buttonLabel: {
    color: '#fff',
    margin: 20,
  },
  button: {
    margin: 20,
  }

}
