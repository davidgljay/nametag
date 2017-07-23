import React, { Component, PropTypes } from 'react'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import RoomLeftBar from './RoomLeftBar'
import AppBar from 'material-ui/AppBar'
import radium, {keyframes} from 'radium'
import Messages from '../../components/Message/Messages'
import Compose from '../Message/Compose'
import JoinRoom from './JoinRoom'

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
      defaultMessage: ''
    }

    this.showPresence = () => {
      if (this.state.presenceTimer) { return }
      const {updateLatestVisit} = this.props
      updateLatestVisit(this.getMyNametag().id)
      this.setState((prevState) => {
        clearInterval(prevState.presenceTimer)
        const presenceTimer = setInterval(() => {
          updateLatestVisit(this.getMyNametag().id)
        }, 10000)
        return {
          ...prevState,
          presenceTimer
        }
      })
    }

    this.closeRoom = () => {
      window.location = '/'
    }

    this.getMyNametag = () => {
      const {me, room} = this.props.data
      const myNtId = me.nametags.reduce(
        (val, nametag) => nametag.room && nametag.room.id === room.id ? nametag.id : val, null
      )
      return room.nametags.filter((nt) => nt.id === myNtId)[0]
    }

    this.toggleLeftBar = () => this.setState({leftBarExpanded: !this.state.leftBarExpanded})

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
    const {messageAddedSubscription, messageDeletedSubscription} = this.props
    const {loading, room} = this.props.data
    if (prevProps.data.loading && !loading) {
      this.showPresence()
      messageAddedSubscription(room.id, this.getMyNametag().id)
      messageDeletedSubscription(room.id)
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

    const {defaultMessage} = this.state

    if (loading) {
      return <div style={styles.spinner}>
        <CircularProgress />
      </div>
    }

    // If the user is not logged in, return to the homepage
    if (!me || !room.nametags) {
      console.log(room)
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
    const myNametag = this.getMyNametag()
    const userHasPosted = room.messages.reduce(
      (bool, msg) => msg.author.id === myNametag.id ? true : bool, false
    )

    const isMobile = window.innerWidth < 800

    const backIcon = <IconButton
      style={styles.close}>
      <FontIcon
        className='material-icons'
        onClick={this.closeRoom}
        style={styles.closeIcon}>
         arrow_back
       </FontIcon>
    </IconButton>

    return <div style={styles.roomContainer}>
      <div id='room'>
        <AppBar
          id='roomTitle'
          title={room.title}
          style={styles.appBar}
          iconElementRight={backIcon}
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
        <Compose
          createMessage={createMessage}
          roomId={room.id}
          welcome={room.welcome}
          topic={room.topic}
          mod={room.mod}
          posted={userHasPosted}
          setDefaultMessage={this.setDefaultMessage}
          updateRoom={updateRoom}
          updateNametag={updateNametag}
          nametags={room.nametags}
          defaultMessage={defaultMessage}
          myNametag={myNametag} />
      </div>
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
  }
}
