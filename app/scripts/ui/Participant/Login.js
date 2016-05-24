'use strict';

var React = require('react'),
errorLog = require('../../utils/errorLog');
// Firebase = require('../../../bower_components/firebase/firebase');


/* Function to Log in users via an auth provider or e-mail.

Currently supports login via:
Twitter
E-mail
FB

TODO:
Add Google, Tumblr, Github, LinkedIn, and Instagram

*/

module.exports= function() {

	var createUser = function(userinfo) {
		var fbref = new Firebase(process.env.FIREBASE_URL + 'users/' + userinfo.uid),
		defaultsRef = new Firebase(process.env.FIREBASE_URL + 'user_defaults/' + userinfo.uid);

		if (userinfo.provider == 'twitter') {
			fbref.update({'twitter':userinfo.twitter.cachedUserProfile});
			defaultsRef.child('bios').push(userinfo.twitter.cachedUserProfile.description);
			defaultsRef.child('username').push(userinfo.twitter.username);
			defaultsRef.child('username').push(userinfo.twitter.displayName);
			//TODO: copy profile image to s3
			defaultsRef.child('icons').push(userinfo.twitter.profileImageURL);
		}
	};

	var providerAuth = function(provider) {
		return function() {
	        new Firebase(process.env.FIREBASE_URL).authWithOAuthPopup(provider)
	        	.then(createUser, errorLog("Error creating user"));
		};
    };

	return (
		<div id="login">
			<div className="loginOption" onClick={providerAuth('twitter')}>Twitter</div>
			<div className="loginOption" onClick={providerAuth('facebook')}>Facebook</div>		
		</div>
		);
};