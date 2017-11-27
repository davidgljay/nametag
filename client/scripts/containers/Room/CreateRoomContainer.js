import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/CreateRoom'
import {updateNametagEdit, addNametagEditBadge, removeNametagEditBadge} from '../../actions/NametagEditActions'
import {userQuery} from '../../graph/queries'
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
    updateNametagEdit: disp(updateNametagEdit),
    addNametagEditBadge: disp(addNametagEditBadge),
    removeNametagEditBadge: disp(removeNametagEditBadge)
  }
}

const CreateRoomContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  createRoom,
  userQuery
)(component)

export default CreateRoomContainer
