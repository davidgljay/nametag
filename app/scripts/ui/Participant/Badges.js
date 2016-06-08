import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';
import Badge from './Badge';


class Badges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      badges: [],
    };
  }

  componentDidMount() {
    // var self = this,
    // userBadgeRef = new Firebase(process.env.FIREBASE_URL + "/user_badges/" + this.context.userAuth.uid),
    // badgeRef = new Firebase(process.env.FIREBASE_URL + "badges");
    // userBadgeRef.on("child_added", function(badgeId) {
    //  badgeRef.child(badgeId.val())
    //    .on('value', function(badge) {
    //      self.setState(function(prevState) {
    //        var badgeData = badge.val();
    //        badgeData.id = badgeId.val();
    //        prevState.badges.push(badgeData);
    //        return prevState;
    //      });
    //    }, errorLog("Error getting badge info"));
    // });
    //TODO: Replace with a function that checks the blockchain, probably a node cluster.
  
  }

  componentWillUnmount() {
    // var userBadgeRef = new Firebase(process.env.FIREBASE_URL + "/user_badges/" + this.context.userAuth.uid),
    // badgeRef = new Firebase(process.env.FIREBASE_URL + "badges");
    // for (var i=0; i<this.state.badges.length; i++) {
    //  badgeRef.child(this.state.badges[i].id)
    //    .off('value');
    // }
    // userBadgeRef.off('child_added');

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

Badges.contextTypes = {
  userAuth: PropTypes.object,
};

export default Badges;
