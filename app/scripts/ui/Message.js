'use strict';

var React = require('react'),
moment = require('../../bower_components/moment/moment');

var Message = React.createClass({
	getInitialState:function() {
		return {
			author:{},
			mouseOver:false
		};
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
	onMouseEnter:function(e) {

		this.setState({mouseOver:true})
	},
	onMouseLeave:function(e){
		this.setState({mouseOver:false})
	},
	modAction:function(e) {
		console.log("Modaction click");
	},
	render:function() {
		var icon, name, below;
		if (this.state.author) {
			icon = this.state.author.icon;
			name = this.state.author.name;
		}

		if (this.state.mouseOver) {
			below = 
				<div className="actions">
					<span className="glyphicon glyphicon-heart" onClick={this.heartAction} aria-hidden="true"/>
					<span className="glyphicon glyphicon-flag" onClick={this.modAction} aria-hidden="true"/>
				</div>
				
		} else {
			below = <div className="date">{moment(this.props.timestamp).format('h:mm A, ddd MMM DD YYYY')}</div>
		}
		return (
			<div>
				<tr className="message" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
					<td className="icon">
						<img className="img-circle" src={icon}/>
					</td>
					<td className="messageText">
						<div className="name">{name}</div>
						<div className="text">{this.props.text}</div>
						{below}
					</td>
				</tr>
				<tr>
					<td className="msgPadding"></td>
				</tr>
			</div>
			);
		}
});

Message.propTypes = {id:React.PropTypes.string, text:React.PropTypes.string, date:React.PropTypes.number, author:React.PropTypes.string, roomid:React.PropTypes.string};
Message.defaultProps = { id:'msg1', text:'This is the testiest message.', timestamp:1461977139344 };

module.exports=Message;
