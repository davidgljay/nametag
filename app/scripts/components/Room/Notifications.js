import React, {PropTypes} from 'react'
import {List, ListItem} from 'material-ui/List'
import Badge from 'material-ui/Badge'

const Notifications = ({nametags, roomId, homepage}) => {
  const flexDisplay = window.innerWidth > 800 ? styles.flexDisplay
    : {...styles.flexDisplay, ...styles.flexDisplayMobile}

  const visitedRooms = nametags.filter(
    nametag => nametag.room && new Date(nametag.room.closedAt) > new Date() && nametag.room.id !== roomId
  )

  const listItems = visitedRooms.map(nametag => {
    const room = nametag.room
    const mentions = nametag.mentions ? nametag.mentions.filter(
      time => new Date(time) > new Date(nametag.latestVisit)
    ).length : 0

    const newMessages = room.latestMessage > nametag.latestVisit
    const notificationStyle = newMessages ? styles.notification
    : {...styles.notification, ...styles.noNewMessages}
    const homepageNotif = homepage ? {...notificationStyle, ...styles.homepageNotif}
    : notificationStyle
    return <ListItem innerDivStyle={homepageNotif} key={room.id} className='roomNotif'>
      <a href={`/rooms/${room.id}`} style={styles.link}>
        {
          mentions > 0 &&
          <Badge
            badgeContent={mentions}
            secondary
            style={styles.badgeStyle}
            badgeStyle={styles.innerBadgeStyle} />
        }

        <div>
          <img
            src={room.image}
            style={
              homepage ? {...styles.roomImage, ...styles.homepageRoomImage}
              : styles.roomImage
            } />
        </div>
        <div className='roomTitle'>{room.title}</div>
      </a>
    </ListItem>
  })

  return <div style={homepage ? styles.container : {}}>
    {
      listItems.length > 0 &&
      <List style={homepage ? flexDisplay : {}}
        children={listItems} />
    }
  </div>
}

Notifications.propTypes = {
  roomId: PropTypes.string,
  nametags: PropTypes.arrayOf(PropTypes.shape({
    room: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      closedAt: PropTypes.string.isRequired
    })
  })).isRequired,
  homepage: PropTypes.bool
}

export default Notifications

const styles = {
  container: {
    width: '100%',
    padding: '0px 30px 0px 30px'
  },
  listStyle: {
    width: '100%'
  },
  flexDisplay: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  flexDisplayMobile: { // Necessary b/c Radium can't act on custom components
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  noNewMessages: {
    opacity: 0.5
  },
  notification: {
    margin: 5,
    color: '#FFF',
    padding: '8px 8px 4px 8px',
    borderRadius: 2,
    fontSize: 13
  },
  homepageNotif: {
    backgroundColor: '#FFF',
    color: '#000',
    fontSize: 18,
    lineHeight: '22px'
  },
  roomImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    objectFit: 'cover',
    borderRadius: 15
  },
  homepageRoomImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  badgeStyle: {
    position: 'fixed',
    top: 3,
    left: 22,
    zIndex: 20,
    padding: 0,
    borderRadius: 5
  },
  innerBadgeStyle: {
    fontSize: 10,
    width: 15,
    height: 15
  }
}
