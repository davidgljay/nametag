'use strict';

var React = require('react');

var Participant = React.createClass({
	render:function() {
		var star ='';
		console.log(this.props)
		if (this.props.mod==this.props.member_id) {
			star=<span className="glyphicon glyphicon-star" aria-hidden="true"></span>;
		}
		return(
			<div>
				{star}
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