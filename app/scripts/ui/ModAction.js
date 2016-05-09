'use strict';

var React = require('react');

var ModAction = React.createClass({
	getInitialState:function() {
		var self = this;
		var modActionRef = new Firebase(process.env.FIREBASE_URL + 'mod_actions/' + this.props.msgId);
		return {
			modActionRef:modActionRef,
			norms:[]
		}
	},
	componentDidMount: function() {
		var self = this,
		normsRef = new Firebase(process.env.FIREBASE_URL + "rooms/" + this.props.roomId + "/norms" );
		normsRef.on('child_added', function(value) {
			self.setState(function(previousState) {
				previousState.norms.push(value.val())
				return previousState;
			})
		})
	},
	showNorm: function(norm) {
		return (
			<li className="list-group-item" key={norm}>
				<label className="c-input c-checkbox">
				  <input type="checkbox"/>
				  <span className="c-indicator"></span>
				  {norm}
				</label>
			</li>
			);
	},
	postAction: function() {
		//TODO: Allow edits without breaking append-only rule.
	},
	render:function() {
		//Maybe just choose a norm that's been violated and add an optional note?
		//Keyword is remind
		//I could add complexity here, cite multiple posts, etc.
		//I could also create a system for notifying badgeholders. 
		return (
			<div id="modAction">
				<ul className="list-group">
					{this.state.norms.map(this.showNorm)}
				</ul>
			</div>
			)

	}
})

ModAction.propTypes = { roomId: React.PropTypes.string, msgId: React.PropTypes.string };

module.exports=ModAction;