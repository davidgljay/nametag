import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import CreateRoomForms from './Create/CreateRoomForms'
import CircularProgress from 'material-ui/CircularProgress'
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
        image: '',
        closedAt: new Date(86400000 * 2 + Date.now()).toISOString()
      },
      closedIn: {
        unit: 'Days',
        quantity: 2
      },
      image: '',
      norms: {},
      error: '',
      newRoom: false,
      finished: false,
      stepIndex: 0,
      showLogin: false
    }

    this.handleNext = () => {
      const validation = this.validate(this.state.stepIndex)
      if (validation.valid) {
        this.setState((prevState) => {
          prevState.error = ''
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
        const closedAt = new Date(Date.now() + prevState.closedIn.quantity * unitTime).toISOString()
        prevState.room.closedAt = closedAt
        return prevState
      })
    }

    this.addNorm = (norm, key) => {
      this.setState((prev) => {
        prev.norms[key] = norm
        prev.room.norms = Object.keys(prev.norms).map(k => prev.norms[k])
        return prev
      })
    }

    this.removeNorm = (key) => {
      this.setState((prev) => {
        delete prev.norms[key]
        prev.room.norms = Object.keys(prev.norms).map(k => prev.norms[k])
        return prev
      })
    }

    this.createRoom = () => {
      const {room, nametagEdits} = this.state
      this.props.createRoom({
        ...room,
        mod: this.props.nametagEdits.new
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
            valid: this.props.nametagEdits.new.name && this.props.nametagEdits.new.bio,
            error: {
              nameError: this.props.nametagEdits.new.name ? '' : 'Please choose a name for this room',
              bioError: this.props.nametagEdits.new.bio ? '' : 'Please provide a brief bio'
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
    this.props.updateNametagEdit('new', 'icon', '')
    this.props.updateNametagEdit('new', 'name', '')
    this.props.updateNametagEdit('new', 'bio', '')
    this.props.updateNametagEdit('new', 'badges', [])
  }

  render () {
    const {
      data,
      searchImage,
      setImageFromUrl,
      nametagEdits,
      updateNametagEdit,
      addNametagEditBadge,
      removeNametagEditBadge
    } = this.props
    const {me, loading} = data
    if (!me && !loading) {
      window.location = '/'
      return null
    }
    const {room, stepIndex} = this.state
    return !loading
    ? <div>
      <Navbar
        user={me}
        toggleLogin={() => {}} />
      <div style={styles.title}>
        <h1>Start a Conversation</h1>
        <Stepper stepIndex={stepIndex} />
      </div>
      <div style={styles.roomPreview}>
        <RoomCard
          room={{
            ...room,
            id: 'new',
            mod: {
              ...nametagEdits.new,
              id: 'newMod'
            }
          }}
          style={styles.previewCard}
          creating
          flipped={stepIndex === 3}
          nametagEdits={nametagEdits}
          updateNametagEdit={updateNametagEdit}
          addNametagEditBadge={addNametagEditBadge}
          removeNametagEditBadge={removeNametagEditBadge} />
      </div>
      <div style={styles.createRoom}>
        <CreateRoomForms
          stepIndex={this.state.stepIndex}
          updateNametagEdit={updateNametagEdit}
          room={this.state.room}
          nametagEdits={nametagEdits}
          updateRoom={this.updateRoom}
          searchImage={searchImage}
          setImageFromUrl={setImageFromUrl}
          addNametagEditBadge={addNametagEditBadge}
          removeNametagEditBadge={removeNametagEditBadge}
          addNorm={this.addNorm}
          norms={this.state.norms}
          setClosed={this.setClosed}
          closedIn={this.state.closedIn}
          removeNorm={this.removeNorm}
          me={me}
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
              onClick={this.createRoom}
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
    : <div style={styles.spinner}>
      <CircularProgress />
    </div>
  }
}

CreateRoom.propTypes = {
  searchImage: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,
  setImageFromUrl: PropTypes.func.isRequired,
  nametagEdits: PropTypes.object.isRequired,
  data: PropTypes.shape({
    me: PropTypes.shape({
      badges: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        notes: PropTypes.arrayOf(PropTypes.shape({
          text: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired
        })).isRequired
      })).isRequired
    })
  }).isRequired
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
  },
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  }
}
