'use strict';

module.exports = function(props) {
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
		  </ul>
		</nav>
	)
}