'use strict';

var React = require('react');

var ModActionNotif = React.createClass({
	contextTypes: {
    	roomId: React.PropTypes.string,
    	participantId: React.PropTypes.string
  	},
	getInitialState:function() {
		return {
			message:'',
			mod:'',
			author:''
		};
	},
	componentDidMount:function() {
		//Get info for the mod and the message in question.
		var msgRef = new Firebase(process.env.FIREBASE_URL + "messages/" + this.props.modAction.msgId),
		modRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.context.roomId  + "/" + this.props.modAction.modId),
		authorRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.context.roomId + "/" + this.props.modAction.author)
		self = this;
		msgRef.on('value', function(value) {
			self.setState({message:value.val().text})
		},
		function(err) {
			console.log(err);
		});
		modRef.on('value', function(value) {
			self.setState({mod:value.val()})
		},
		function(err) {
			console.log(err);
		});
		authorRef.on('value', function(value) {
			self.setState(function(prevState) {
				prevState.author = value.val();
				prevState.author.id = value.key();
				return prevState;
			})
		},
		function(err) {
			console.log(err);
		})
	},
	componentWillUnmount:function() {
		var msgRef = new Firebase(process.env.FIREBASE_URL + "messages/" + this.props.modAction.msgId),
		modRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.context.roomId  + "/" + this.props.modAction.modId),
		authorRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.context.roomId + "/" + this.props.modAction.author);
		msgRef.off('value');
		modRef.off('value');
		authorRef.off('value');
	},
	render: function() {
		var callout,
		showNorms = function(norm) {
			return <li className="list-group-item" key={norm.id}>{norm.text}</li>
		};

		//Change callout based on whether the message is addressed to the current user.
		if (this.state.author.id == this.context.participantId) {
			callout = (
					<div>
						<h4>Heads up!</h4>
						<p>
							{this.state.mod.name} would like to remind you of the following norm{this.props.modAction.norms.length == 1 || "s"}:
						</p>
					</div>
				);
		} else {
			callout = (
				<p>{this.state.mod.name} has reminded {this.state.author.name} of the following norm{this.props.modAction.norms.length == 1 || "s"}:</p>
				);
		}
		return (
			<tr className="modActionNotif">
				<td className="icon">
					<img className="img-circle" src={this.state.mod.icon}/>
				</td>
				<td>
					{callout}
					<ul className="list-group">
						{this.props.modAction.norms.map(showNorms)}
					</ul>
					<p>Regarding the statement:</p>
					<div className="quote">{this.state.message}</div>
					<div className="modNote">{this.props.modAction.note}</div>
				</td>
			</tr>
			);
	}
});

ModActionNotif.propTypes = {modAction: React.PropTypes.object};

module.exports=ModActionNotif;