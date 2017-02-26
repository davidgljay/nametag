import { connect } from 'react-redux'
import component from '../../components/Badge/Badge'

const mapStateToProps = (state, ownProps) => {
  return {...ownProps, badge: state.badges[ownProps.id]}
}

const Badge = connect(
  mapStateToProps
)(component)

export default Badge
