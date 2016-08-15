import { connect } from 'react-redux'
import component from '../../ui/Room/RoomCards'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {dispatch}
}

const RoomCards = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default RoomCards
