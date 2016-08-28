import { connect } from 'react-redux'
import component from '../../components/Room/Room'

const mapStateToProps = (state, props) => {
  return {
    room: state.rooms[props.params.roomId],
    user: state.user,
  }
}

const Room = connect(
  mapStateToProps
)(component)

export default Room
