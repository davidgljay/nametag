'use strict';

var React = require('react'),
Message = require('./Message'),
ModActionNotif = require('./ModActionNotif');

var Messages = React.createClass({
	getInitialState:function() {
		var self = this;
		//TODO: move to componentdidmount
		var messageListRef = new Firebase('https://badgespace.firebaseio.com/room_messages/'+this.props.roomId);
	    messageListRef.on('child_added',function(value) {
	    	var mId = value.val();
    		new Firebase(process.env.FIREBASE_URL + '/messages/' + mId)
    			.on('value',function(messageObj) {
    				if (!messageObj.exists()) {
    					return;
    				}

    				//Scroll to the bottom if the message was created before the user entered the room.
    				var message = messageObj.val();
    				message.id = messageObj.key();

    				self.setState(function(previousState) {
    					previousState.messages[message.id] = message;
    					return previousState;
    				})

    				//TODO: Animate scrolling
    				window.scrollBy(0,90);
    			});
	    }, 
	    function(err) {
	      console.log("Error getting room from FB:" + err);
	    }, this);
		return {
			messages:{},
			modActions:{},
			startTime: Date.now()
		};
	},
	componentDidMount:function() {
		var self=this;

		//Add mod actions to state for display
		var modActionPubRef = new Firebase(process.env.FIREBASE_URL + "/mod_actions/" + this.props.roomId + "/public"),
		modActionPrivRef = new Firebase(process.env.FIREBASE_URL + "/mod_actions/" + this.props.roomId + "/private/" + this.props.participantId),
		addModAction = function(data) {
			var modAction = data.val();
			modAction.msgId = data.key();
			console.log("Adding Mod action");
			self.setState(function (previousState) {
				previousState.modActions[modAction.msgId]=modAction;
				return previousState;
			})
		};

		modActionPubRef.on('child_added', addModAction);
		modActionPrivRef.on('child_added', addModAction);

	},
	componentWillUnmount:function() {
		var modActionPubRef = new Firebase(process.env.FIREBASE_URL + "/mod_actions/" + this.props.roomId + "/public"),
		modActionPrivRef = new Firebase(process.env.FIREBASE_URL + "/mod_actions/" + this.props.roomId + "/private/" + this.props.participantId);

		modActionPubRef.off("child_added");
		modActionPrivRef.off("child_added");
	},
	render:function() {

		var messages = [],
		self=this;
		//Add messages and ModActions to a single array and sort by timestamp
		for (var message in this.state.messages) {
			var msgData = this.state.messages[message];
			msgData.type = "message";
			messages.push(msgData);
		}
		for (var modAction in this.state.modActions) {
			var maData = this.state.modActions[modAction];
			maData.type = "modAction";
			messages.push(maData);
		}
		messages.sort(function(a,b) {
			return a.timestamp - b.timestamp;
		});

		//TODO: remove bootstrap formatting and make full width;

		return (
			<div id="messages">
				<table id="msgContainer">
					<tbody>
					{messages.map(function(message) {
						if (message.type == "message") {
							return (
								<Message id={message.id} text={message.text} timestamp={message.timestamp} author={message.author} roomId={self.props.roomId} key={message.id}/>
							);		
						} else if (message.type == "modAction") {
							return (
									<ModActionNotif id={"ma" + message.msgId} modAction={message} roomId={self.props.roomId} key={"ma" + message.msgId}/>
								);
						}
					})}
					</tbody>
				</table>
			</div>
			)
	}
})

Messages.propTypes = { roomId: React.PropTypes.string, participantId: React.PropTypes.string };
Messages.defaultProps = { roomId:'stampi' };

module.exports=Messages;