
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Room from './ui/Room/Room';
import RoomCards from './ui/RoomCard/RoomCards';

const mountNode = document.getElementById('app');

import { Router, Route, Link, hashHistory } from 'react-router';

require('./config');

class Nametag extends Component {
  constructor(props) {
    super(props);
    const auth = new Firebase(process.env.FIREBASE_URL).getAuth();
    this.state = {
      auth: auth,
    };
  }

  getChildContext() {
    return {
      userAuth: this.state.auth,
      unAuth: this.unAuth,
      checkAuth: this.checkAuth,
    };
  }

  unAuth(e) {
    e.preventDefault();
    new Firebase(process.env.FIREBASE_URL).unauth();
    this.checkAuth();
  }

  checkAuth() {
    this.setState( {
      auth: new Firebase(process.env.FIREBASE_URL).getAuth(),
    });
  }

  render() {
    return <Router history={hashHistory}>
      <Route path="/" component={RoomCards} />
      <Route path="/rooms" component={RoomCards}/>
      <Route path="/rooms/:roomId" component={Room}/>
    </Router>;
  }
}

Nametag.childContextTypes = {
  userAuth: PropTypes.object,
  unAuth: PropTypes.func,
  checkAuth: PropTypes.func,
};

ReactDOM.render(<Nametag/>, mountNode);

