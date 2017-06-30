import React, { Component, PropTypes } from 'react'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import {mobile} from '../../../styles/sizes'
import RoomLeftBar from './RoomLeftBar'
import AppBar from 'material-ui/AppBar'
import radium, {keyframes} from 'radium'
import Messages from '../../components/Message/Messages'
import Compose from '../Message/Compose'

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

    this.showPresence = (nametagId) => {
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
    const {requestNotifPermissions, checkNametagPresenceSubscription, updateToken, params} = this.props
    requestNotifPermissions(updateToken)
    checkNametagPresenceSubscription(params.roomId)
  }

  componentDidUpdate (prevProps) {
    const {loading, room} = this.props.data
    if (prevProps.data.loading && !loading) {
      this.showPresence()
      this.props.messageAddedSubscription(room.id, this.getMyNametag().id)
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
      latestMessageUpdatedSubscription,
      createMessage,
      setModOnlyDMs,
      toggleSaved
    } = this.props

    const {defaultMessage} = this.state

    let myNametag

    // If the user is not logged in, return to the homepage
    if (!loading && !me) {
      window.location = '/'
      return
    }
    let hideDMs
    if (!loading) {
      myNametag = this.getMyNametag()
    }

    const backIcon = <IconButton
      style={styles.close}>
      <FontIcon
        className='material-icons'
        onClick={this.closeRoom}
        style={styles.closeIcon}>
         arrow_back
       </FontIcon>
    </IconButton>

    // TODO: Add swipe to show bar, remove bar icon on desktop mode
    return <div style={styles.roomContainer}>
      {
        !loading
        ? <div id='room'>
          <AppBar
            title={room.title}
            style={styles.appBar}
            iconElementRight={backIcon}
            onLeftIconButtonTouchTap={this.toggleLeftBar} />
          <div>
            <RoomLeftBar
              room={room}
              me={me}
              latestMessageUpdatedSubscription={latestMessageUpdatedSubscription}
              setModOnlyDMs={setModOnlyDMs}
              myNametag={myNametag}
              expanded={this.state.leftBarExpanded}
              toggleLeftBar={this.toggleLeftBar} />
            <Messages
              roomId={room.id}
              norms={room.norms}
              createMessage={createMessage}
              toggleSaved={toggleSaved}
              myNametag={myNametag}
              hideDMs={hideDMs}
              setDefaultMessage={this.setDefaultMessage}
              mod={room.mod}
              messages={room.messages} />
          </div>
          <Compose
            createMessage={createMessage}
            roomId={room.id}
            nametags={room.nametags}
            defaultMessage={defaultMessage}
            myNametag={myNametag} />
        </div>
          : <div style={styles.spinner}>
            <CircularProgress />
          </div>
        }
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
      messages: arrayOf(object).isRequired,
      nametags: arrayOf(object).isRequired,
      modOnlyDMs: bool
    }),
    me: object
  }).isRequired,
  params: shape({
    roomId: string.isRequired
  }),
  setModOnlyDMs: func.isRequired,
  createMessage: func.isRequired,
  toggleSaved: func.isRequired,
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

  header: {
    borderBottom: '3px solid #12726a',
    position: 'fixed',
    top: 0,
    zIndex: 100,
    background: 'white',
    width: '100%',
    paddingLeft: 15,
    paddingBottom: 5,
    paddingRight: 15,
    maxHeight: 80
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

  description: {
    fontSize: 14,
    [mobile]: {
      display: 'none'
    }
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
