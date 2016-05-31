'use strict';

var React = require('react'),
errorLog = require('../../utils/errorLog');


/* Function to Log in users via an auth provider or e-mail.

Currently supports login via:
Twitter
E-mail
FB

TODO:
Add Google, Tumblr, Github, LinkedIn, and Instagram

TODO: create e-mail lookup archive and handle account merges
TODO: Handle login if twitter is already activated
*/

var Login = React.createClass({
	contextTypes: {
    	userAuth: React.PropTypes.func,
    	unAuth: React.PropTypes.func
  	},
	getInitialState:function() {
		return {
			showEmail:false
		};
	},
	createUser:function(userinfo) {
		var fbref = new Firebase(process.env.FIREBASE_URL + 'users/' + userinfo.uid),
		defaultsRef = new Firebase(process.env.FIREBASE_URL + 'user_defaults/' + userinfo.uid);

		fbref.child(userinfo.provider).set(userinfo[userinfo.provider].cachedUserProfile);
		this.addIfUniq(defaultsRef, 'names', userinfo[userinfo.provider].cachedUserProfile.description);
		// defaultsRef.child('bios').push(userinfo[userinfo.provider].cachedUserProfile.description);
		// defaultsRef.child('names').push(userinfo[userinfo.provider].username);
		// defaultsRef.child('names').push(userinfo[userinfo.provider].displayName);
		// //TODO: copy profile image to s3
		// defaultsRef.child('icons').push(userinfo[userinfo.provider].profileImageURL);

		this.context.checkAuth();
	},
	addIfUniq:function(ref, child, data) {
		ref.child(child).transaction(function(currentData) {
			console.log(currentData);
			var uniq = true;
			for (var key in currentData) {
				if (currentData[key]==data) {
					uniq = false;
				}
			}

			if (uniq) {
				currentData.push(data)
				return currentData;
			}
		})
	},
	providerAuth:function(provider) {
		var self=this;
		return function() {
	        new Firebase(process.env.FIREBASE_URL).authWithOAuthPopup(provider)
	        	.then(self.createUser, errorLog("Error creating user"));
		};
    },
	render:function() {

	//TODO: Add e-mail (This will probably involve adding state, oh well.)
	//TODO: Add FB

	return (
		<div id="login">
			<h4>Log in to join</h4>
			<img src="./images/twitter.jpg" className="loginOption img-circle" onClick={this.providerAuth('twitter')}/>
			<img src="./images/fb.jpg" className="loginOption img-circle" onClick={this.providerAuth('facebook')}/>
			<img src="./images/tumblr.png" className="loginOption img-circle" onClick={this.providerAuth('tumblr')}/>	
		</div>
		);
	}
});

Login.propTypes = {checkLogin:React.PropTypes.func};

module.exports=Login;