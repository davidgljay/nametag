import React, {PropTypes} from 'react'
import NametagIcon from '../Nametag/NametagIcon'
import {Card} from 'material-ui/Card'
import {browserHistory} from 'react-router'
import {primary} from '../../../styles/colors'
import FontIcon from 'material-ui/FontIcon'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'

const JoinedRoomCard = ({room}) =>
  <Card
    key={room.id}
    className='joinedRoomCard'
    style={styles.cardContainer}
    onClick={() => browserHistory.push(`/rooms/${room.id}`)}>
    <div className='cardMod' style={styles.modContainer}>
      <div style={styles.modIcon}>
        <NametagIcon
          image={room.mod.image}
          name={room.mod.name}
          diameter={80} />
      </div>
      <div style={styles.newCounts}>
        {
          room.newMessageCount > 0 &&
          <div style={styles.newCountContainer}>
            <div style={styles.newCount}>{room.newMessageCount}</div>
            <FontIcon
              className='material-icons'
              style={styles.newCount}>
                  chat_bubble
            </FontIcon>
          </div>
        }
        {
          room.newNametagCount > 0 &&
          <div style={styles.newCountContainer}>
            <div style={styles.newCount}>{room.newNametagCount}</div>
            <FontIcon
              className='material-icons'
              style={styles.newCount}>
                  person
            </FontIcon>
          </div>
        }
      </div>
    </div>
    <div style={styles.title} className='roomTitle'>{room.title}</div>
  </Card>

const {shape, string} = PropTypes

JoinedRoomCard.proptypes = {
  room: shape({
    id: string.isRequired,
    title: string.isRequired,
    mod: shape({
      image: string,
      name: string.isRequired
    })
  }).isRequired
}

export default radium(JoinedRoomCard)

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    margin: '40px 15px 20px 15px',
    width: 350,
    cursor: 'pointer'
  },
  modContainer: {
    display: 'flex',
    margin: '0px 5px 0px 20px'
  },
  modIcon: {
    position: 'relative',
    bottom: 40,
    width: 100
  },
  newCounts: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 5
  },
  newCount: {
    margin: 1,
    color: primary,
    lineHeight: '18px',
    fontSize: '16px'
  },
  newCountContainer: {
    display: 'flex',
    margin: '5px 3px'
  },
  title: {
    fontSize: 24,
    margin: '0px 20px',
    position: 'relative',
    bottom: 20,
    fontWeight: 300,
    [mobile]: {
      fontSize: 18,
      wordWrap: 'break-word'
    }
  }
}
