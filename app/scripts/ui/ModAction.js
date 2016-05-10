'use strict';

var React = require('react');

var ModAction = React.createClass({
	getInitialState:function() {
		var self = this;
		var modActionRef = new Firebase(process.env.FIREBASE_URL + 'mod_actions/' + this.props.msgId);
		return {
			modActionRef:modActionRef,
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
	postAction: function() {
		//TODO: Allow edits without breaking append-only rule.
	},
	setPublic: function(isPublic) {
		var self = this;
		return function(e) {
			self.setState({isPublic:isPublic});
		}
	},
	escalate:function(e) {
		this.setState({escalated:true})
	},
	removeUser:function() {
		//TODO: Add functionality to remove user. Possibly room blacklist?
	},
	addNote:function(e) {
		this.setState({message: e.target.value});
	},
	render:function() {
		//Maybe just choose a norm that's been violated and add an optional note?
		//Keyword is remind
		//I could add complexity here, cite multiple posts, etc.
		//I could also create a system for notifying badgeholders.
		var visText; 
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
				<span aria-hidden="true" className="glyphicon glyphicon-remove"></span>
				<h4>Remind {this.props.author} of Conversation Norms</h4>
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
					<button className="btn btn-primary">
						Remind
					</button>
					<button className={"btn btn-link escalateLink " + (!this.state.escalated || "hide")} onClick={this.escalate}>Escalate</button>
					<button className={"btn btn-danger " + (this.state.escalated || "hide")} onClick={this.removeUser}>Remove {this.props.author}</button>
					<button className={"btn btn-danger " + (this.state.escalated || "hide")} onClick={this.notifyBadge}>Notify Badge Granters</button>
				</div>
		    </div>
			)

	}
})

ModAction.propTypes = { roomId: React.PropTypes.string, msgId: React.PropTypes.string };

module.exports=ModAction;