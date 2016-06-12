import React, { Component, PropTypes } from 'react';
import fbase from '../../api/firebase';
import Badge from './Badge';

class Badges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      badges: [],
    };
  }

  componentDidMount() {
    let self = this;
    const badgesRef = fbase.child('/nametag_badges/' + this.props.roomId);
    badgesRef.on('child_added', function onChildAdded(badgeInfo) {
      self.setState(function setState(prevState) {
        prevState.badges.push(badgeInfo.val());
        return prevState;
      });
    });
    // TODO: Replace with a function that checks the blockchain, probably a node cluster.
  }

  componentWillUnmount() {
    const badgesRef = fbase.child('/nametag_badges/' + this.props.uid);
    badgesRef.off('child_added');
  }

  render() {
    // TODO: Figure out how to expand and contract badges
    console.log(this.state.badges);
    return <div id="badges">
           {this.state.badges.map(function mapBadges(badge) {
             return <Badge badge={badge} key={badge.id}/>;
           })}
        </div>;
  }
}

Badges.propTypes = { roomId: PropTypes.string };

export default Badges;