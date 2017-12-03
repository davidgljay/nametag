import { connect } from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/RoomCards'
import {roomsQuery} from '../../graph/queries'

const mapStateToProps = state => {
  return {
    nametagEdits: state.nametagEdits
  }
}

const mapDispatchToProps = dispatch => ({})

const RoomCards = compose(
  connect(mapStateToProps, mapDispatchToProps),
  roomsQuery
)(component)

export default RoomCards
