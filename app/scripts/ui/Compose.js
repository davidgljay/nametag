'use strict';

var React = require('react');

var Compose = React.createClass({
	getInitialState:function(){
		var msgRef = new Firebase('https://badgespace.firebaseio.com/messages');
		var rmMsgRef = new Firebase('https://badgespace.firebaseio.com/room_messages/' + this.props.roomId);
		return {
			message:'',
			msgRef:msgRef,
			rmMsgRef:rmMsgRef
		};
	},
	onChange:function(e) {
		this.setState({message: e.target.value});
	},
	post:function(e) {
		e.preventDefault();
		if (this.state.message.length >0) {
			var newMsg = this.state.msgRef.push({
				text:this.state.message,
				timestamp:Date.now(),
				author:this.props.participantId
			}, function(err, res) {
				if (err) {
					console.log("Error posting message");
				};
			})
			this.state.rmMsgRef.push(newMsg.key())
			this.setState({message:''});
		}

	},
	render:function() {
		//TODO: Add GIFs, image upload, emoticons
		return (
			<form id="compose" className="input-group" onSubmit={this.post}>
				<input type="text" className="form-control" onChange={this.onChange} value={this.state.message}/>
				<span className="input-group-btn">
					<button className="btn btn-secondary"><span className="glyphicon glyphicon-send" aria-hidden="true"/></button>
				</span>
			</form>
			)
	}
})

Compose.propTypes = {roomId:React.PropTypes.string, participantId:React.PropTypes.string};

module.exports = Compose;