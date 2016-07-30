import { connect } from 'react-redux'
import * as actions from '../../actions/Room/Room'
import component from '../../ui/RoomCard/RoomCards'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    subscribe: () => {
      dispatch(actions.subscribe())
    },
    unsubscribe: () => {
      dispatch(actions.unsubscribe())
    },
  }
}

const RoomCards = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default RoomCards
