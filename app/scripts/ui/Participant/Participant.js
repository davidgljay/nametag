import React, { Component, PropTypes } from 'react';
import Badges from './Badges';

class Participant extends Component {
  render() {
    let star = '';

    // Show if user is a mod.
    if (this.props.mod === this.props.member_id) {
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
        <Badges/>
      </div>;
  }
}

Participant.propTypes = {
  name: PropTypes.string,
  bio: PropTypes.string,
  member_id: PropTypes.string,
  icon: PropTypes.string,
  badges: PropTypes.array,
};
Participant.defaultProps = {
  name: 'davidgljay',
  bio: 'Here to party!',
};

export default Participant;
