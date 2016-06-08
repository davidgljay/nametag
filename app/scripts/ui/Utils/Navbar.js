'use strict';

import React from 'react';

module.exports = function(props) {
	var login;

	if (props.userAuth) {
		login = (<a className="nav-link" onClick={props.unAuth}>Log out</a>);
	} else {
		login = (<a className="nav-link" href="#">Log In</a>);
	}

	return (
		<nav className="navbar navbar-light bg-faded">
		  <a className="navbar-brand" href="#">Nametag</a>
		  <ul className="nav navbar-nav pull-right">
		    <li className="nav-item active">
		      <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
		    </li>
		    <li className="nav-item">
		      <a className="nav-link" href="#">Profile</a>
		    </li>
		    <li className="nav-item">
		      <a className="nav-link" href="#">About</a>
		    </li>
		    <li className="nav-item">
		      {login}
		    </li> 
		  </ul>
		</nav>
	)
}

