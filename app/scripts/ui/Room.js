'use strict';

var React = require('react');

var Room = React.createClass({
  getInitialState: function() {
  	//Get FB info
  	//Start w/ offline dataset for testing.
  	return null;
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
      	<h1>I'm a room!</h1>
      </div>
    );
  }
});

Room.propTypes = { fbref: React.PropTypes.string };
Room.defaultProps = {};


module.exports = Room;