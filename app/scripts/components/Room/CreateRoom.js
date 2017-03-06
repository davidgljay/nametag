import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import CreateRoomForms from './Create/CreateRoomForms'
import Stepper from './Create/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import {indigo500} from 'material-ui/styles/colors'

class CreateRoom extends Component {

  constructor (props) {
    super(props)

    this.state = {
      room: {
        title: '',
        description: '',
        closedAt: 86400000 * 2 + Date.now()
      },
      hostNametag: {
        name: '',
        bio: '',
        badges: []
      },
      closedIn: {
        unit: 'Days',
        quantity: 2
      },
      image: '',
      norms: {},
      newRoom: false,
      finsihed: false,
      stepIndex: 0
    }

    this.handleNext = () => {
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

    this.handlePrev = () => {
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

    this.updateNametag = (room, prop, val) => {
      this.setState((prevState) => {
        prevState.hostNametag[prop] = val
        return prevState
      })
    }

    this.setClosed = (type, unit) => {
      this.setState((prevState) => {
        prevState.closedIn[type] = unit
        let unitTime
        switch (prevState.closedIn.unit) {
          case 'Hours':
            unitTime = 3600000
            break
          case 'Days':
            unitTime = 86400000
            break
          default:
            unitTime = 0
        }
        const closedAt = Date.now() + prevState.closedIn.quantity * unitTime
        prevState.room.closedAt = closedAt
        return prevState
      })
    }

    this.addNametagBadge = (badge) => {
      this.setState((prevState) => {
        prevState.hostNametag.badges.push(badge)
        return prevState
      })
    }

    this.addNorm = (norm, key) => {
      this.setState((prev) => {
        prev.norms[key] = norm
        prev.room.norms = Object.keys(prev.norms).map((k) => prev.norms[k])
        return prev
      })
    }

    this.removeNorm = (key) => {
      this.setState((prev) => {
        delete prev.norms[key]
        prev.room.norms = Object.keys(prev.norms).map((k) => prev.norms[k])
        return prev
      })
    }

    this.removeNametagBadge = (badgeId) => {
      this.setState((prevState) => ({
        ...prevState,
        hostNametag: {
          ...prevState.hostNametag,
          badges: prevState.hostNametag.badges.filter((b) => b.id !== badgeId)
        }
      })
      )
    }

    this.postRoom = () => {
      let id
      const {room, hostNametag} = this.state
      this.props.postRoom(room)
        .then((roomId) => {
          id = roomId
          return this.props.joinRoom(
            roomId,
            {...hostNametag, room: roomId},
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

    this.updateRoom = (prop, val) => {
      this.setState((prevState) => {
        prevState.room[prop] = val
        return prevState
      })
    }

    this.validate = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return {
            valid: this.state.room.title && this.state.room.description,
            error: {
              titleError: this.state.room.title ? '' : 'Please add a title',
              descriptionError: this.state.room.description ? '' : 'Please add a description'
            }
          }
        case 1:
          return {
            valid: this.state.room.image,
            error: this.state.room.image ? '' : 'Please provide an image'
          }
        case 2:
          return {
            valid: this.state.hostNametag.name && this.state.hostNametag.bio,
            error: {
              nameError: this.state.hostNametag.name ? '' : 'Please choose a name for this room',
              bioError: this.state.hostNametag.bio ? '' : 'Please provide a brief bio'
            }
          }
        case 3:
          return {
            valid: this.state.room.norms && this.state.room.norms.length > 0,
            error: this.state.room.norms && this.state.room.norms.length > 0 ? ''
            : 'Please select at least one norm'
          }
        default:
          return {
            valid: true,
            error: ''
          }
      }
    }
  }

  componentDidMount () {
    const {getUser, fetchBadges} = this.props
    getUser().then(user => fetchBadges(user.data.badges))
  }
  
  render () {
    const {user, logout, setting} = this.props
    const {room, stepIndex} = this.state
    return <div>
      <Navbar user={user} logout={logout} setting={setting} />
      <div style={styles.title}>
        <h1>Start a Conversation</h1>
        <Stepper stepIndex={stepIndex} />
      </div>
      <div style={styles.roomPreview}>
        <RoomCard
          room={room}
          id={'new'}
          style={styles.previewCard}
          creating
          flipped={stepIndex === 3}
          hostNametag={this.state.hostNametag} />
      </div>
      <div style={styles.createRoom}>
        <CreateRoomForms
          stepIndex={this.state.stepIndex}
          updateNametag={this.updateNametag}
          room={this.state.room}
          hostNametag={this.state.hostNametag}
          updateRoom={this.updateRoom}
          searchImage={this.props.searchImage}
          appendUserArray={this.props.appendUserArray}
          setImageFromUrl={this.props.setImageFromUrl}
          addNametagBadge={this.addNametagBadge}
          removeNametagBadge={this.removeNametagBadge}
          addNorm={this.addNorm}
          norms={this.state.norms}
          setClosed={this.setClosed}
          closedIn={this.state.closedIn}
          removeNorm={this.removeNorm}
          user={this.props.user}
          error={this.state.error} />
        <div>
          {
              this.state.stepIndex > 0 &&
              <RaisedButton
                style={styles.button}
                labelStyle={styles.buttonLabel}
                backgroundColor={indigo500}
                onClick={this.handlePrev}
                label='BACK' />
            }
          {
              this.state.stepIndex >= 4
              ? <RaisedButton
                style={styles.button}
                labelStyle={styles.buttonLabel}
                backgroundColor={indigo500}
                onClick={this.postRoom}
                label='PUBLISH' />
              : <RaisedButton
                style={styles.button}
                labelStyle={styles.buttonLabel}
                backgroundColor={indigo500}
                onClick={this.handleNext}
                label='NEXT' />
            }

        </div>

      </div>
    </div>
  }
}

CreateRoom.propTypes = {
  getUser: PropTypes.func.isRequired,
  fetchBadges: PropTypes.func.isRequired,
  searchImage: PropTypes.func.isRequired,
  postRoom: PropTypes.func.isRequired,
  joinRoom: PropTypes.func.isRequired,
  setRoomProp: PropTypes.func.isRequired,
  setImageFromUrl: PropTypes.func.isRequired,
  appendUserArray: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  setting: PropTypes.func.isRequired
}

CreateRoom.childContextTypes = {
  user: PropTypes.object
}

export default CreateRoom

const styles = {
  createRoom: {
    textAlign: 'center'
  },
  title: {
    margin: 40
  },
  roomPreview: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'left'
  },
  previewCard: {
    margin: 0
  },
  buttonLabel: {
    color: '#fff',
    margin: 20
  },
  button: {
    margin: 20
  }
}
