import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';
import Certificate from './Certificate';
import fbase from '../../api/firebase';


class UserCertificates extends Component {

  constructor(props) {
    super(props);
    this.state = {
      certificates: [],
    };
  }

  componentDidMount() {
    let self = this;
    const userCertificateRef = fbase.child('/user_certificates/' + this.context.userAuth.uid);
    const certificateRef = fbase.child('certificates');
    userCertificateRef.on('child_added', function onChildAdded(certificateId) {
      certificateRef.child(certificateId.val())
         .on('value', function onValue(certificate) {
           self.setState(function setState(prevState) {
             let certificateData = certificate.val();
             certificateData.id = certificateId.val();
             prevState.certificates.push(certificateData);
             return prevState;
           });
        }, errorLog('Error getting certificate info'));
    });
    // TODO: Replace with a function that checks the blockchain, probably a node cluster.
  }

  componentWillUnmount() {
    const usercertificateRef = fbase.child('/user_certificates/' + this.context.userAuth.uid);
    const certificateRef = fbase.child('certificates');
    for (let i = 0; i < this.state.certificates.length; i++) {
      certificateRef.child(this.state.certificates[i].id)
         .off('value');
    }
    usercertificateRef.off('child_added');
  }

  render() {
    // TODO: Figure out how to expand and contract certificates
    return <div id="certificates">
          {this.state.certificates.map(function mapCertificates(certificate) {
            return <Certificate certificate={certificate} key={certificate.id} draggable={true}/>;
          })}
        </div>;
  }
}

UserCertificates.contextTypes = {
  userAuth: PropTypes.object,
};

export default UserCertificates;
