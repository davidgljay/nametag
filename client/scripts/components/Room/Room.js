import React, { Component, PropTypes } from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import RoomLeftBar from './RoomLeftBar'
import AppBar from 'material-ui/AppBar'
import radium, {keyframes} from 'radium'
import Messages from '../../components/Message/Messages'
import WelcomeModal from './WelcomeModal'
import ComposeWithMenus from '../Message/ComposeWithMenus'
import JoinRoom from './JoinRoom'
import {track, identify, setTimer} from '../../utils/analytics'

class Room extends Component {

  constructor (props) {
    super(props)

    this.state = {
      leftBarExpanded: false,
      toggles: {
        norms: true,
        rooms: true,
        nametags: true,
        settings: true
      },
      presenceTime: null,
      defaultMessage: '',
      showWelcome: false
    }

    this.showPresence = () => {
      if (this.state.presenceTimer) { return }
      const {updateLatestVisit, myNametag} = this.props
      updateLatestVisit(myNametag.id)
      this.setState((prevState) => {
        clearInterval(prevState.presenceTimer)
        const presenceTimer = setInterval(() => {
          updateLatestVisit(myNametag.id)
        }, 10000)
        return {
          ...prevState,
          presenceTimer
        }
      })
    }

    this.toggleLeftBar = () => {
      const {leftBarExpanded} = this.state
      if (!leftBarExpanded) {
        track('ROOM_MENU_OPEN')
      }
      this.setState({leftBarExpanded: !leftBarExpanded})
    }

    this.showRooms = (e) => {
      e.preventDefault()
      track('SHOW_ROOMS')
      window.location = '/rooms'
    }

    this.userHasPosted = (myNametag, messages) => {
      for (let i = 0; i < messages.length; i++) {
        if (myNametag.id === messages[i].author.id) {
          return true
        }
      }
      return false
    }

    this.setDefaultMessage = (defaultMessage) => this.setState({defaultMessage})
  }

  componentDidMount () {
    const {
      requestNotifPermissions,
      roomUpdatedSubscription,
      nametagUpdatedSubscription,
      updateToken,
      params
    } = this.props
    requestNotifPermissions(updateToken)
    roomUpdatedSubscription(params.roomId)
    nametagUpdatedSubscription(params.roomId)
  }

  componentDidUpdate (prevProps) {
    const {messageAddedSubscription, messageDeletedSubscription, myNametag} = this.props
    const {loading, room, me} = this.props.data
    if (prevProps.data.loading && !loading) {
      if (me) {
        identify(me.id, {'$name': me.displayNames[0]})
      }
      if (me && myNametag) {
        this.showPresence()
        messageAddedSubscription(room.id, myNametag.id)
        messageDeletedSubscription(room.id)
        this.setState({showWelcome: !this.userHasPosted(myNametag, room.messages)})
        track('ROOM_VIEW', {id: room.id, title: room.title})
        setTimer('POST_MESSAGE')
      }
      document.title = `${room.title}`
    }
  }

  componentWillUnmount () {
    if (this.state.presenceTimer) {
      clearInterval(this.state.presenceTimer)
    }
  }

