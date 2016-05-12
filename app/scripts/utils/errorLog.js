module.exports = function(msg) {
	return function(err) {
		console.log(msg + (err || ": ") + err);
	};
}