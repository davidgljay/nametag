import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';
import Alert from '../Utils/Alert';
import Certificate from '../Certificate/Certificate';
import { DropTarget } from 'react-dnd';
import { dragTypes } from '../../constants';
import fbase from '../../api/firebase';
import style from '../../../styles/Nametag/EditNametag.css';

const nametagTarget = {
  drop(props, monitor) {
    addCertificate(props, monitor.getItem());
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

function addCertificate(props, certificate) {
  props.addNametagCertificate(certificate);
}

class EditNametag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      alertType: null,
    };
  }

  render() {
    console.log(this.props.nametag);
    // TODO: Figure out image caching
    return this.props.connectDropTarget(<div id={style.editNametag} className="profile">
          <div className={style.form}>
            <img
              src="https://s3.amazonaws.com/badgeproject_icons/users/dj_cropped.jpg"
              className={style.icon}/>
            <div className={style.nametagFields}>
                <input
                  type="text"
                  className={style.formControl + ' ' + style.name}
                  id={style.participantName}
                  onChange={this.props.updateNametag('name')}
                  value={this.props.nametag.name}
                  placeholder='Name'/>
                <textarea
                  rows="2"
                  className={style.formControl + ' ' + style.bio}
                  id={style.participantDescription}
                  onChange={this.props.updateNametag('bio')}
                  value={this.props.nametag.bio}
                  placeholder='Why are you joining this conversation?'/>
            </div>
            <div className="certificates">
              {this.props.nametag.certificates && this.props.nametag.certificates.map(function mapCertificates(cert) {
                return <Certificate
                  certificate={cert}
                  draggable={true}
                  removeFromSource={this.props.removeNametagCertificate}
                  key={cert.id} />;
              }, this)}
            </div>
          </div>
        </div>);
  }
}

EditNametag.propTypes = {
  updateNametag: PropTypes.func.isRequired,
  addNametagCertificate: PropTypes.func.isRequired,
  nametag: PropTypes.object,
  isOver: PropTypes.bool.isRequired,
};

export default DropTarget(dragTypes.certificate, nametagTarget, collect)(EditNametag);
