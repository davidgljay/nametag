import React, { Component, PropTypes } from 'react';
import fbase from '../../api/firebase';
import Certificate from './Certificate';

//TODO: Change to Certificates

class Certificates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certificates: [],
    };
  }

  componentDidMount() {
    let self = this;
    if (!this.props.nametagId) {
      return;
    }
    const certificatesRef = fbase.child('/nametag_certificates/' + this.props.roomId + '/' + this.props.nametagId);
    certificatesRef.on('child_added', function onChildAdded(certificateInfo) {
      self.setState(function setState(prevState) {
        prevState.certificates.push(certificateInfo.val());
        return prevState;
      });
    });
    // TODO: Replace with a function that checks the blockchain, probably a node cluster.
  }

  componentWillUnmount() {
    const certificatesRef = fbase.child('/nametag_certificates/' + this.props.uid + '/' + this.props.nametagId);
    certificatesRef.off('child_added');
  }

  render() {
    // TODO: Figure out how to expand and contract certificates
    return <div id="certificates">
           {this.state.certificates.map(function mapCertificates(certificate) {
             return <Certificate certificate={certificate} key={certificate.id}/>;
           })}
        </div>;
  }
}

Certificates.propTypes = {
  roomId: PropTypes.string.isRequired,
  nametagId: PropTypes.string.isRequired,
};

export default Certificates;