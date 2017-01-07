import React from 'react'

const Notifications = ({userNametags, rooms}) =>
  <div>
  <div style={styles.header}>Rooms</div>
    {Object.keys(userNametags).map((roomId) => {
      const room = rooms[roomId]
      const userNametag = userNametags[roomId]

      const newMessages = userNametag.latestMessage > userNametag.latestVisit ?
        styles.newMessages : styles.noNew
      return room && <div style={styles.notification} key={roomId}>
        <a href={`/rooms/${roomId}`} style={styles.link}>
          <div>
            <img src={room.image} style={{...styles.roomImage, ...newMessages}}/>
          </div>
          <div style={newMessages}>{room.title}</div>
        </a>
        </div>
    })}
  </div>

export default Notifications

const styles = {
  header: {
    fontWeight: 800,
    fontSize: 14,
    color: '#FFF',
  },
  newMessages: {
    color: '#FFF',
  },
  noNew: {
    opacity: 0.5,
  },
  notification: {
    margin: 5,
  },
  roomImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    objectFit: 'cover',
    borderRadius: 15,
  },
  link: {
    color: '#FFF',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
  },
}
