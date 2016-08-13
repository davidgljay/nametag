import React, { Component, PropTypes } from 'react'
import style from '../../../styles/User/Login.css'
import {providerAuth} from '../../actions/UserActions'

/* Function to Log in users via an auth provider or e-mail.

Currently supports login via:
Twitter
E-mail
FB

TODO: create e-mail lookup archive and handle account merges
TODO: Handle login if twitter is already activated
*/

class Login extends Component {

  //TODO: Move to user action
  // createUser(userinfo) {
  //   const fbref = fbase.child('users/' + userinfo.uid)
  //   const defaultsRef = fbase.child('user_defaults/' + userinfo.uid)

  //   fbref.child(userinfo.provider).set(userinfo[userinfo.provider].cachedUserProfile)
  //   this.addIfUniq(
  //       defaultsRef,
  //       'icons',
  //       userinfo[userinfo.provider].profileImageURL
  //     )
  //   if ( userinfo.provider === 'facebook') {
  //     this.addIfUniq(
  //       defaultsRef,
  //       'names',
  //       userinfo[userinfo.provider].cachedUserProfile.name)
  //   }
  //   if (userinfo.provider === 'twitter') {
  //     this.addIfUniq(
  //       defaultsRef,
  //       'names',
  //       userinfo[userinfo.provider].cachedUserProfile.displayName
  //     )
  //     this.addIfUniq(
  //       defaultsRef,
  //       'bios',
  //       userinfo[userinfo.provider].cachedUserProfile.description
  //     )
  //     this.addIfUniq(
  //       defaultsRef,
  //       'names',
  //       userinfo[userinfo.provider].username
  //     )
  //   }
  //   // //TODO: copy profile image to s3
  //   this.addProfileImage(userinfo[userinfo.provider].profileImageURL)

  //   this.context.checkAuth()
  // }

  //TODO: move to user action
  // addIfUniq(ref, child, data) {
  //   if (!data) {
  //     return
  //   }
  //   ref.child(child).transaction(function transaction(currentData) {
  //     let uniq = true
  //     if (currentData === null) {
  //       return [data]
  //     }
  //     for (let key in currentData) {
  //       if (currentData[key] === data) {
  //         uniq = false
  //       }
  //     }
  //     if (uniq) {
  //       currentData.push(data)
  //     }
  //     return currentData
  //   })
  // }

  //TODO: Move to user action
  // addProfileImage(url) {
  //   let postData = {
  //     url: url,
  //     sizes: [
  //       {
  //         width: 50,
  //         height: 50,
  //       },
  //       {
  //         width:300,
  //         height: 300,
  //       }
  //     ],
  //   }
  //   let options = {
  //     hostname: 'cl3z6j4irk.execute-api.us-east-1.amazonaws.com',
  //     path: '/prod/user_icon',
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Content-Length': Buffer.byteLength(postData),
  //     },
  //   }
  //   let buffer = []
  //   console.log("resizing image")

  //   let req = https.request(options, function(res) {
  //     if (res.responseCode  === 200) {
  //       res.on("data", function(data) {
  //         buffer.push(data)
  //       })
  //     }
  //   })
  //   req.write(JSON.stringify(postData))

  //   req.on("end", function() {
  //     console.log(new Buffer.concat(buffer).toString)
  //   })
  // }

  render() {
  // TODO: Add e-mail (This will probably involve adding state, oh well.)

    return <div id={style.login}>
        <h4>Log in to join</h4>
        <img
          src="./images/twitter.jpg"
          className={style.loginOption + ' img-circle'}
          onClick={() => this.props.dispatch(providerAuth('twitter'))}/>
        <img
          src="./images/fb.jpg"
          className={style.loginOption + ' img-circle'}
          onClick={() => this.props.dispatch(providerAuth('facebook'))}/>
        <img
          src="./images/google.png"
          className={style.loginOption + ' img-circle'}
          onClick={() => this.props.dispatch(providerAuth('google'))}/>
      </div>
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default Login
