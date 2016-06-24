import React, { Component, PropTypes } from 'react';
import Badges from '../Badge/Badges';

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

    console.log(this.props.nametagId);
    return <div key={this.props.name} >
        {star}
        <img src={this.props.icon} alt={this.props.name} className="img-circle icon"/>
        <div className="name">{this.props.name}</div>
        <div className="bio">{this.props.bio}</div>
        <Badges roomId={this.props.roomId} nametagId={this.props.nametagId}/>
      </div>;
  }
}

Nametag.propTypes = {
  name: PropTypes.string,
  bio: PropTypes.string,
  nametagId: PropTypes.string,
  icon: PropTypes.string,
  badges: PropTypes.array,
  roomId: PropTypes.string,
};
Nametag.defaultProps = {
  name: 'davidgljay',
  bio: 'Here to party!',
};

export default Nametag;
