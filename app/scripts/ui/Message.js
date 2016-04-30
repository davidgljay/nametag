'use strict';

var React = require('react'),
moment = require('../../bower_components/moment/moment');

var Message = React.createClass({
	render:function() {
			return (
				<div className="message">
					<div className="text">{this.props.text}</div>
					<div calssName="date">{moment(this.props.date).format('h:mm A, ddd MMM DD YYYY')}</div>
				</div>
				);
	}
});

Message.propTypes = {id:React.PropTypes.string, text:React.PropTypes.string, date:React.PropTypes.number};
Message.defaultProps = { id:'msg1', text:'This is the testiest message.', date:1461977139344 };

module.exports=Message;
