import { connect } from 'react-redux'
import * as actions from '../../actions/NametagActions'
import component from '../../components/Nametag/Nametag'

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
