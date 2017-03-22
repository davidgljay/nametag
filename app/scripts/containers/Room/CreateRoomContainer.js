import { connect } from 'react-redux'
import component from '../../components/Room/CreateRoom'
import {searchImage, setImageFromUrl, setRoomProp} from '../../actions/RoomActions'
// import {getUser, logout, setting, appendUserArray} from '../../actions/UserActions'
// import {fetchBadges} from '../../actions/BadgeActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
    userNametags: state.userNametags
  }
}

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    searchImage: disp(searchImage),
    // postRoom: disp(postRoom),
    // joinRoom: disp(joinRoom),
    // setting: disp(setting),
    setImageFromUrl: disp(setImageFromUrl),
    // appendUserArray: disp(appendUserArray),
    setRoomProp: disp(setRoomProp)
  }
}

const CreateRoom = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default CreateRoom