  render () {
    const {
      data: {
        loading,
        room,
        me
      },
      myNametag,
      nametagEdits,
      updateNametagEdit,
      addNametagEditBadge,
      removeNametagEditBadge,
      registerUser,
      loginUser,
      createNametag,
      latestMessageUpdatedSubscription,
      createMessage,
      updateRoom,
      updateNametag,
      deleteMessage,
      addReaction
    } = this.props

    const {defaultMessage, showWelcome} = this.state

    if (loading) {
      return <div style={styles.spinner}>
        <CircularProgress />
      </div>
    }

    // If the user is not logged in, return to the homepage
    if (!me || !room.nametags || !myNametag) {
      return <JoinRoom
        createNametag={createNametag}
        addNametagEditBadge={addNametagEditBadge}
        removeNametagEditBadge={removeNametagEditBadge}
        updateNametagEdit={updateNametagEdit}
        nametagEdits={nametagEdits}
        registerUser={registerUser}
        loginUser={loginUser}
        room={room}
        me={me} />
    }
    let hideDMs

    const isMobile = window.innerWidth < 800

    const backIcon = <img id='backButton' style={styles.backIcon} src='https://s3.amazonaws.com/nametag_images/logo-inverted30.png' />

    return <div style={styles.roomContainer}>
      <div id='room'>
        <AppBar
          id='roomTitle'
          title={room.title}
          style={styles.appBar}
          iconElementRight={backIcon}
          onRightIconButtonTouchTap={this.showRooms}
          onLeftIconButtonTouchTap={this.toggleLeftBar}
          iconStyleLeft={isMobile ? {display: 'inline-block'} : {display: 'none'}} />
        <div>
          <RoomLeftBar
            room={room}
            me={me}
            latestMessageUpdatedSubscription={latestMessageUpdatedSubscription}
            updateRoom={updateRoom}
            myNametag={myNametag}
            setDefaultMessage={this.setDefaultMessage}
            expanded={this.state.leftBarExpanded}
            toggleLeftBar={this.toggleLeftBar} />
          <Messages
            roomId={room.id}
            norms={room.norms}
            createMessage={createMessage}
            myNametag={myNametag}
            hideDMs={!!hideDMs}
            addReaction={addReaction}
            deleteMessage={deleteMessage}
            setDefaultMessage={this.setDefaultMessage}
            mod={room.mod}
            messages={room.messages} />
        </div>
        <ComposeWithMenus
          createMessage={createMessage}
          roomId={room.id}
          welcome={room.welcome}
          topic={room.topic}
          mod={room.mod}
          setDefaultMessage={this.setDefaultMessage}
          updateRoom={updateRoom}
          updateNametag={updateNametag}
          nametags={room.nametags}
          defaultMessage={defaultMessage}
          myNametag={myNametag} />
      </div>
      <WelcomeModal
        createMessage={createMessage}
        welcome={room.welcome}
        roomId={room.id}
        nametags={room.nametags}
        mod={room.mod}
        showWelcome={showWelcome}
        myNametag={myNametag}
        updateNametag={updateNametag}
        toggleWelcome={() => this.setState({showWelcome: false})}
        />
    </div>
  }
}

const {func, string, arrayOf, object, shape, bool} = PropTypes

Room.propTypes = {
  data: shape({
    loading: bool.isRequired,
    room: shape({
      id: string.isRequired,
      norms: arrayOf(string).isRequired,
      messages: arrayOf(object),
      nametags: arrayOf(object),
      modOnlyDMs: bool
    }),
    me: object
  }).isRequired,
  params: shape({
    roomId: string.isRequired
  }),
  updateRoom: func.isRequired,
  createNametag: func.isRequired,
  createMessage: func.isRequired,
  toggleSaved: func.isRequired,
  addReaction: func.isRequired,
  updateToken: func.isRequired
}

export default radium(Room)

const slideOut = keyframes({
  '0%': {left: -260},
  '100%': {left: 0}
}, 'slideOut')

const slideIn = keyframes({
  '0%': {left: 0},
  '100%': {left: -260}
}, 'slideIn')

const styles = {
  roomContainer: {
    overflowX: 'hidden'
  },
  appBar: {
    position: 'fixed',
    boxShadow: 'none'
  },
  title: {
    marginTop: 10,
    marginBottom: 5
  },
  close: {
    float: 'right',
    padding: 0,
    cursor: 'pointer',
    marginRight: 15
  },
  closeIcon: {
    fontSize: 12,
    width: 15,
    height: 15
  },
  drawer: {
    float: 'left',
    padding: 0,
    cursor: 'pointer'
  },
  expanded: {
    animationName: slideOut,
    animationDuration: '500ms',
    animationFillMode: 'forwards'
  },
  collapsed: {
    animationName: slideIn,
    animationDuration: '500ms',
    animationFillMode: 'forwards',
    overflowY: 'hidden',
    width: 250
  },
  chevronOut: {
    transform: 'rotate(180deg)'
  },
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  },
  backIcon: {
    margin: 8,
    cursor: 'pointer'
  }
}
