'uses strict';

var React = require('react'),
moment = require('../../../bower_components/moment/moment')

//TODO: This currently displays all user badges, as opposed to only the participant badges. A major violation of trust!

var Badge = React.createClass({
	getInitialState:function() {
		return {
			expanded:false,
		};
	},
	toggleExpanded:function() {
		this.setState({expanded:!this.state.expanded});
	},
	render:function() {
		if (this.state.expanded) {
			return (
					<div className="badgeExpanded">
						<span aria-hidden="true" className="glyphicon glyphicon-remove" onClick={this.toggleExpanded}></span>
						<img className="icon" alt="icon" src={this.props.badge.icon_array[0]}/>
						<div className="name">{this.props.badge.name}</div>
						<div className="granter">Verified by: {this.props.badge.granter}</div>
						<div className="description">{this.props.badge.description_array[0]}</div>
						<hr/>
						<div className="notes">
							{this.props.badge.notes.map(function(note) {
								return (
									<div className="note" key={note.date}>
										<div className="date">{moment(note.date).format("MMMM Do, YYYY")}: </div>
										<div className="msg">{note.msg}</div>
									</div>
								)
							})}
						</div>
					</div>
				)
		} else {
			return (
					<div className="label label-pill badge" onClick={this.toggleExpanded}>{this.props.badge.name}</div>
				)
		}
	}
});

Badge.propTypes={badge:React.PropTypes.object};

module.exports=Badge;