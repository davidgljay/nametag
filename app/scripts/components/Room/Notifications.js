import React from 'react'
import {List, ListItem} from 'material-ui/List'
import Badge from 'material-ui/Badge'

const Notifications = ({userNametags, rooms, roomId, homepage}) => {
  const flexDisplay = window.innerWidth > 800 ? styles.flexDisplay
    : {...styles.flexDisplay, ...styles.flexDisplayMobile}

  const visitedRooms = Object.keys(userNametags).sort((a, b) => {
    if (!rooms[a] || !rooms[b]) return 0
    if (rooms[a].title < rooms[b].title) return -1
    if (rooms[a].title > rooms[b].title) return 1
    return 0
  }).filter((r) => rooms[r] && rooms[r].closedAt > Date.now())

  const listItems = visitedRooms.map((id) => {
    const room = rooms[id]
    const userNametag = userNametags[id]
    const mentions = userNametag.mentions ? userNametag.mentions.filter(
      (time) => time > userNametag.latestVisit
    ).length : 0

    const newMessages = userNametag.latestMessage > userNametag.latestVisit
    const notificationStyle = newMessages ? styles.notification
    : {...styles.notification, ...styles.noNewMessages}
    const homepageNotif = homepage ? {...notificationStyle, ...styles.homepageNotif}
    : notificationStyle
    return room && roomId !== id &&
      <ListItem innerDivStyle={homepageNotif} key={id}>
        <a href={`/rooms/${id}`} style={styles.link}>
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
          <div>{room.title}</div>
        </a>
      </ListItem>
  })

  return <div style={homepage ? styles.container : {}}>
    <List style={homepage ? flexDisplay : {}}
      children={listItems} />
  </div>
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
