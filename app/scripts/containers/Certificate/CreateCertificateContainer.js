import { connect } from 'react-redux'
import component from '../../components/Certificate/CreateCertificate'
import {logout, setting, providerAuth} from '../../actions/UserActions'
import {createCertificate} from '../../actions/CertificateActions'

const mapStateToProps = (state, ownProps) => {
  return Object.assign(
    {},
    {
      user: state.user,
    },
    ownProps.params)
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout() {
      return dispatch(logout())
    },
    setting(option, value) {
      return dispatch(setting(option, value))
    },
    providerAuth(provider) {
      return dispatch(providerAuth(provider))
    },
    createCertificate(...args) {
      return dispatch(createCertificate.apply(this, args))
    },
  }
}

const Certificate = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Certificate
