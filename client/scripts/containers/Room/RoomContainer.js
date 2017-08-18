import {connect} from 'react-redux'
import component from '../../components/Room/Room'
import {compose} from 'react-apollo'
import {roomQuery} from '../../graph/queries'
import {registerUser, loginUser} from '../../actions/UserActions'
import {
  createMessage,
  createNametag,
  toggleSaved,
  updateLatestVisit,
  updateToken,
  updateRoom,
  updateNametag,
  deleteMessage,
  addReaction
} from '../../graph/mutations'
import {requestNotifPermissions} from '../../actions/NotificationActions'
import {
  updateNametagEdit,
  addNametagEditBadge,
  removeNametagEditBadge
} from '../../actions/NametagEditActions'

function getMyNametag ({data}) {
  const {me, room} = data
  if (!room || !me || !room.nametags || !me.nametags) {
    return null
  }
  const myNt = me.nametags.find(
    (nametag) => nametag.room && nametag.room.id === room.id
  )
  return room.nametags.filter((nt) => nt.id === myNt.id)[0]
}

const mapStateToProps = (state, ownProps) => {
  return {
    myNametag: getMyNametag(ownProps),
    nametagEdits: state.nametagEdits
  }
}

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    requestNotifPermissions: disp(requestNotifPermissions),
    updateNametagEdit: disp(updateNametagEdit),
    addNametagEditBadge: disp(addNametagEditBadge),
    removeNametagEditBadge: disp(removeNametagEditBadge),
    registerUser: disp(registerUser),
    loginUser: disp(loginUser)
  }
}

const Room = compose(
  createMessage,
  createNametag,
  toggleSaved,
  updateRoom,
  updateNametag,
  updateLatestVisit,
  updateToken,
  deleteMessage,
  addReaction,
  roomQuery,
  connect(mapStateToProps, mapDispatchToProps)
)(component)

export default Room
