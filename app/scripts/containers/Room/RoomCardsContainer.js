import { connect } from 'react-redux'
import component from '../../components/Room/RoomCards'
import {getUserNametag} from '../../actions/UserActions'
import {watchNametag, unWatchNametag} from '../../actions/NametagActions'
import {subscribe, unsubscribe} from '../../actions/RoomActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
    nametags: state.nametags,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserNametag(roomId, userId) {
      return dispatch(getUserNametag(roomId, userId))
    },
    subscribe(roomId) {
      return dispatch(subscribe(roomId))
    },
    unsubscribe(roomId) {
      return dispatch(unsubscribe(roomId))
    },
    watchNametag(nametagId) {
      return dispatch(watchNametag(nametagId))
    },
    unWatchNametag(nametagId) {
      return dispatch(watchNametag(nametagId))
    },
  }
}

const RoomCards = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default RoomCards
