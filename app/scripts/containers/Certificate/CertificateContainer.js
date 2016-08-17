import { connect } from 'react-redux'
import component from '../../ui/Certificate/Certificate'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, state.certificates[ownProps.id], ownProps)
}

const mapDispatchToProps = (dispatch) => dispatch

const Certificate = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Certificate
