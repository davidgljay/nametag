import { connect } from 'react-redux'
import component from '../../ui/Room/RoomCards'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
  }
}

const RoomCards = connect(
  mapStateToProps
)(component)

export default RoomCards
