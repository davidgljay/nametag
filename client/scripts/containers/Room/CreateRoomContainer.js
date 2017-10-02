import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/CreateRoom'
import {loginUser, registerUser} from '../../actions/UserActions'
import {updateNametagEdit, addNametagEditBadge, removeNametagEditBadge, passwordResetRequest} from '../../actions/NametagEditActions'
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
    registerUser: disp(registerUser),
    loginUser: disp(loginUser),
    passwordResetRequest: disp(passwordResetRequest),
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
