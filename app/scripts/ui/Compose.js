'use strict';

var React = require('react');

var Compose = react.creatClass({
	getInitialState:function(){

	},
	post:function(msg) {

	},
	render:function() {
		return (
			<textarea id="compose"/>
			)
	}
})

Compose.propTypes = {roomid:React.PropTypes.string};

module.exports = Compose;