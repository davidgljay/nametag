import component from '../../components/Badge/BadgeDetail'
import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import {createNametag, updateToken} from '../../graph/mutations'
import {templateQuery} from '../../graph/queries'
import {loginUser, registerUser} from '../../actions/UserActions'
import {requestNotifPermissions} from '../../actions/NotificationActions'
import {updateNametagEdit, addNametagEditBadge, removeNametagEditBadge} from '../../actions/NametagEditActions'

const mapStateToProps = (state) => {
  return {
    nametagEdits: state.nametagEdits
  }
}

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    loginUser: disp(loginUser),
    registerUser: disp(registerUser),
    updateNametagEdit: disp(updateNametagEdit),
    addNametagEditBadge: disp(addNametagEditBadge),
    removeNametagEditBadge: disp(removeNametagEditBadge),
    requestNotifPermissions: disp(requestNotifPermissions)
  }
}

const CreateBadge = compose(
  connect(mapStateToProps, mapDispatchToProps),
  createNametag,
  updateToken,
  templateQuery
)(component)

export default CreateBadge
