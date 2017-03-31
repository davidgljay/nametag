import component from '../../components/Badge/BadgeDetail'
import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import {createNametag} from '../../graph/mutations'
import {badgeTemplateQuery} from '../../graph/queries'
import {updateNametagEdit, addNametagEditBadge, removeNametagEditBadge} from '../../actions/NametagEditActions'

const mapStateToProps = (state) => {
  return {
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

const CreateBadge = compose(
  connect(mapStateToProps, mapDispatchToProps),
  createNametag,
  badgeTemplateQuery
)(component)

export default CreateBadge
