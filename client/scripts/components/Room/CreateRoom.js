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
import {getQueryVariable} from '../../utils/queryVars'
import t from '../../utils/i18n'

class CreateRoom extends Component {

  constructor (props) {
    super(props)

    this.state = {
      room: {
        templates: [],
        welcome: '',
        public: true,
        actionTypes: [],
        mod: {
          badges: []
        }
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

    this.updateMod = (__, key, val) =>
      this.setState(prevState => {
        const newRoom = {
          ...prevState.room,
          mod: {
            ...prevState.room.mod,
            [key]: val
          }
        }
        window.localStorage.setItem('room', JSON.stringify(newRoom))
        return {
          ...prevState,
          room: newRoom
        }
      })

    this.addModBadge = (badge) => {
      const {room} = this.state
      let newRoom = {
        ...room,
        mod: {
          ...room.mod,
          badges: room.mod.badges.concat(badge)
        }
      }

      window.localStorage.setItem('room', JSON.stringify(newRoom))
      this.setState({room: newRoom})
    }

    this.removeModBadge = (badge) => {
      const {room} = this.state
      const badgeIndex = room.mod.badges.reduce((result, b, i) =>
        b.id === badge.id ? i : result, null
      )
      const newRoom = {
        ...room,
        mod: {
          ...room.mod,
          badges: room.mod.badges.slice(0, badgeIndex).concat(
            room.mod.badges.slice(badgeIndex + 1)
          )
        }
      }

      window.localStorage.setItem('room', JSON.stringify(newRoom))
      this.setState({room: newRoom})
    }

    this.createRoom = () => {
      const {room} = this.state
      track('CREATE_ROOM', {title: room.title})
      const roomTemplates = room.templates.map(t => t.id)
      this.props.createRoom({
        ...room,
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
      switch (stepIndex) {
        case 0:
          return {
            valid: room.welcome,
            welcomeError: !room.welcome && t('create_room.errors.welcome')
          }
        case 1:
          return {
            valid: room.norms && room.norms.length > 0,
            normsError: !room.norms || !room.norms.length > 0 && t('create_room.errors.norm')
          }
        case 2: {
          return {
            valid: room.mod.name && room.mod.image && room.mod.bio,
            imageError: room.mod.image ? '' : t('create_room.errors.image'),
            bioError: room.mod.bio ? '' : t('create_room.errors.intro')
          }
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
    const stepIndex = getQueryVariable('step')
    if (stepIndex) {
      this.setState({stepIndex: parseInt(stepIndex)})
    }

    if (title) {
      this.updateRoom('title', title)
      track('CREATE_ROOM_VIEW', {title})
    }
    window.addEventListener('popstate', (event) => {
      const step = getQueryVariable('step')
      this.setState({stepIndex: step ? parseInt(step) : 0})
    })
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
      data: {me, loading, refetch}
    } = this.props
    const {room, stepIndex} = this.state
    const selectedBadges = room.templates.map(template => ({id: template.id, notes: [], template}))
    return !loading
    ? <div>
      <Navbar
        me={me}
        toggleLogin={() => {}} />
      <div style={styles.title}>
        <Stepper stepIndex={stepIndex} loggedIn={!!me} hasGranters={me && me.granters && me.granters.length > 0} />
      </div>
      <div style={styles.createRoom}>
        {
          <CreateRoomForms
            stepIndex={this.state.stepIndex}
            updateMod={this.updateMod}
            room={room}
            badges={me ? me.badges : []}
            handleNext={this.handleNext}
            handlePrev={this.handlePrev}
            selectedBadges={selectedBadges}
            addSelectedBadge={this.addSelectedBadge}
            removeSelectedBadge={this.removeSelectedBadge}
            updateRoom={this.updateRoom}
            refetch={refetch}
            addModBadge={this.addModBadge}
            removeModBadge={this.removeModBadge}
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
            stepIndex > 0 &&
            <FlatButton
              style={styles.button}
              labelStyle={styles.backButtonLabel}
              id='backButton'
              onClick={this.handlePrev}
              label={t('back')} />
          }
          {
            stepIndex < 4 &&
            (
              !(stepIndex === 2 && !me) ||
              (stepIndex === 3 && me && me.granters.length > 0)
            ) &&
            <RaisedButton
              style={styles.button}
              labelStyle={styles.buttonLabel}
              primary
              id='nextButton'
              onClick={this.handleNext}
              label={t('next')} />
          }
          {
            stepIndex >= 3 &&
            me &&
            !(stepIndex === 3 && me.granters.length > 0) &&
            <RaisedButton
              style={styles.button}
              labelStyle={styles.buttonLabel}
              primary
              id='doneButton'
              onClick={this.createRoom}
              label={t('room.enter_room')} />
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
