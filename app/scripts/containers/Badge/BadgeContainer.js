import component from '../../components/Badge/BadgeDetail'
import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import {createNametag} from '../../graph/mutations'
import {templateQuery} from '../../graph/queries'
import {loginUser, registerUser} from '../../actions/UserActions'
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
    removeNametagEditBadge: disp(removeNametagEditBadge)
  }
}

const CreateBadge = compose(
  connect(mapStateToProps, mapDispatchToProps),
  createNametag,
  templateQuery
)(component)

export default CreateBadge
