'use strict'

var React = require('react'),
errorLog = require('../../utils/errorLog'),
Login = require('../Participant/Login'),
EditNametag = require('../Participant/EditNametag'),
Badges = require('../Participant/Badges'),
Alert = require('../Utils/Alert');

var Join = React.createClass({
	getInitialState:function() {
		return {
			alert:null
		};
	},
	contextTypes: {
		userAuth:React.PropTypes.object,
		checkAuth:React.PropTypes.func
	},
	updateNametag(property) {
		var self=this;
		return function(e) {
			var val = e.target.value;
			self.setState(function(prevState) {
				prevState.nametag['name']=e.target.value;
				return prevState;
			});
		}

	},
	joinRoom:function() {
		if (!this.props.normsChecked) {
			this.setState({'alert':'You must agree to the norms above in order to join this conversation.'});
		} else {
			var participantRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.props.roomId);
			participantRef.push(this.state.participant);

			window.location="/#/rooms/" + this.props.roomId;
		}
	},
	render:function() {
		if (this.context.userAuth) {
			return (
				<div id="join">
					<Alert alertType='danger' alert={this.state.alert}/>
					<h4>How would you like to appear in this room?</h4>
					<Badges/>
					<EditNametag login={this.context.userAuth} roomId={this.props.roomId} updateNametag={this.updateNametag}/>
					<button className="btn btn-primary" onClick={this.joinRoom}>Join</button>
				</div>
				);
		} else {
			return (<Login/>);
		}
	}
});

Join.propTypes={roomId:React.PropTypes.string, normsChecked:React.PropTypes.bool};

module.exports=Join;

