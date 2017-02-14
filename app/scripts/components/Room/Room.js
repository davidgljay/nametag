import React, { Component, PropTypes } from 'react'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import {indigo500} from 'material-ui/styles/colors'
import {mobile} from '../../../styles/sizes'
import radium, {keyframes} from 'radium'

import Norms from './Norms'
import Notifications from './Notifications'
import Nametags from '../../components/Nametag/Nametags'
import Messages from '../../components/Message/Messages'
import Compose from '../Message/Compose'

let loadingNametags = false

class Room extends Component {

  constructor (props) {
    super(props)

    this.state = {
      leftBarExpanded: false,
      toggles: {
        norms: true,
        rooms: true,
        nametags: true
      }
    }

    this.showPresence = (nametagId) => {
      const {showPresence} = this.props
      showPresence(nametagId)
      this.setState({presenceTimer: setInterval(() => {
        showPresence(nametagId)
      }, 10000)
      })
    }

    this.watchUserNametags = (props) => {
      // Get all of the users' nametags and all of the rooms for those nametags
      // so that the user can be notified if there is activity in another room.
      const {
        userNametags,
        params,
        user,
        fetchRooms,
        watchUserNametags,
        watchDirectMessages,
        postUpdateUserNametag
      } = props

      if (!userNametags || !userNametags[params.roomId] &&
        user.id && !loadingNametags) {
        loadingNametags = true
        watchUserNametags(user.id)
          .then((userNts) => {
            fetchRooms(userNts.map((n) => n.room), true)
            for (let i = 0; i < userNts.length; i++) {
              if (userNts[i].room === params.roomId) {
                watchDirectMessages(params.roomId)
                postUpdateUserNametag(userNts[i].id, 'latestVisit', Date.now())
                this.showPresence(userNts[i].nametag)
              }
            }
          })
      }

      this.closeRoom = () => {
        window.location = '/rooms/'
      }

      this.toggleLeftBar = () => {
        this.setState({leftBarExpanded: !this.state.leftBarExpanded})
      }

      this.toggleLeftBarSection = (section) => () => {
        this.setState({toggles: {...this.state.toggles, [section]: !this.state.toggles[section]}})
      }
    }
  }

  getChildContext () {
    const {rooms, params, userNametags, nametags} = this.props
    const room = rooms[params.roomId]
    return {
      userNametag: userNametags[params.roomId],
      room,
      mod: room ? nametags[room.mod] : null
    }
  }

  componentDidMount () {
    const {params, watchRoom} = this.props
    const roomId = params.roomId
    watchRoom(roomId)
    this.watchUserNametags(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.watchUserNametags(nextProps)
  }

  componentWillUnmount () {
    const roomId = this.props.params.roomId
    this.props.unWatchRoom(roomId)
    this.props.unWatchUserNametags()
    this.props.unWatchDirectMessages()
    if (this.state.presenceTimer) {
      clearInterval(this.state.presenceTimer)
    }
  }

  render () {
    const {
      rooms,
      nametags,
      messages,
      params,
      postMessage,
      saveMessage,
      addRoomMessage,
      userNametags
    } = this.props

    const room = rooms[params.roomId]
    const userNametag = userNametags[params.roomId]

    let expanded = this.state.leftBarExpanded ? styles.expanded : styles.collapsed
    expanded = window.innerWidth < 800 ? expanded : {}
    return <div style={styles.roomContainer}>
      {
        userNametag && room
        ? <div>
          <div style={styles.header}>
            <IconButton
              style={styles.close}>
              <FontIcon
                className='material-icons'
                onClick={this.closeRoom}
                style={styles.closeIcon}>
                 close
               </FontIcon>
            </IconButton>
            <h3 style={styles.title}>{room.title}</h3>
            <div style={styles.description}>
              {room.description}
            </div>
          </div>
          <div>
            <div style={{...styles.leftBar, ...expanded}}>
              <div style={styles.leftBarContent}>
                <div
                  style={styles.leftNavHeader}
                  onClick={this.toggleLeftBarSection('norms')}>
                  {
                      this.state.toggles.norms ? '- ' : '+ '
                    }
                    Norms
                  </div>
                {
                    this.state.toggles.norms &&
                    <div style={styles.norms}>
                      <Norms norms={room.norms} />
                    </div>
                  }
                <div
                  style={styles.leftNavHeader}
                  onClick={this.toggleLeftBarSection('rooms')}>
                  {
                        this.state.toggles.rooms ? '- ' : '+ '
                      }
                      Rooms
                    </div>
                {
                      this.state.toggles.rooms &&
                      <Notifications
                        userNametags={userNametags}
                        rooms={rooms}
                        roomId={params.roomId} />
                  }
                <div
                  style={styles.leftNavHeader}
                  onClick={this.toggleLeftBarSection('nametags')}>
                  {
                      this.state.toggles.nametags ? '- ' : '+ '
                    }
                    Nametags
                  </div>
                {
                    this.state.toggles.nametags &&
                    <Nametags
                      room={params.roomId}
                      mod={room.mod}
                      nametags={nametags} />
                  }
              </div>
              <div style={styles.leftBarChevron}>
                <FontIcon
                  color='#FFF'
                  className='material-icons'
                  style={this.state.leftBarExpanded ? styles.chevronOut : {}}
                  onClick={this.toggleLeftBar.bind(this)}
                    >chevron_right</FontIcon>
              </div>
            </div>
            <Messages
              room={params.roomId}
              norms={room.norms}
              nametags={nametags}
              postMessage={postMessage}
              saveMessage={saveMessage}
              messages={messages} />
          </div>
          {
            <Compose
              postMessage={postMessage}
              addRoomMessage={addRoomMessage} />
            }
        </div>
          : <div style={styles.spinner}>
            <CircularProgress />
          </div>
        }
    </div>
  }
}

Room.propTypes = {
  postMessage: PropTypes.func.isRequired,
  userNametag: PropTypes.object,
  room: PropTypes.object
}

Room.childContextTypes = {
  userNametag: PropTypes.object,
  room: PropTypes.object,
  mod: PropTypes.object
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
  leftNavHeader: {
    fontWeight: 800,
    fontSize: 16,
    color: '#FFF',
    marginTop: 15,
    marginBottom: 5,
    cursor: 'pointer'
  },
  header: {
    borderBottom: '3px solid ' + indigo500,
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
  leftBar: {
    minHeight: 400,
    background: indigo500,
    marginTop: 55,
    height: '100%',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 50,
    width: 265,
    overflowY: 'auto',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50
  },
  leftBarChevron: {
    display: 'none',
    color: '#FFF',
    position: 'absolute',
    top: '45%',
    left: 255,
    cursor: 'pointer',
    [mobile]: {
      display: 'block'
    }
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
  },
  norms: {
    color: '#FFF'
  },
  leftBarContent: {
    marginBottom: 100
  }
}
