'use strict'

module.exports = function(props) {
	var alert ='';
	if (this.props.alert) {
		alert = (
			<div className={"alert alert-" + this.props.alertType} role="alert">
					{this.props.alert}
			</div>
			);
	}
	return alert;
}