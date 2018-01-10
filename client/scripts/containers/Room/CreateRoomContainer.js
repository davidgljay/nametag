import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/CreateRoom'
import {userQuery} from '../../graph/queries'
import {createRoom} from '../../graph/mutations'

const mapStateToProps = (state) => ({
  rooms: state.rooms,
  data: state.apollo.data
})

const CreateRoomContainer = compose(
  connect(mapStateToProps, () => ({})),
  createRoom,
  userQuery
)(component)

export default CreateRoomContainer
