import React, {Component, PropTypes} from 'react'
import RoomSettings from './RoomSettings'
import Norms from './Norms'
import Drawer from 'material-ui/Drawer'
import Notifications from './Notifications'
import Nametags from '../../components/Nametag/Nametags'
import ShareButtons from './ShareButtons'
import t from '../../utils/i18n'

class RoomLeftBar extends Component {
  constructor (props) {
    super(props)

    this.toggleLeftBar = () => {
      this.setState({leftBarExpanded: !this.state.leftBarExpanded})
    }

    this.toggleOnClick = func => param => {
      const {toggleLeftBar} = this.props
      func(param)
      toggleLeftBar()
    }
  }

  render () {
    const {
      room,
      me,
      latestMessageUpdatedSubscription,
      updateRoom,
      canGrantBadges,
      setBadgeGrantee,
      setRecipient,
      setDefaultMessage,
      myNametag,
      expanded,
      toggleLeftBar,
      toggleNametagImageMenu
    } = this.props
    const notifCount = !myNametag || !me ? 0 : me.nametags.filter(
      nametag => nametag.room &&
      nametag.room.id !== this.props.roomId
    ).length
    const isMod = me && me.nametags
      .reduce((isMod, nametag) => nametag.id === room.mod.id ? true : isMod, false)
    const hideDMs = !isMod && room.modOnlyDMs
    const mobile = window.innerWidth < 800
    const leftBarStyle = mobile ? styles.leftBar : {...styles.leftBar, ...styles.leftBarDesktop}

    const leftBar = <div id='leftBar' style={leftBarStyle}>
      <div style={styles.leftBarContent}>
        <div style={styles.share}>
          <ShareButtons roomId={room.id} title={room.title} />
        </div>
        <div style={styles.leftNavHeader}>
          {t('room.norms')}
        </div>
        <div style={styles.norms}>
          <Norms norms={room.norms} />
        </div>
        {
          notifCount > 0 &&
            <div style={styles.leftNavHeader}>
              {t('room.rooms')}
            </div>
        }
        {
          myNametag &&
          <Notifications
            latestMessageUpdatedSubscription={latestMessageUpdatedSubscription}
            nametags={me.nametags}
            myNametag={myNametag}
            roomId={room.id} />
        }
        {
          isMod &&
          <div>
            <div style={styles.leftNavHeader}>
              {t('room.settings')}
            </div>
            <RoomSettings
              updateRoom={updateRoom}
              closed={room.closed}
              roomId={room.id}
              modOnlyDMs={room.modOnlyDMs} />
          </div>
        }
        {
          myNametag &&
          <div>
            <div
              style={styles.leftNavHeader}>
              {t('room.nametags')}
            </div>
            <Nametags
              mod={room.mod.id}
              canGrantBadges={canGrantBadges}
              setDefaultMessage={this.toggleOnClick(setDefaultMessage)}
              setRecipient={this.toggleOnClick(setRecipient)}
              setBadgeGrantee={this.toggleOnClick(setBadgeGrantee)}
              toggleNametagImageMenu={toggleNametagImageMenu}
              nametags={room.nametags}
              hideDMs={hideDMs}
              myNametagId={myNametag.id} />
          </div>
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
    nametags: arrayOf(object.isRequired),
    modOnlyDMs: bool
  }),
  me: shape({
    nametags: arrayOf(object.isRequired).isRequired
  }),
  latestMessageUpdatedSubscription: func.isRequired,
  setDefaultMessage: func.isRequired,
  setRecipient: func.isRequired,
  setBadgeGrantee: func.isRequired,
  canGrantBadges: bool.isRequired,
  updateRoom: func.isRequired,
  myNametag: shape({
    id: string.isRequired
  }),
  expanded: bool.isRequired,
  toggleLeftBar: func.isRequired,
  toggleNametagImageMenu: func.isRequired
}

export default RoomLeftBar

const styles = {
  leftNavHeader: {
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
    paddingTop: 20,
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
