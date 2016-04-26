'use strict';

var React = require('react'),
Participant = require('./Participant');

var Participants = React.createClass({
	getInitialState:function(){
		var self = this;
		//Get participant data
		var pRef = new Firebase('https://badgespace.firebaseio.com/participants/'+this.props.roomid);
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

		//Get badge data for each participants
	    var pBadgeRef = new Firebase('https://badgespace.firebaseio.com/participant_badges/'+this.props.userid+'/'+this.props.roomid);
	    var getpBadges = function(memberid) {
	    	pBadgeRef.child(memberid);
	    	pBadgeRef.on('value', function(badges) {
	    		self.setState(function(previousState) {
	    			previousState.participants[memberid].badges = badges.val();
	    			return previousState;
	    		})
	    	},
	    	function(err) {
	    		console.log("Error getting participant badge data")
	    	});
	    }
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
			return  (
			<li key={participant.name} className="list-group-item participantProfile">
				<Participant name={participant.name} bio={participant.bio} icon={participant.icon} badges={participant.badges} mod={mod}/>
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

Participants.propTypes = { roomid: React.PropTypes.string, mod:React.PropTypes.string };
Participants.defaultProps = {roomid: "stampi", mod:"wxyz", userid:"abcd"};


module.exports = Participants;