import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';
import Badge from './Badge';
import fbase from '../../api/firebase';


class UserBadges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      badges: [],
    };
  }

  componentDidMount() {
    let self = this;
    const userBadgeRef = fbase.child('/user_badges/' + this.context.userAuth.uid);
    const badgeRef = fbase.child('badges');
    userBadgeRef.on('child_added', function onChildAdded(badgeId) {
      badgeRef.child(badgeId.val())
         .on('value', function onValue(badge) {
           self.setState(function setState(prevState) {
             let badgeData = badge.val();
             badgeData.id = badgeId.val();
             prevState.badges.push(badgeData);
             return prevState;
           });
        }, errorLog('Error getting badge info'));
    });
    // TODO: Replace with a function that checks the blockchain, probably a node cluster.
  }

  componentWillUnmount() {
    const userBadgeRef = fbase.child('/user_badges/' + this.context.userAuth.uid);
    const badgeRef = fbase.child('badges');
    for (let i = 0; i < this.state.badges.length; i++) {
      badgeRef.child(this.state.badges[i].id)
         .off('value');
    }
    userBadgeRef.off('child_added');
  }

  render() {
    // TODO: Figure out how to expand and contract badges
    return <div id="badges">
          {this.state.badges.map(function mapBadges(badge) {
            return <Badge badge={badge} key={badge.id}/>;
          })}
        </div>;
  }
}

UserBadges.contextTypes = {
  userAuth: PropTypes.object,
};

export default UserBadges;
