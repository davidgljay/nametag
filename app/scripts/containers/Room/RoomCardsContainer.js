import { connect } from 'react-redux'
import component from '../../components/Room/RoomCards'
import {addUserNametag, watchUserNametags} from '../../actions/UserNametagActions'
import {watchNametag, unWatchNametag} from '../../actions/NametagActions'
import {logout, setting, providerAuth} from '../../actions/UserActions'
import {subscribe, unsubscribe} from '../../actions/RoomActions'
const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    nametags: state.nametags,
    user: state.user ? state.user : {loggedIn: false},
    userNametags: state.userNametags,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchUserNametags(roomId, userId) {
      return dispatch(watchUserNametags(roomId, userId))
    },
    subscribe(roomId) {
      return dispatch(subscribe(roomId))
    },
    unsubscribe(roomId) {
      return dispatch(unsubscribe(roomId))
    },
    addUserNametag(roomId, nametagId) {
      return dispatch(addUserNametag(roomId, nametagId))
    },
    watchNametag(nametagId) {
      return dispatch(watchNametag(nametagId))
    },
    unWatchNametag(nametagId) {
      return dispatch(unWatchNametag(nametagId))
    },
    logout() {
      return dispatch(logout())
    },
    setting(option, value) {
      return dispatch(setting(option, value))
    },
    providerAuth(provider) {
      return dispatch(providerAuth(provider))
    },
  }
}

const RoomCards = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default RoomCards
