import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';
import style from '../../../styles/User/Login.css';
import https from 'https';

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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmail: false,
    };
  }

  createUser(userinfo) {
    const fbref = fbase.child('users/' + userinfo.uid);
    const defaultsRef = fbase.child('user_defaults/' + userinfo.uid);

    fbref.child(userinfo.provider).set(userinfo[userinfo.provider].cachedUserProfile);
    this.addIfUniq(
        defaultsRef,
        'icons',
        userinfo[userinfo.provider].profileImageURL
      );
    if ( userinfo.provider === 'facebook') {
      this.addIfUniq(
        defaultsRef,
        'names',
        userinfo[userinfo.provider].cachedUserProfile.name);
    }
    if (userinfo.provider === 'twitter') {
      this.addIfUniq(
        defaultsRef,
        'names',
        userinfo[userinfo.provider].cachedUserProfile.displayName
      );
      this.addIfUniq(
        defaultsRef,
        'bios',
        userinfo[userinfo.provider].cachedUserProfile.description
      );
      this.addIfUniq(
        defaultsRef,
        'names',
        userinfo[userinfo.provider].username
      );
    }
    // //TODO: copy profile image to s3
    this.addProfileImage(userinfo[userinfo.provider].profileImageURL);

    this.context.checkAuth();
  }

  addIfUniq(ref, child, data) {
    if (!data) {
      return;
    }
    ref.child(child).transaction(function transaction(currentData) {
      let uniq = true;
      if (currentData === null) {
        return [data];
      }
      for (let key in currentData) {
        if (currentData[key] === data) {
          uniq = false;
        }
      }
      if (uniq) {
        currentData.push(data);
      }
      return currentData;
    });
  }

  addProfileImage(url) {
    let postData = {
      url: url,
      sizes: [
        {
          width: 50,
          height: 50,
        },
        {
          width:300,
          height: 300,
        }
      ],
    };
    let options = {
      hostname: 'cl3z6j4irk.execute-api.us-east-1.amazonaws.com',
      path: '/prod/user_icon',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    let buffer = [];
    console.log("resizing image");

    let req = https.request(options, function(res) {
      if (res.responseCode  === 200) {
        res.on("data", function(data) {
          buffer.push(data);
        });
      }
    });
    req.write(JSON.stringify(postData));

    req.on("end", function() {
      console.log(new Buffer.concat(buffer).toString);
    });
  };

  providerAuth(provider) {
    let self = this;
    return function onClick() {
      fbase.authWithOAuthPopup(provider)
        .then(self.createUser.bind(self), errorLog('Error creating user'));
    };
  }

  render() {
  // TODO: Add e-mail (This will probably involve adding state, oh well.)

    return <div id={style.login}>
        <h4>Log in to join</h4>
        <img
          src="./images/twitter.jpg"
          className={style.loginOption + ' img-circle'}
          onClick={this.providerAuth('twitter').bind(this)}/>
        <img
          src="./images/fb.jpg"
          className={style.loginOption + ' img-circle'}
          onClick={this.providerAuth('facebook').bind(this)}/>
        <img
          src="./images/tumblr.png"
          className={style.loginOption + ' img-circle'}
          onClick={this.providerAuth('tumblr').bind(this)}/>
      </div>;
  }
}

Login.propTypes = {checkLogin: PropTypes.func};
Login.contextTypes = {checkAuth: PropTypes.func};

export default Login;
