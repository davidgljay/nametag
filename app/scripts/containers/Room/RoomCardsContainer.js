import { connect } from 'react-redux'
import component from '../../components/Room/RoomCards'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
  }
}

const RoomCards = connect(
  mapStateToProps
)(component)

export default RoomCards
