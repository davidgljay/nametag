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
			alert:null,
			nametag: {
				name:'',
				bio:'',
				icon:''
			}
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
				prevState.nametag[property]=val;
				return prevState;
			});
		}

	},
	componentDidMount:function() {
		var self=this,
		defaultsRef = new Firebase(process.env.FIREBASE_URL + "user_defaults/" + this.context.userAuth.uid);
		defaultsRef.on("value", function(value) {
			self.setState(function(prevState) {
				prevState.defaults=value.val();
				prevState.nametag.name = prevState.defaults.names[0];
				prevState.nametag.bio = prevState.defaults.bios[0];
				prevState.nametag.icon = prevState.defaults.icons[0];
				return prevState;
			});
		})
	},
	componentWillUnmount:function() {
		var defaultsRef = new Firebase(process.env.FIREBASE_URL + "user_defaults/" + this.context.userAuth.uid);
		defaultsRef.off("value");
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
					<h4>Set Up Your Nametag For This Conversation</h4>
					<div id="userBadges">
						<p className="userBadgeText">Share these badges by dragging them onto your nametag.</p>
						<Badges/>
					</div>
					<EditNametag nametag={this.state.nametag} updateNametag={this.updateNametag}/>
					<br/>
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

