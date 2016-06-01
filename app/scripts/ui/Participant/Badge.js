'uses strict';

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
		console.log(this.props.badge);
		if (this.state.expanded) {
			return (
					<div className="badgeExpanded">
						<span aria-hidden="true" className="glyphicon glyphicon-remove" onClick={this.toggleExpanded}></span>
						<img className="icon" alt="icon" src={this.props.badge.icon_array[0]}/>
						<div className="name">{this.props.badge.name}</div>
						<div className="granter">Verified by: {this.props.badge.granter}</div>
						<div className="description">{this.props.badge.description_array[0]}</div>
						<div className="notes">
							{this.props.badge.notes.map(function(note) {
								<div className="note" key={note.date}>
									<div className="date">{note.date}</div>
									<div className="msg">{note.msg}</div>
								</div>
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