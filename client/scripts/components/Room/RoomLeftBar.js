import React, {Component, PropTypes} from 'react'
import RoomSettings from './RoomSettings'
import Norms from './Norms'
import Drawer from 'material-ui/Drawer'
import Notifications from './Notifications'
import Nametags from '../../components/Nametag/Nametags'
import ShareButtons from './ShareButtons'

class RoomLeftBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      toggles: {
        norms: true,
        settings: true,
        rooms: true,
        nametags: true,
        share: true
      }
    }

    this.toggleLeftBar = () => {
      this.setState({leftBarExpanded: !this.state.leftBarExpanded})
    }

    this.toggleLeftBarSection = (section) => () => {
      this.setState({toggles: {...this.state.toggles, [section]: !this.state.toggles[section]}})
    }

    this.setDefaultMessage = (message) => {
      const {setDefaultMessage, toggleLeftBar} = this.props
      setDefaultMessage(message)
      toggleLeftBar()
    }

    this.setRecipient = (id) => {
      const {setRecipient, toggleLeftBar} = this.props
      setRecipient(id)
      toggleLeftBar()
    }
  }

  render () {
    const {
      room,
      me,
      latestMessageUpdatedSubscription,
      updateRoom,
      myNametag,
      expanded,
      toggleLeftBar
    } = this.props
    const notifCount = me.nametags.filter(
      nametag => nametag.room &&
      new Date(nametag.room.latestMessage) > new Date(Date.now() - 604800000) &&
      nametag.room.id !== this.props.roomId
    ).length
    const isMod = me.nametags
      .reduce((isMod, nametag) => nametag.id === room.mod.id ? true : isMod, false)
    const hideDMs = !isMod && room.modOnlyDMs
    const mobile = window.innerWidth < 800
    const leftBarStyle = mobile ? styles.leftBar : {...styles.leftBar, ...styles.leftBarDesktop}

    const leftBar = <div id='leftBar' style={leftBarStyle}>
      <div style={styles.leftBarContent}>
        {
          this.state.toggles.share &&
          <div style={styles.share}>
            <ShareButtons roomId={room.id} title={room.title} />
          </div>
        }
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
        {
          notifCount > 0 &&
            <div
              style={styles.leftNavHeader}
              onClick={this.toggleLeftBarSection('rooms')}>
              {
                this.state.toggles.rooms ? '- ' : '+ '
              }
              Rooms
            </div>
        }
        {
          this.state.toggles.rooms &&
          <Notifications
            latestMessageUpdatedSubscription={latestMessageUpdatedSubscription}
            nametags={me.nametags}
            myNametag={myNametag}
            roomId={room.id} />
        }
        {
          isMod &&
          <div>
            <div
              style={styles.leftNavHeader}
              onClick={this.toggleLeftBarSection('settings')}>
              {
                this.state.toggles.settings ? '- ' : '+ '
              }
              Settings
            </div>
            {
              this.state.toggles.settings &&
              <RoomSettings
                updateRoom={updateRoom}
                roomId={room.id}
                modOnlyDMs={room.modOnlyDMs} />
            }
          </div>
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
            setDefaultMessage={this.setDefaultMessage}
            setRecipient={this.setRecipient}
            nametags={room.nametags}
            hideDMs={hideDMs}
            myNametagId={myNametag.id} />
        }
      </div>
    </div>

    if (window.innerWidth < 800) {
      return <Drawer
        width={295}
        open={expanded}
        docked={false}
        style={styles.drawer}
        onRequestChange={toggleLeftBar} >
        {leftBar}
      </Drawer>
    }
    return leftBar
  }
}

const {shape, arrayOf, object, bool, string, func} = PropTypes

RoomLeftBar.propTypes = {
  room: shape({
    id: string.isRequired,
    mod: shape({
      id: string.isRequired
    }),
    nametags: arrayOf(object.isRequired).isRequired,
    modOnlyDMs: bool
  }),
  me: shape({
    nametags: arrayOf(object.isRequired).isRequired
  }),
  latestMessageUpdatedSubscription: func.isRequired,
  setDefaultMessage: func.isRequired,
  setRecipient: func.isRequired,
  updateRoom: func.isRequired,
  myNametag: shape({
    id: string.isRequired
  }).isRequired,
  expanded: bool.isRequired,
  toggleLeftBar: func.isRequired
}

export default RoomLeftBar

const styles = {
  leftNavHeader: {
    fontWeight: 800,
    fontSize: 16,
    color: '#FFF',
    marginTop: 15,
    marginBottom: 5,
    cursor: 'pointer'
  },
  leftBar: {
    minHeight: 400,
    background: '#12726a',
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
  leftBarDesktop: {
    marginTop: 55
  },
  norms: {
    color: '#FFF'
  },
  leftBarContent: {
    marginBottom: 100
  }
}
