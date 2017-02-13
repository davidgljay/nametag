import { connect } from 'react-redux'
import component from '../../components/Room/RoomCards'
import {getAuth} from '../../api/horizon'
import {addUserNametag, watchUserNametags} from '../../actions/UserNametagActions'
import {watchNametags, unWatchNametag} from '../../actions/NametagActions'
import {logout, setting, providerAuth} from '../../actions/UserActions'
import {subscribe, unsubscribe} from '../../actions/RoomActions'
const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user ? state.user : {loggedIn: false},
    nametags: state.nametags,
    userNametags: state.userNametags,
    nametagEdits: state.nametagEdits
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchUserNametags (userId) {
      return dispatch(watchUserNametags(userId))
    },
    subscribe (roomId) {
      return dispatch(subscribe(roomId))
    },
    unsubscribe (roomId) {
      return dispatch(unsubscribe(roomId))
    },
    addUserNametag (roomId, nametagId) {
      return dispatch(addUserNametag(roomId, nametagId))
    },
    watchNametags (nametagIds) {
      return dispatch(watchNametags(nametagIds))
    },
    unWatchNametags () {
      return dispatch(unWatchNametag())
    },
    logout () {
      return dispatch(logout())
    },
    setting (option, value) {
      return dispatch(setting(option, value))
    },
    providerAuth (provider) {
      return dispatch(providerAuth(provider))
    },
    getAuth
  }
}

const RoomCards = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default RoomCards
