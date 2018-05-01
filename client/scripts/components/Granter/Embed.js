import React, {PropTypes} from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import RoomCard from '../Room/RoomCard'

const Embed = ({data: {loading, rooms}}) => loading
  ? <div style={styles.spinner}><CircularProgress /></div>
  : <div style={styles.roomContainer}>
    {
      rooms.map(room => <RoomCard room={room} key={room.id} />)
    }
  </div>

const {arrayOf, shape, bool, object} = PropTypes

Embed.proptypes = {
  data: shape({
    loading: bool.isRequired,
    room: arrayOf(object).isRequired
  })
}

export default Embed

const styles = {
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  },
  roomContainer: {
    marginTop: 40
  }
}
