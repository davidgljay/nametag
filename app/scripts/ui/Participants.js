'use strict';

var React = require('react'),
Participant = require('./Participant');

var Participants = React.createClass({
	getInitialState:function(){
		var fbref = new Firebase('https://badgespace.firebaseio.com/participants/'+this.props.roomid);
		fbref.on('value',function(value) {
       		this.setState({participants:value.val()});
	    }, 
	    function(err) {
	      console.log("Error getting room from FB:" + err);
	    }, this);
		return {
			fbref:fbref,
			participants:{}
		};
	},

	componentDidMount:function(){

	},
	componentWillUnmount:function(){

	},
	render:function(){
		//Push participants into an array;
		var participants_arr = [];
		for (var key in this.state.participants) {
			this.state.participants[key].member_id=key;
			participants_arr.push(this.state.participants[key]);
		}

		//Create a function to return list items
		var creatParticipant = function(participant) {
			return  (
			<li key={participant.name} className="list-group-item participantProfile">
				<Participant name={participant.name} bio={participant.bio} member_id={participant.member_id}/>
			</li>
			);
		};

		return (
			<ul id="participants" className="list-group">
				{participants_arr.map(function(participant) {
					return creatParticipant(participant);
				})}
			</ul>
		);
	}
})

Participants.propTypes = { roomid: React.PropTypes.string };
Participants.defaultProps = {roomid: "stampi"};


module.exports = Participants;