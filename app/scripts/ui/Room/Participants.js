'use strict';

var React = require('react'),
Participant = require('./Participant');

var Participants = React.createClass({
	getInitialState:function(){
		var self = this;

		//Get badge data for each participants
	    var pBadgeRef = new Firebase('https://badgespace.firebaseio.com/participant_badges/'+this.props.userid+'/'+this.props.roomId);
	    var getpBadges = function(memberid) {
	    	pBadgeRef.child(memberid).on('value', function(badges) {
	    		self.setState(function(previousState) {
	    			previousState.participants[memberid].badges = badges.val();
	    			return previousState;
	    		})
	    	},
	    	function(err) {
	    		console.log("Error getting participant badge data")
	    	});
	    }

	    		//Get participant data
		var pRef = new Firebase('https://badgespace.firebaseio.com/participants/'+this.props.roomId);
		pRef.on('value',function(participants) {
			var pdata = participants.val();
       		self.setState({participants:pdata});
       		for (var participant in pdata) {
       			getpBadges(pdata[participant].member_id);
       		}

	    }, 
	    function(err) {
	      console.log("Error getting participants from FB:" + err);
	    });
		return {
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
		participants_arr.sort(function(a,b) {
			if (a.mod) {
				return 1
			} else {
				return -1;
			}
		})

		//Create a function to return list items
		var creatParticipant = function(participant, mod) {
			//Make participant.badges an empty array if it not already assigned.
			participant.badges = participant.badges || [];

			return  (
			<li key={participant.name} className="list-group-item profile">
				<Participant name={participant.name} bio={participant.bio} icon={participant.icon} member_id={participant.member_id} badges={participant.badges} mod={mod}/>
			</li>
			);
		};

		return (
			<ul id="participants" className="list-group">
				{participants_arr.map(function(participant) {
					return creatParticipant(participant, this.props.mod);
				}, this)}
			</ul>
		);
	}
});

Participants.propTypes = { roomId: React.PropTypes.string, mod:React.PropTypes.string };
Participants.defaultProps = {roomId: "stampi", mod:"wxyz", userid:"abcd"};


module.exports = Participants;