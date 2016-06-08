'uses strict';

var React = require('react'),
errorLog = require("../../utils/errorLog"),
Badge = require('./Badge');


var Badges = React.createClass({
	getInitialState:function() {
		return {
			badges:[]
		};
	},
	contextTypes: {
		userAuth:React.PropTypes.object
	},
	componentDidMount:function() {
		// var self = this,
		// userBadgeRef = new Firebase(process.env.FIREBASE_URL + "/user_badges/" + this.context.userAuth.uid),
		// badgeRef = new Firebase(process.env.FIREBASE_URL + "badges");
		// userBadgeRef.on("child_added", function(badgeId) {
		// 	badgeRef.child(badgeId.val())
		// 		.on('value', function(badge) {
		// 			self.setState(function(prevState) {
		// 				var badgeData = badge.val();
		// 				badgeData.id = badgeId.val();
		// 				prevState.badges.push(badgeData);
		// 				return prevState;
		// 			});
		// 		}, errorLog("Error getting badge info"));
		// });
		//TODO: Replace with a function that checks the blockchain, probably a node cluster.
	
	},
	componentWillUnmount:function() {
		// var userBadgeRef = new Firebase(process.env.FIREBASE_URL + "/user_badges/" + this.context.userAuth.uid),
		// badgeRef = new Firebase(process.env.FIREBASE_URL + "badges");
		// for (var i=0; i<this.state.badges.length; i++) {
		// 	badgeRef.child(this.state.badges[i].id)
		// 		.off('value');
		// }
		// userBadgeRef.off('child_added');

	},
	render: function() {
		//TODO: Figure out how to expand and contract badges
		return (
				<div id="badges">
					 {this.state.badges.map(function(badge) {
					 	return <Badge badge={badge} key={badge.id}/>;
					 })}
				</div>
			)
	}
})

module.exports = Badges;