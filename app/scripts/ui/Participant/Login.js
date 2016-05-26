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

TODO: create e-mail lookup archive and handle account merges
TODO: Handle login if twitter is already activated
*/

module.exports= function(props) {

	//TODO: Add e-mail (This will probably involve adding state, oh well.)
	//TODO: Add FB

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

		if (userinfo.provider == 'facebook') {
			console.log(userinfo);
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
			<h4>Log in to join</h4>
			<img src="./images/twitter.jpg" className="loginOption img-circle" onClick={providerAuth('twitter')}/>
			<img src="./images/fb.jpg" className="loginOption img-circle" onClick={providerAuth('facebook')}/>
			<img src="./images/tumblr.png" className="loginOption img-circle" onClick={providerAuth('tumblr')}/>	
		</div>
		);
};