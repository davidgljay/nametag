'use strict'

var React = require('react'),
errorLog = require('../../utils/errorLog'),
Login = require('../Participant/Login'),
EditNametag = require('../Participant/EditNametag');

var Join = React.createClass({
	getInitialState:function() {
		return {
			login: false//new Firebase(process.env.FIREBASE_URL).getAuth()
		}
	},
	checkLogin:function() {
		this.setState({login:new Firebase(process.env.FIREBASE_URL).getAuth()});
	},
	render:function() {
		if (this.state.login) {
			return (<div>EditName</div>);
			// return (<EditNametag login={this.state.login} roomId={this.props.roomId}/>);
		} else {
			return (<Login checkLogin={this.checkLogin}/>);
		}
	}
});

Join.propTypes={roomId:React.PropTypes.string};

module.exports=Join;

