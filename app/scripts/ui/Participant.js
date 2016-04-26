'use strict';

var React = require('react');

var Participant = React.createClass({
	render:function() {
		return(
			<div>
				<h4 className="participantName">{this.props.name}</h4>
				<div className="participantBio">{this.props.bio}</div>
			</div>
			);
	}
})

Participant.propTypes = { name: React.PropTypes.string, bio: React.PropTypes.string, member_id: React.PropTypes.string };
Participant.defaultProps = {
	name:'davidgljay',
	bio:'Here to party!'
};

module.exports=Participant;