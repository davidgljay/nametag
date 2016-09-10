import { connect } from 'react-redux'
import component from '../../components/Certificate/Certificate'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, {certificate:state.certificates[ownProps.id]}, ownProps)
}

const Certificate = connect(
  mapStateToProps
)(component)

export default Certificate
