import { connect } from 'react-redux'
import component from '../../components/Badge/Badge'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, {certificate: state.badges[ownProps.id]}, ownProps)
}

const Badge = connect(
  mapStateToProps
)(component)

export default Badge
