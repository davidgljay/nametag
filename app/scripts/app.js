
var React = window.React = require('react'),
    ReactDOM = require("react-dom"),
    Room = require("./ui/Room/Room"),
    RoomCards = require('./ui/RoomCard/RoomCards'),
    mountNode = document.getElementById("app");

import { Router, Route, Link, hashHistory } from 'react-router';

require('./config')

ReactDOM.render((
	  <Router history={hashHistory}>
	  	<Route path="/rooms" component={RoomCards}/>
	  	<Route path="/rooms/:roomId" component={Room}/>
	  </Router>
	), mountNode);

