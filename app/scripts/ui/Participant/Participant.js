'use strict';

var React = require('react');

var Participant = React.createClass({
	render:function() {
		var star ='';

		//Show if user is a mod.
		if (this.props.mod==this.props.member_id) {
			star=(<div className="ismod">
					<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
					<div className="modTitle">Mod</div>
				  </div>);
		}

		return(
			<div key={this.props.name} >
				{star}
				<img src={this.props.icon} alt={this.props.name} className="img-circle icon"/>
				<div className="name">{this.props.name}</div>
				<div className="bio">{this.props.bio}</div>
				<div className="badges">
					{this.props.badges.map(function(badge){
						return <div className="label label-pill badge" key={badge.name}>{badge.name}</div>
					})}
				</div>
			</div>
			);
	}
})

Participant.propTypes = { name: React.PropTypes.string, bio: React.PropTypes.string, member_id: React.PropTypes.string, icon: React.PropTypes.string, badges:React.PropTypes.array };
Participant.defaultProps = {
	name:'davidgljay',
	bio:'Here to party!'
};

module.exports=Participant;