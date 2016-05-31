
var React = window.React = require('react'),
    ReactDOM = require("react-dom"),
    Room = require("./ui/Room/Room"),
    RoomCards = require('./ui/RoomCard/RoomCards'),
    mountNode = document.getElementById("app");

import { Router, Route, Link, hashHistory } from 'react-router';

require('./config')

var Nametag = React.createClass({
	getInitialState: function() {
		var auth = new Firebase(process.env.FIREBASE_URL).getAuth();
		return {
			auth:auth
		};
	},
	childContextTypes: {
	    userAuth: React.PropTypes.object,
	    unAuth: React.PropTypes.func,
	    checkAuth: React.PropTypes.func
	},
	getChildContext: function() {
	    return {
	    	userAuth: this.state.auth,
	    	unAuth: this.unAuth,
	    	checkAuth: this.checkAuth
	    };
	},
	unAuth: function(e) {
		e.preventDefault();
		new Firebase(process.env.FIREBASE_URL).unauth();
		this.checkAuth();
	},
	checkAuth: function() {
		this.setState( {
			auth:new Firebase(process.env.FIREBASE_URL).getAuth()
		});
	},
	render: function() {
		return (<Router history={hashHistory}>
			<Route path="/" component={RoomCards} />
			<Route path="/rooms" component={RoomCards}/>
			<Route path="/rooms/:roomId" component={Room}/>
		</Router>);
	}
});

ReactDOM.render(<Nametag/>, mountNode);

