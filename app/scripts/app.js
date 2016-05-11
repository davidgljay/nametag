
var React = window.React = require('react'),
    ReactDOM = require("react-dom"),
    Room = require("./ui/Room"),
    mountNode = document.getElementById("app");

import { Router, Route, Link, hashHistory } from 'react-router';

require('./config')


//TODO: Confirm that error handling is added to firebase refs throughout
//TODO: Confirm that firebase refs are located in componentDidMount and unregistered throught.

ReactDOM.render((
	  <Router history={hashHistory}>
	  		<Route path="/rooms/:roomId" component={Room}/>
	  </Router>
	), mountNode);

