'use strict'

var Alert = (props) => {
	if (props.alert) {
		return (
			<div className={"alert alert-" + props.alertType} role="alert">
					{props.alert}
			</div>
			);
	} else {
		return null;
	}
};

module.exports=Alert;