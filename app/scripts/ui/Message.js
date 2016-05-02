'use strict';

var React = require('react'),
moment = require('../../bower_components/moment/moment');

var Message = React.createClass({
	getInitialState:function() {
		return {author:{}};
	},
	componentDidMount:function() {

		//TODO: Does this belong in getInitialState of componentDidMount?
		//It seems like it's bad to set state before the component mounts, so maybe here?
		var self = this;
		var authorRef = new Firebase('https://badgespace.firebaseio.com/participants/'+this.props.roomId+"/"+this.props.author);
		authorRef.on('value', function(author) {
			this.setState(function(previousState) {
				previousState.author = author.val();
				return previousState;
			})
		}, function(err) {
			console.log("Error getting message author info")
		}, this);
	},
	onMouseOver:function(e) {
		console.log("Mouseover triggered");
	},
	modAction:function(e) {
		console.log("Modaction click");
	},
	render:function() {
		var icon, name;
		if (this.state.author) {
			icon = this.state.author.icon;
			name = this.state.author.name;
		}
			return (
				<tr className="message" OnMouseOver={this.onMouseOver}>
					<td className="icon">
						<img className="img-circle" src={icon}/>
					</td>
					<td className="messageText">
						<div className="name">{name}</div>
						<div className="text">{this.props.text}</div>
						<div className="date">{moment(this.props.timestamp).format('h:mm A, ddd MMM DD YYYY')}</div>
						<div className="actions">
							<span className="glyphicon glyphicon-heart" onClick={this.heartAction} aria-hidden="true"/>
							<span className="glyphicon glyphicon-flag" onClick={this.modAction} aria-hidden="true"/>
						</div>
					</td>
				</tr>
				);
	}
});

Message.propTypes = {id:React.PropTypes.string, text:React.PropTypes.string, date:React.PropTypes.number, author:React.PropTypes.string, roomid:React.PropTypes.string};
Message.defaultProps = { id:'msg1', text:'This is the testiest message.', timestamp:1461977139344 };

module.exports=Message;
