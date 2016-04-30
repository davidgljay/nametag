'use strict';

var React = require('react'),
moment = require('../../bower_components/moment/moment');

var Message = React.createClass({
	getInitialState:function() {
		return {author:{}};
	},
	componentDidMount:function() {
		var self = this;
		console.log(this.props.roomid)
		console.log(this.props.author)
		var authorRef = new Firebase('https://badgespace.firebaseio.com/participants/'+this.props.roomid+"/"+this.props.author);
		authorRef.on('value', function(author) {
			this.setState(function(previousState) {
				previousState.author = author.val();
				return previousState;
			})
		}, function(err) {
			console.log("Error getting message author info")
		}, this);
	},
	render:function() {
		var author = '';
		console.log(this.state.author)
		if (this.state.author) {author = this.state.author.icon}
			return (
				<div className="message">
					<img className="author img-circle" src={author}/>
					<div className="text">{this.props.text}</div>
					<div className="date">{moment(this.props.date).format('h:mm A, ddd MMM DD YYYY')}</div>
				</div>
				);
	}
});

Message.propTypes = {id:React.PropTypes.string, text:React.PropTypes.string, date:React.PropTypes.number, author:React.PropTypes.string, roomid:React.PropTypes.string};
Message.defaultProps = { id:'msg1', text:'This is the testiest message.', date:1461977139344 };

module.exports=Message;
