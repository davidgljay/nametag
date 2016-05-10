'use strict';

var React = require('react');

var ModAction = React.createClass({
	getInitialState:function() {
		return {
			norms:[],
			isPublic:false,
			note:"",
			escalated:false
		}
	},
	componentDidMount: function() {
		var self = this,
		normsRef = new Firebase(process.env.FIREBASE_URL + "rooms/" + this.props.roomId + "/norms" );
		normsRef.on('child_added', function(value) {
			self.setState(function(previousState) {
				previousState.norms.push({text:value.val(), id:previousState.norms.length, checked:false})
				return previousState;
			})
		})
	},
	showNorm: function(norm) {
		return (
			<li className="list-group-item" key={norm.id} onClick={this.checkNorm(norm.id)}>
				<label className="c-input c-checkbox" >
				  <input type="checkbox" checked={norm.checked}/>
				  <span className="c-indicator"></span>
				   {norm.text}
				</label>
			</li>
			);
	},
	checkNorm:function(normId) {
		var self=this;
		return function(e) {
			e.preventDefault();
			//Need to setTimeout so that preventDefault doesn't break checkboxes
			//This is a React-recommended hack.
			setTimeout(function() {
				self.setState(function(previousState) {
					previousState.norms[normId].checked = !previousState.norms[normId].checked;
					return previousState;
				})		
			},1)

		}
	},
	preventDefault:function(e) {
		e.preventDefault();
	},
	remindOfNorms: function() {
		var self = this;
		var modActionRef = new Firebase(process.env.FIREBASE_URL + 'mod_actions/');
		//TODO: Allow edits without breaking append-only rule (right now there's one modaction per comment)

		var isChecked = function(item) {
			return item.checked;
		}
		var modAction = {
			action: "warn",
			norms: this.state.norms.filter(isChecked),
			note: this.state.note
		}
		//Update firebase with modaction for the user.
		if (this.state.isPublic) {
			modActionRef.child( this.props.roomId + "/public/" + this.props.msgId + "/").set(modAction)
		} else {
			modActionRef.child( this.props.roomId + "/private/" + this.props.author.id + "/" + this.props.msgId + "/").set(modAction)			
		}
	},
	setPublic: function(isPublic) {
		var self = this;
		return function() {
			self.setState({isPublic:isPublic});
		}
	},
	escalate:function() {
		this.setState({escalated:true})
	},
	removeUser:function() {
		//TODO: Add functionality to remove user.
	},
	addNote:function(e) {
		this.setState({note: e.target.value});
	},
	render:function() {
		//TODO: I could add complexity here, cite multiple posts, etc.
		//TODO: Create a system for notifying badgeholders.
		var visText, alert; 
		if (this.state.alert) {

		}

		if (this.state.isPublic) {
			visText = (
					<p>
						<span aria-hidden="true" className="glyphicon glyphicon-eye-open"></span>
						Visible to everyone in the room.
					</p>
					)
		} else {
			visText = (
				<p>
					<span aria-hidden="true" className="glyphicon glyphicon-eye-close"></span>
					Visible only to the author of this message.
				</p>
				)
		}

		return (
			<div id="modAction">
				<span aria-hidden="true" className="glyphicon glyphicon-remove" onClick={this.props.close}></span>
				<h4>Remind {this.props.author.name} of Conversation Norms</h4>
				<ul className="list-group">
				{this.state.norms.map(this.showNorm)}
				</ul>
				<input type="text" className="form-control" onChange={this.addNote} placeholder="Add an optional note." value={this.state.message}/>
				<div className="chooseVis">
					<div className="btn-group" data-toggle="buttons">
						<label className={"btn btn-default " + (this.state.isPublic || "active")}>
							<input type="radio" id="privateAction" onClick={this.setPublic(false)} /> 
							Private
						</label> 
						<label className={"btn btn-default " + (!this.state.isPublic || "active")}>
							<input type="radio" id="publicAction" onClick={this.setPublic(true)}/> 
							Public
						</label> 
					</div>
					<div className="visText">
						{visText}
					</div>
				</div>
				<div className="modActions">
					<button className="btn btn-primary" onClick={this.remindOfNorms}>
						Remind
					</button>
					<button className={"btn btn-link escalateLink " + (!this.state.escalated || "hide")} onClick={this.escalate}>Escalate</button>
					<button className={"btn btn-danger " + (this.state.escalated || "hide")} onClick={this.removeUser}>Remove {this.props.author.name}</button>
					<button className={"btn btn-danger " + (this.state.escalated || "hide")} onClick={this.notifyBadge}>Notify Badge Granters</button>
				</div>
		    </div>
			)

	}
})

ModAction.propTypes = { roomId: React.PropTypes.string, msgId: React.PropTypes.string, close: React.PropTypes.func, author: React.PropTypes.object };

module.exports=ModAction;