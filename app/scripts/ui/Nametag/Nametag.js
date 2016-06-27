import React, { Component, PropTypes } from 'react';
import Certificates from '../Certificate/Certificates';

class Nametag extends Component {
  render() {
    let star = '';

    // Show if user is a mod.
    if (this.props.mod === this.props.nametagId) {
      star = <div className="ismod">
          <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
          <div className="modTitle">Host</div>
          </div>;
    }

    return <div key={this.props.name} >
        {star}
        <img src={this.props.icon} alt={this.props.name} className="img-circle icon"/>
        <div className="name">{this.props.name}</div>
        <div className="bio">{this.props.bio}</div>
        <Certificates certificates={this.props.certificates} />
      </div>;
  }
}

Nametag.propTypes = {
  name: PropTypes.string,
  bio: PropTypes.string,
  certificates: PropTypes.array.isRequired,
  icon: PropTypes.string,
  roomId: PropTypes.string,
};
Nametag.defaultProps = {
  name: 'davidgljay',
  bio: 'Here to party!',
};

export default Nametag;
