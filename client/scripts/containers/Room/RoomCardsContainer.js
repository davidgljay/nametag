import { connect } from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/RoomCards'
import {roomsQuery} from '../../graph/queries'
import {contactForm} from '../../actions/RoomActions'

const mapStateToProps = state => {
  return {
    nametagEdits: state.nametagEdits
  }
}

const mapDispatchToProps = dispatch => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    contactForm: disp(contactForm)
  }
}

const RoomCards = compose(
  connect(mapStateToProps, mapDispatchToProps),
  roomsQuery
)(component)

export default RoomCards
