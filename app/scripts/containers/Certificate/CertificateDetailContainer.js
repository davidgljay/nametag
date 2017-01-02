import { connect } from 'react-redux'
import component from '../../components/Certificate/CertificateDetail'
import {logout, setting, providerAuth, appendUserArray} from '../../actions/UserActions'
import {fetchCertificate, grantCertificate} from '../../actions/CertificateActions'

const mapStateToProps = (state, ownProps) => {
  return Object.assign(
    {},
    {
      certificate: state.certificates[ownProps.params.certificateId],
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
    appendUserArray(...args) {
      return dispatch(appendUserArray.apply(this, args))
    },
    fetchCertificate(...args) {
      return dispatch(fetchCertificate.apply(this, args))
    },
    grantCertificate(...args) {
      return dispatch(grantCertificate.apply(this, args))
    },
  }
}

const Certificate = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Certificate
