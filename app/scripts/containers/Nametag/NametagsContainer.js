import { connect } from 'react-redux'
import component from '../../components/Nametag/Nametags'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, {nametags: state.nametags}, ownProps)
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  }
}

const Nametags = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Nametags
