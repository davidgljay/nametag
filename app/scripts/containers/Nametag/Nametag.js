import { connect } from 'react-redux'
import * as actions from '../../actions/Nametag'
import component from '../../ui/Nametag/Nametag'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, state.nametags[ownProps.id], ownProps)
}

const mapDispatchToProps = (dispatch) => {
  return {
    subscribe: (nametagId, roomId) => {
      dispatch(actions.subscribe(nametagId, roomId))
    },
    unsubscribe: (nametagId, roomId) => {
      dispatch(actions.unsubscribe(nametagId, roomId))
    },
  }
}

const Nametag = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Nametag
