import React, {PropTypes} from 'react'
import NametagIcon from '../Nametag/NametagIcon'
import {Card} from 'material-ui/Card'

const JoinedRoomCard = ({room}) =>
  <Card key={room.id} className='JoinedRoomCard' style={styles.cardContainer}>
    <div className='cardMod' style={styles.modContainer}>
      <div style={styles.modIcon}>
        <NametagIcon
          image={room.mod.image}
          name={room.mod.name}
          diameter={80} />
      </div>
    </div>
    <div style={styles.title}>{room.title}</div>
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

export default JoinedRoomCard

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    margin: '40px 15px 20px 15px',
    width: 350
  },
  modContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 20px 0px 20px',
    position: 'relative',
    bottom: 40,
    width: 100
  },
  title: {
    fontSize: 24,
    margin: '0px 20px',
    position: 'relative',
    bottom: 20
  }
}
