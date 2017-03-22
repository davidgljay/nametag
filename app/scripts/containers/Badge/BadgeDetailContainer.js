import { connect } from 'react-redux'
import component from '../../components/Badge/BadgeDetail'
// import {logout, setting, providerAuth, appendUserArray} from '../../actions/UserActions'
// import {fetchBadges, grantBadge} from '../../actions/BadgeActions'

const mapStateToProps = (state, ownProps) => {
  return Object.assign(
    {},
    {
      certificate: state.badges[ownProps.params.certificateId],
      user: state.user
    },
    ownProps.params)
}

const mapDispatchToProps = (dispatch) => {
  return {
    // logout () {
    //   return dispatch(logout())
    // },
    // setting (option, value) {
    //   return dispatch(setting(option, value))
    // },
    // providerAuth (provider) {
    //   return dispatch(providerAuth(provider))
    // },
    // appendUserArray (...args) {
    //   return dispatch(appendUserArray.apply(this, args))
    // },
    // fetchBadges (...args) {
    //   return dispatch(fetchBadges.apply(this, args))
    // },
    // grantBadge (...args) {
    //   return dispatch(grantBadge.apply(this, args))
    // }
  }
}

const Badge = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Badge
