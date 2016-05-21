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
	componentDidMount:function() {
		//TODO: Replace with a function that checks the blockchain, probably a node cluster.
		var badgeRef = new Firebase(process.env.FIREBASE_URL + "badges"),
		self = this;
		for (var i=0; i<this.props.badges.length; i++) {
			badgeRef.child(this.props.badges[i])
				.on('value', function(value) {
					self.setState(function(prevState) {
						prevState.badges.push(value.val());
						return prevState;
					})
				}, errorLog("Error getting badge info"));
		}
	},
	componentWillUnmount:function() {
		var badgeRef = new Firebase(process.env.FIREBASE_URL + "badges");
		for (var i=0; i<this.props.badges.length; i++) {
			badgeRef.child(this.props.badges[i])
				.off('value');
		}	

	},
	render: function() {
		//TODO: Figure out how to expand and contract badges
		return (
				<div id="badges">
					<ul>
					{this.props.badges.map(function(badge) {
						return <Badge name={badge.name} key={badge.name}/>;
					})}
					</ul>
				</div>
			)
	}
})

Badges.propTypes = { badges: React.propTypes.Array };

module.exports = Badges;