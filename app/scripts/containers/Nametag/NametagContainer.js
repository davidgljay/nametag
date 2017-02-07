import { connect } from 'react-redux'
import component from '../../components/Nametag/Nametag'

const mapStateToProps = (state, ownProps) => {
  return {...state.nametags[ownProps.id], ...ownProps}
}

const Nametag = connect(
  mapStateToProps,
  () => ({})
)(component)

export default Nametag
