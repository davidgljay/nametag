'use strict';

var React = require('react'),
Message = require('./Message');

var Messages = React.createClass({
	getInitialState:function() {
		var self = this;
		var messageListRef = new Firebase('https://badgespace.firebaseio.com/room_messages/'+this.props.roomId);
	    messageListRef.on('child_added',function(value) {
	    	var mId = value.val();
    		new Firebase('https://badgespace.firebaseio.com/messages/' + mId)
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
			startTime: Date.now()
		};
	},
	render:function() {

		var messages = [],
		self=this;

		for (var message in this.state.messages) {
			messages.push(this.state.messages[message]);
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
						return (
								<Message id={message.id} text={message.text} timestamp={message.timestamp} author={message.author} roomId={self.props.roomId} key={message.id}/>
							);
					})}
					</tbody>
				</table>
			</div>
			)
	}
})

Messages.propTypes = { roomId: React.PropTypes.string };
Messages.defaultProps = { roomId:'stampi' };

module.exports=Messages;