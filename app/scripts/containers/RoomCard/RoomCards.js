import { connect } from 'react-redux'
import * as actions from '../../actions/RoomCard/RoomCard'
import component from '../../ui/RoomCard/RoomCards'

const mapStateToProps = (state) => {
  return {
    roomCards: state.roomCards,
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
