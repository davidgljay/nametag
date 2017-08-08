import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import CreateRoomForms from './Create/CreateRoomForms'
import CircularProgress from 'material-ui/CircularProgress'
import Stepper from './Create/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import {track} from '../../utils/analytics'

class CreateRoom extends Component {

  constructor (props) {
    super(props)

    this.state = {
      room: {
        title: '',
        description: '',
        image: '',
        closedAt: new Date(86400000 * 2 + Date.now()).toISOString(),
        templates: []
      },
      closedIn: {
        unit: 'Days',
        quantity: 2
      },
      image: '',
      norms: {},
      error: null,
      newRoom: false,
      finished: false,
      stepIndex: 0,
      showLogin: false,
      selectedBadges: []
    }

    this.handleNext = () => {
      const validation = this.validate(this.state.stepIndex)
      if (validation.valid) {
        this.setState((prevState) => {
          prevState.error = null
          prevState.stepIndex ++
          prevState.finished = prevState.stepIndex > 3
          return prevState
        })
      } else {
        this.setState({error: validation.error})
      }
    }

    this.handlePrev = () => {
      this.setState((prevState) => {
        delete prevState.error
        if (prevState.stepIndex > 0) {
          prevState.stepIndex --
        }
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
      const {room} = this.state
      const {nametagEdits} = this.props
      const roomTemplates = room.templates.map(t => t.id)
      const mod = {
        ...nametagEdits.new,
        badges: nametagEdits.new.badges.map(b => b.id)
      }
      this.props.createRoom({
        ...room,
        mod,
        templates: roomTemplates
      })
      .then(({data: {createRoom: {room: {id}}}}) => {
        window.location = `/rooms/${id}`
      })
    }

    this.updateRoom = (prop, val) => {
      this.setState((prevState) => {
        prevState.room[prop] = val
        return prevState
      })
    }

    this.addSelectedBadge = (badge) => {
      const {room: {templates}} = this.state
      const newBadge = templates.map(t => t.id).indexOf(badge.template.id) === -1
      if (newBadge) {
        this.setState({room: {...this.state.room, templates: templates.concat(badge.template)}})
      }
    }

    this.removeSelectedBadge = (templateId) => {
      this.setState(prevState => {
        const newTemplates = prevState.room.templates.filter(template => template.id !== templateId)
        return {
          ...prevState,
          room: {
            ...prevState.room,
            templates: newTemplates
          }
        }
      })
    }

    this.validate = (stepIndex) => {
      const {room} = this.state
      switch (stepIndex) {
        case 0:
          return {
            valid: room.title && room.description,
            error: {
              titleError: room.title ? '' : 'Please add a title',
              descriptionError: room.description ? '' : 'Please add a description',
              welcomeError: room.welcome ? '' : 'Please add a welcome prompt'
            }
          }
        case 1:
          return {
            valid: room.image,
            error: room.image ? '' : 'Please provide an image'
          }
        case 2:
          return {
            valid: this.props.nametagEdits.new.name,
            error: {
              nameError: this.props.nametagEdits.new.name ? '' : 'Please choose a name for this room'
            }
          }
        case 3:
          return {
            valid: room.norms && room.norms.length > 0,
            error: room.norms && room.norms.length > 0 ? ''
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
    this.props.updateNametagEdit('new', 'image', '')
    this.props.updateNametagEdit('new', 'name', '')
    this.props.updateNametagEdit('new', 'bio', '')
    this.props.updateNametagEdit('new', 'badges', [])
    track('CREATE_ROOM_VIEW')
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
    const selectedBadges = room.templates.map(template => ({id: template.id, notes: [], template}))
    return !loading
    ? <div>
      <Navbar
        me={me}
        toggleLogin={() => {}} />
      <div style={styles.title}>
        <h1>Start a Conversation</h1>
        <Stepper stepIndex={stepIndex} />
      </div>
      <div style={styles.roomPreview} id='roomPreview'>
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
        {
          <CreateRoomForms
            stepIndex={this.state.stepIndex}
            updateNametagEdit={updateNametagEdit}
            room={this.state.room}
            badges={me.badges}
            handleNext={this.handleNext}
            handlePrev={this.handlePrev}
            selectedBadges={selectedBadges}
            addSelectedBadge={this.addSelectedBadge}
            removeSelectedBadge={this.removeSelectedBadge}
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
        }

        <div>
          {
            this.state.stepIndex > 0 &&
            <RaisedButton
              style={styles.button}
              labelStyle={styles.buttonLabel}
              primary
              id='backButton'
              onClick={this.handlePrev}
              label='BACK' />
          }
          {
            this.state.stepIndex >= 4
            ? <RaisedButton
              style={styles.button}
              labelStyle={styles.buttonLabel}
              primary
              id='publishButton'
              onClick={this.createRoom}
              label='PUBLISH' />
            : <RaisedButton
              style={styles.button}
              labelStyle={styles.buttonLabel}
              primary
              id='nextButton'
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

const {func, object, shape, arrayOf} = PropTypes
CreateRoom.propTypes = {
  searchImage: func.isRequired,
  createRoom: func.isRequired,
  setImageFromUrl: func.isRequired,
  nametagEdits: object.isRequired,
  data: shape({
    me: shape({
      badges: arrayOf(object).isRequired
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
