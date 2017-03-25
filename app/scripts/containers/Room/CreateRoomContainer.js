import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/CreateRoom'
import {searchImage, setImageFromUrl} from '../../actions/RoomActions'
import {updateNametagEdit, addNametagEditBadge, removeNametagEditBadge} from '../../actions/NametagEditActions'
import {createRoomQuery} from '../../graph/queries'
import {createRoom} from '../../graph/mutations'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    data: state.apollo.data,
    nametagEdits: state.nametagEdits
  }
}

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    searchImage: disp(searchImage),
    setImageFromUrl: disp(setImageFromUrl),
    updateNametagEdit: disp(updateNametagEdit),
    addNametagEditBadge: disp(addNametagEditBadge),
    removeNametagEditBadge: disp(removeNametagEditBadge)
  }
}

const CreateRoomContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  createRoom,
  createRoomQuery
)(component)

export default CreateRoomContainer
