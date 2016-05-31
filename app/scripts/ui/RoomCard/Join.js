'use strict'

var React = require('react'),
errorLog = require('../../utils/errorLog'),
Login = require('../Participant/Login'),
EditNametag = require('../Participant/EditNametag');

var Join = React.createClass({
	contextTypes: {
		userAuth:React.PropTypes.object,
		checkAuth:React.PropTypes.func
	},
	render:function() {
		// var login = {
		// 	uid:'abcd'
		// };
		if (this.context.userAuth) {
			return (<EditNametag login={this.context.userAuth} roomId={this.props.roomId}/>);
		} else {
			return (<Login/>);
		}
	}
});

Join.propTypes={roomId:React.PropTypes.string};

module.exports=Join;

