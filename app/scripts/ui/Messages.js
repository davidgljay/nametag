'use strict';

var React = require('react'),
Message = require('./Message');

var Messages = React.createClass({
	getInitialState:function() {
		var self = this;
		var messageListRef = new Firebase('https://badgespace.firebaseio.com/room_messages/'+this.props.roomid+"/");
	    messageListRef.on('child_added',function(value) {
	    	var mId = value.val();
    		new Firebase('https://badgespace.firebaseio.com/messages/' + mId)
    			.on('value',function(messageObj) {
    				if (!messageObj.exists()) {
    					return;
    				}

    				self.setState(function(previousState) {
    					var message = messageObj.val();
    					message.id = messageObj.key();
    					previousState.messages[message.id] = message;
    					return previousState;
    				})
    			});
	    }, 
	    function(err) {
	      console.log("Error getting room from FB:" + err);
	    }, this);
		return {messages:{}};
	},
	render:function() {
		//TODO: Handle user icons

		var messages = [];

		for (var message in this.state.messages) {
			messages.push(this.state.messages[message]);
		}
		messages.sort(function(a,b) {
			return a.timestamp - b.timestamp;
		});

		//TODO: Handle date formatting.
		//TODO: Make separate message object;

		return (
			<div id="messages">
				{messages.map(function(message) {
					return (
						<Message text={message.text} date={message.date} key={message.id}/>
						);
				})}
			</div>
			)
	}
})

Messages.propTypes = { roomid: React.PropTypes.string };
Messages.defaultProps = { roomid:'stampi' };

module.exports=Messages;