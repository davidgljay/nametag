'use strict';

var React = require('react');

var Participant = React.createClass({
	render:function() {
		var star ='';

		//Show if user is a mod.
		if (this.props.mod==this.props.member_id) {
			star=(<div className="ismod">
					<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
					<div>Mod</div>
				  </div>);
		}

		//Show badges

		return(
			<div>
				{star}
				<img src={this.props.icon} alt={this.props.name} className="img-circle"/>
				<div className="name">{this.props.name}</div>
				<div className="bio">{this.props.bio}</div>
				<div className="badges"></div>
			</div>
			);
	}
})

Participant.propTypes = { name: React.PropTypes.string, bio: React.PropTypes.string, member_id: React.PropTypes.string, icon: React.PropTypes.string };
Participant.defaultProps = {
	name:'davidgljay',
	bio:'Here to party!'
};

module.exports=Participant;