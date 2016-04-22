'use strict';

var React = require('react');

var Room = React.createClass({
  getInitialState: function() {
  	//Get FB info
  	//Start w/ offline dataset for testing.
  	return {title:'I\'m a room!'};
    // return {secondsElapsed: 0};
  },
  componentDidMount: function() {
  	//TODO: mark the user as active in the room.
  },
  componentWillUnmount: function() {
  	//TODO: mark the user as inactive when they leave the room.
  },
  render: function() {
    return (
    	<div>
    	    <div className="header">
                <ul className="nav nav-pills pull-right">
                    <li className="active"><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
                <h3 className="text-muted">{this.state.title}</h3>
            </div>
      </div>
    );
  }
});

Room.propTypes = { fbref: React.PropTypes.string };
Room.defaultProps = {};


module.exports = Room;