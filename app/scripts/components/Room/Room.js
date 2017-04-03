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

class Room extends Component {

  constructor (props) {
    super(props)

    this.state = {
      leftBarExpanded: false,
      toggles: {
        norms: true,
        rooms: true,
        nametags: true
      },
      presenceTime: null
    }

    this.showPresence = (nametagId) => {
      if (this.state.presenceTimer) { return }
      const {updateLatestVisit} = this.props
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

    this.toggleLeftBar = () => {
      this.setState({leftBarExpanded: !this.state.leftBarExpanded})
    }

    this.toggleLeftBarSection = (section) => () => {
      this.setState({toggles: {...this.state.toggles, [section]: !this.state.toggles[section]}})
    }

    this.getMyNametag = () => {
      const {me, room} = this.props.data
      const myNtId = me.nametags.reduce(
        (val, nametag) => nametag.room && nametag.room.id === room.id ? nametag.id : val, null
      )
      return room.nametags.filter((nt) => nt.id === myNtId)[0]
    }
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
      createMessage,
      toggleSaved
    } = this.props

    let myNametag

    // If the user is not logged in, return to the homepage
    if (!loading && !me) {
      window.location = '/'
      return
    }

    if (!loading) {
      myNametag = this.getMyNametag()
    }

    let expanded = this.state.leftBarExpanded ? styles.expanded : styles.collapsed
    expanded = window.innerWidth < 800 ? expanded : {}
    return <div style={styles.roomContainer}>
      {
        !loading
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
                    nametags={me.nametags}
                    roomId={room.id} />
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
                    mod={room.mod.id}
                    nametags={room.nametags} />
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
              roomId={room.id}
              norms={room.norms}
              createMessage={createMessage}
              toggleSaved={toggleSaved}
              myNametag={myNametag}
              mod={room.mod}
              messages={room.messages} />
          </div>
          <Compose
            createMessage={createMessage}
            roomId={room.id}
            myNametag={myNametag} />
        </div>
          : <div style={styles.spinner}>
            <CircularProgress />
          </div>
        }
    </div>
  }
}

Room.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    room: PropTypes.shape({
      id: PropTypes.string.isRequired,
      norms: PropTypes.arrayOf(PropTypes.string).isRequired,
      messages: PropTypes.arrayOf(PropTypes.object).isRequired,
      nametags: PropTypes.arrayOf(PropTypes.object).isRequired
    }),
    me: PropTypes.object
  }).isRequired,
  params: PropTypes.shape({
    roomId: PropTypes.string.isRequired
  }),
  createMessage: PropTypes.func.isRequired,
  toggleSaved: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired
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
  leftBar: {
    minHeight: 400,
    background: '#12726a',
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
