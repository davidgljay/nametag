'uses strict';

var Badge = React.createClass({
	getInitialState:function() {
		return {
			expanded:false,
		};
	},
	toggle:function(expanded) {
		var self=this;
		return function(e) {
			self.setState({expanded:expanded});
		}
	},
	render:function() {
		if (self.state.expanded) {
			return (
					<div className="badge">
						<img className="icon" alt="icon" src={this.props.badge.icon}/>
						<div className="name">{this.props.badge.name}</div>
						<div className="granter">{this.props.badge.granter}</div>
						<div className="description">{this.props.badge.description}</div>
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
					<li>{this.props.name}</li>
				)
		}
	}
});

Badge.propTypes={id:React.PropType.string};
