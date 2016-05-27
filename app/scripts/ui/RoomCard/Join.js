'use strict'

var React = require('react'),
errorLog = require('../../utils/errorLog'),
Login = require('../Participant/Login'),
EditNametag = require('../Participant/EditNametag');

var Join = React.createClass({
	getInitialState:function() {
		return {
			login: new Firebase(process.env.FIREBASE_URL).getAuth()
		}
	},
	checkLogin:function() {
		this.setState({login:new Firebase(process.env.FIREBASE_URL).getAuth()});
	},
	render:function() {
		// console.log(EditNametag);
		var login = {
			uid:'abcd'
		};
		if (this.state.login) {
			return (<EditNametag login={login} roomId={this.props.roomId}/>);
		} else {
			return (<Login checkLogin={this.checkLogin}/>);
		}
	}
});

Join.propTypes={roomId:React.PropTypes.string};

module.exports=Join;

