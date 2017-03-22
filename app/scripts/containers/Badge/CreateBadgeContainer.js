import { connect } from 'react-redux'
import component from '../../components/Badge/CreateBadge'
// import {logout, setting, providerAuth, appendUserArray} from '../../actions/UserActions'
// import {createBadge} from '../../actions/BadgeActions'

const mapStateToProps = (state, ownProps) => {
  return Object.assign(
    {},
    {
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
    // createBadge (...args) {
    //   return dispatch(createBadge.apply(this, args))
    // },
    // appendUserArray (...args) {
    //   return dispatch(appendUserArray.apply(this, args))
    // }
  }
}

const Badge = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Badge
