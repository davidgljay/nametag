'use strict';

var React = require('react');

var Participants = React.createClass({
	getInitialState:function(){
		var fbref = new Firebase('https://badgeproject.firebaseio.com/participants/'+this.props.roomid);
		return null;
	},
	componentDidMount:function(){

	},
	componentDidUnmount:function(){

	},
	render:function(){
		var creatParticipant = function(participants) {
			return  (
			<li key={participants}>
				<participants fbref={participants}/>
			</li>
			);
		};
		return (
			<ul>
			{this.state.participants.map(function(participants){createmember(participants)})};
		</ul>
		);
	}
})

Participants.propTypes = { roomid: React.PropTypes.string };
Participants.defaultProps = {roomid: "stampi"};


module.exports = Participants;