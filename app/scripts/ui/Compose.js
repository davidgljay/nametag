'use strict';

var React = require('react');

var Compose = React.createClass({
	getInitialState:function(){
		return {message:''};

	},
	onChange:function(e) {
		this.setState({message: e.target.value});
	},
	post:function(msg) {

	},
	render:function() {
		//TODO: Add GIFs, image upload, emoticons
		return (
			<form id="compose" className="input-group" onSubmit={this.post}>
				<input type="text" className="form-control" onChange={this.onChange} value={this.state.message}/>
				<span className="input-group-btn">
					<button className="btn btn-secondary"><span className="glyphicon glyphicon-send" aria-hidden="true"/></button>
				</span>
			</form>
			)
	}
})

Compose.propTypes = {roomid:React.PropTypes.string};

module.exports = Compose;