import { connect } from 'react-redux'
import component from '../../components/Room/CreateRoom'
import * as NametagActions from '../../actions/NametagActions'
import * as RoomActions from '../../actions/RoomActions'
import * as UserActions from '../../actions/UserActions'
import * as CertificateActions from '../../actions/CertificateActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
    userNametags: state.userNametags
  }
}

const mapDispatchToProps = (dispatch) => {
  const actions = Object.assign(
    {},
    NametagActions,
    RoomActions,
    UserActions,
    CertificateActions)
  return Object.keys(actions).reduce((actionsObj, key) => {
    actionsObj[key] = (...args) => dispatch(actions[key].apply(null, args))
    return actionsObj
  }, {})
}

const CreateRoom = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default CreateRoom
