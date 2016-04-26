'use strict';

var React = require('react');

var Participant = React.createClass({
	render:function() {
		var star ='';
		if (this.props.mod==this.props.member_id) {
			star=(<div className="ismod">
					<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
					<div>Mod</div>
				  </div>);
		}
		return(
			<div>
				{star}
				<div className="name">{this.props.name}</div>
				<div className="bio">{this.props.bio}</div>
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