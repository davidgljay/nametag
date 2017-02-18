import { connect } from 'react-redux'
import component from '../../components/Badge/BadgeDetail'
import {logout, setting, providerAuth, appendUserArray} from '../../actions/UserActions'
import {fetchBadge, grantBadge} from '../../actions/BadgeActions'

const mapStateToProps = (state, ownProps) => {
  return Object.assign(
    {},
    {
      certificate: state.certificates[ownProps.params.certificateId],
      user: state.user
    },
    ownProps.params)
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout () {
      return dispatch(logout())
    },
    setting (option, value) {
      return dispatch(setting(option, value))
    },
    providerAuth (provider) {
      return dispatch(providerAuth(provider))
    },
    appendUserArray (...args) {
      return dispatch(appendUserArray.apply(this, args))
    },
    fetchBadge (...args) {
      return dispatch(fetchBadge.apply(this, args))
    },
    grantBadge (...args) {
      return dispatch(grantBadge.apply(this, args))
    }
  }
}

const Badge = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Badge
