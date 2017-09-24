import React, {Component, PropTypes} from 'react'
// import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import CreateRoomForms from './Create/CreateRoomForms'
import CircularProgress from 'material-ui/CircularProgress'
import Stepper from './Create/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {track} from '../../utils/analytics'
import {grey, white} from '../../../styles/colors'
import pwHash from '../../utils/pwHash'

class CreateRoom extends Component {

  constructor (props) {
    super(props)

    this.state = {
      room: {
        title: '',
        description: '',
        image: '',
        templates: [],
        welcome: '',
        public: true
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
      const {stepIndex} = this.state
      const validation = this.validate(stepIndex)
      if (validation.valid) {
        history.pushState('', document.title, `${window.location.pathname}?step=${stepIndex + 1}`)
        this.setState((prevState) => {
          prevState.error = null
          prevState.stepIndex ++
          prevState.finished = prevState.stepIndex > 3
          return prevState
        })
      } else {
        this.setState({error: validation})
      }
    }

    this.handlePrev = () => {
      this.setState((prevState) => {
        const {stepIndex} = this.state
        delete prevState.error
        history.pushState('', document.title, `${window.location.pathname}?step=${stepIndex - 1}`)
        if (prevState.stepIndex > 0) {
          prevState.stepIndex --
        }
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
        window.localStorage.setItem('room', JSON.stringify(prevState.room))
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
      const {nametagEdits, data: {me}} = this.props
      switch (stepIndex) {
        case 0:
          return {
            valid: room.welcome,
            welcomeError: !room.welcome && 'Please add a welcome prompt'
          }
        case 1:
          return {
            valid: room.norms && room.norms.length > 0,
            normsError: !room.norms || !room.norms.length > 0 && 'Please select at least one norm'
          }
        case 2: {
          return {
            valid: me,
            loginError: me && 'Please Log In'
          }
        }
        case 3:
          return {
            valid: nametagEdits.new.name && nametagEdits.new.image && nametagEdits.new.bio,
            imageError: nametagEdits.new.image ? '' : 'Please choose an image',
            bioError: nametagEdits.new.bio ? '' : 'Please introduce yourself'
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
    const {location: {state: locationState}} = this.props
    const title = locationState && locationState.title
    const hashStep = pwHash('step')
    if (hashStep) {
      console.log('hashSTep', hashStep)
      this.setState({stepIndex: parseInt(hashStep)})
    }
    this.props.updateNametagEdit('new', 'image', '')
    this.props.updateNametagEdit('new', 'name', '')
    this.props.updateNametagEdit('new', 'bio', '')
    this.props.updateNametagEdit('new', 'badges', [])
    if (title) {
      this.updateRoom('title', title)
      track('CREATE_ROOM_VIEW', {title})
    }
  }

  componentDidUpdate (oldProps) {
    const {data: {loading}} = this.props
    if (oldProps.data.loading && !loading) {
      const storedRoom = window.localStorage.getItem('room')
      if (storedRoom) {
        const room = JSON.parse(storedRoom)
        this.setState({room})
      }
    }
  }

  render () {
    const {
      data: {me, loading},
      nametagEdits,
      updateNametagEdit,
      addNametagEditBadge,
      removeNametagEditBadge,
      registerUser,
      loginUser,
      passwordResetRequest
    } = this.props
    const {room, stepIndex} = this.state
    const selectedBadges = room.templates.map(template => ({id: template.id, notes: [], template}))
    return !loading
    ? <div>
      <Navbar
        me={me}
        toggleLogin={() => {}} />
      <div style={styles.title}>
        <Stepper stepIndex={stepIndex} loggedIn={!!me} />
      </div>
      <div style={styles.createRoom}>
        {
          <CreateRoomForms
            stepIndex={this.state.stepIndex}
            updateNametagEdit={updateNametagEdit}
            room={this.state.room}
            badges={me ? me.badges : []}
            handleNext={this.handleNext}
            handlePrev={this.handlePrev}
            selectedBadges={selectedBadges}
            addSelectedBadge={this.addSelectedBadge}
            removeSelectedBadge={this.removeSelectedBadge}
            nametagEdits={nametagEdits}
            updateRoom={this.updateRoom}
            loginUser={loginUser}
            registerUser={registerUser}
            passwordResetRequest={passwordResetRequest}
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
            <FlatButton
              style={styles.button}
              labelStyle={styles.backButtonLabel}
              id='backButton'
              onClick={this.handlePrev}
              label='BACK' />
          }
          {
            this.state.stepIndex < 4 &&
            !(this.state.stepIndex === 2 && me) &&
            <RaisedButton
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
  createRoom: func.isRequired,
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
    color: white,
    margin: 20
  },
  backButtonLabel: {
    color: grey,
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
