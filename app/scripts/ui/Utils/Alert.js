'use strict'

module.exports = function(props) {
	var alert ='';
	if (this.props.alert) {
		alert = (
			<div className="alert alert-danger" role="alert">
					{this.props.alert}
			</div>
			);
	}
	return alert;
}