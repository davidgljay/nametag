import React, { Component, PropTypes } from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import RoomLeftBar from './RoomLeftBar'
import AppBar from 'material-ui/AppBar'
import RoomDialog from './RoomDialog'
import radium, {keyframes} from 'radium'
import Messages from '../Message/Messages'
import ComposeWithMenus from '../Message/ComposeWithMenus'

import {getQueryVariable, removeQueryVar} from '../../utils/queryVars'
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
      keepLoading: false,
      nametagCreated: false,
      recipient: null,
      editing: null
    }

    this.showPresence = () => {
      if (this.state.presenceTimer) { return }
      const {updateLatestVisit, myNametag} = this.props
      updateLatestVisit(myNametag.id)
      this.setState((prevState) => {
        clearInterval(prevState.presenceTimer)
        const presenceTimer = setInterval(() => {
          updateLatestVisit(myNametag.id)
        }, 30000)
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

    this.joinRoom = (intro, nametagEdit = {}) => {
      const {data: {room, me, refetch}, createNametag} = this.props
      const nametag = {
        bio: intro,
        room: room.id,
        name: nametagEdit.name || me.displayNames[0],
        image: nametagEdit.image || me.images[0]
      }
      return createNametag(nametag)
        .then(refetch)
    }

    this.onCreateNametag = () => this.props.data.refetch()

    this.setDefaultMessage = (defaultMessage) => this.setState({defaultMessage})

    this.setRecipient = (recipient) => this.setState({recipient})

    this.setEditing = (editing) => this.setState({editing})
  }

  componentDidMount () {
    const {
      requestNotifPermissions,
      roomUpdatedSubscription,
      typingPromptAdded,
      updateToken,
      dispatch,
      setVisibleReplies,
      params
    } = this.props

    if (getQueryVariable('showReplies')) {
      setVisibleReplies(getQueryVariable('showReplies'))
    }
    requestNotifPermissions(updateToken)
    roomUpdatedSubscription(params.roomId)
    typingPromptAdded(dispatch)(params.roomId)
  }

  componentDidUpdate (prevProps) {
    const {
      messageAddedSubscription,
      messageDeletedSubscription,
      nametagUpdatedSubscription,
      myNametag
    } = this.props
    const {loading, room, me} = this.props.data
    if (prevProps.data.loading && !loading) {
      if (me) {
        identify(me.id, {'$name': me.displayNames[0]})
      }
      if (room) {
        document.title = `${room.title}`
      }
      const intro = getQueryVariable('intro')
      if (me && !myNametag && intro) {
        this.joinRoom(intro)
        this.setState({keepLoading: true})
      }
      removeQueryVar('intro')
    }
    if (!prevProps.myNametag && myNametag && room) {
      this.showPresence()
      this.setState({keepLoading: false})
      nametagUpdatedSubscription(room.id)
      messageAddedSubscription(room.id, myNametag.id)
      messageDeletedSubscription(room.id)
      track('ROOM_VIEW', {id: room.id, title: room.title})
      setTimer('POST_MESSAGE')
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
        me,
        refetch
      },
      myNametag,
      grantableTemplates,
      nametagEdits,
      typingPrompts,
      showTypingPrompt,
      updateNametagEdit,
      latestMessageUpdatedSubscription,
      createMessage,
      updateRoom,
      updateNametag,
      deleteMessage,
      editMessage,
      banNametag,
      addReaction,
      getReplies,
      visibleReplies,
      setVisibleReplies
    } = this.props

    const {defaultMessage, recipient, editing, nametagCreated, keepLoading} = this.state

    if (loading || !room || keepLoading) {
      return <div style={styles.spinner}>
        <CircularProgress />
      </div>
    }

    let hideDMs

    const isMobile = window.innerWidth < 800

    const backIcon = <img
      id='backButton'
      style={styles.backIcon}
      src='https://s3.amazonaws.com/nametag_images/logo-inverted30.png' />

    return <div style={styles.roomContainer}>
      <div id='room'>
        <AppBar
          id='roomTitle'
          title={room.title}
          titleStyle={styles.title}
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
            setRecipient={this.setRecipient}
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
            grantableTemplates={grantableTemplates}
            banNametag={banNametag}
            getReplies={getReplies}
            editMessage={editMessage}
            setVisibleReplies={setVisibleReplies}
            visibleReplies={visibleReplies}
            setDefaultMessage={this.setDefaultMessage}
            setRecipient={this.setRecipient}
            setEditing={this.setEditing}
            mod={room.mod}
            messages={me && (myNametag && myNametag.bio) || nametagCreated ? room.messages : []} />
        </div>
        <ComposeWithMenus
          createMessage={createMessage}
          roomId={room.id}
          welcome={room.welcome}
          topic={room.topic}
          mod={room.mod}
          closed={!!room.closed}
          recipient={recipient}
          setDefaultMessage={this.setDefaultMessage}
          setRecipient={this.setRecipient}
          editing={editing}
          setEditing={this.setEditing}
          editMessage={editMessage}
          updateRoom={updateRoom}
          updateNametag={updateNametag}
          nametags={room.nametags}
          defaultMessage={defaultMessage}
          showTypingPrompt={showTypingPrompt}
          typingPrompts={typingPrompts}
          myNametag={myNametag} />
      </div>
      {
        !nametagCreated &&
        <RoomDialog
          me={me}
          myNametag={myNametag}
          room={room}
          refetch={refetch}
          joinRoom={this.joinRoom}
          updateNametagEdit={updateNametagEdit}
          nametagEdits={nametagEdits} />
      }
    </div>
  }
}

const {func, string, arrayOf, array, object, shape, bool} = PropTypes

Room.propTypes = {
  data: shape({
    loading: bool.isRequired,
    room: shape({
      id: string.isRequired,
      norms: arrayOf(string).isRequired,
      messages: arrayOf(object),
      nametags: arrayOf(object),
      modOnlyDMs: bool,
      closed: bool
    }),
    me: object
  }).isRequired,
  params: shape({
    roomId: string.isRequired
  }),
  visibleReplies: string.isRequired,
  registerUser: func.isRequired,
  typingPrompts: array.isRequired,
  updateRoom: func.isRequired,
  createNametag: func.isRequired,
  createMessage: func.isRequired,
  deleteMessage: func.isRequired,
  editMessage: func.isRequired,
  toggleSaved: func.isRequired,
  addReaction: func.isRequired,
  updateToken: func.isRequired,
  getReplies: func.isRequired,
  setVisibleReplies: func.isRequired,
  banNametag: func.isRequired
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
  bodyStyle: {
    overflowY: 'auto'
  },
  roomContainer: {
    overflowX: 'hidden'
  },
  appBar: {
    position: 'fixed',
    boxShadow: 'none',
    fontWeight: 300
  },
  title: {
    fontWeight: 300
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
