import { connect } from 'react-redux'
import component from '../../components/Room/RoomCards'
import {getUserNametag} from '../../actions/UserActions'
import {subscribe, unsubscribe} from '../../actions/RoomActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserNametag(roomId, userId) {
      dispatch(getUserNametag(roomId, userId))
    },
    subscribe(roomId) {
      dispatch(subscribe(roomId))
    },
    unsubscribe(roomId) {
      dispatch(unsubscribe(roomId))
    },
  }
}

const RoomCards = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default RoomCards
