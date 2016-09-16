import { connect } from 'react-redux'
import * as actions from '../../actions/NametagActions'
import component from '../../components/Nametag/Nametag'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, state.nametags[ownProps.id], ownProps)
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchNametag: (nametagId, roomId) => {
      dispatch(actions.watchNametag(nametagId, roomId))
    },
    unWatchNametag: (nametagId, roomId) => {
      dispatch(actions.unWatchNametag(nametagId, roomId))
    },
  }
}

const Nametag = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Nametag
