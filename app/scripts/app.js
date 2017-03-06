
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Radium, {StyleRoot} from 'radium'

import Room from './containers/Room/RoomContainer'
import RoomCards from './containers/Room/RoomCardsContainer'
import CreateRoom from './containers/Room/CreateRoomContainer'
import CreateBadge from './containers/Badge/CreateBadgeContainer'
import BadgeDetail from './containers/Badge/BadgeDetailContainer'
import {getUser} from './actions/UserActions'

import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import mainReducer from './reducers'

import { Router, Route, browserHistory } from 'react-router'

injectTapEventPlugin()

const mountNode = document.getElementById('app')

let store = createStore(mainReducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyCkPlC2qRkXchd9AdubS6aAyvhE1TNAPqU',
  databaseURL: 'https://nametagproject.firebaseio.com',
  messagingSenderId: '820872076821'
})

const messaging = firebase.messaging()
navigator.serviceWorker.getRegistration()
.then(reg => messaging.useServiceWorker(reg))
.then(() => messaging.getToken())
.then(token => console.log('got token', token))

if ('serviceWorker' in navigator) {
  console.log('Registering')
  navigator.serviceWorker.register('/sw.js', {scope: './'})
    .catch(e => console.log('install error', e))
}

class Nametag extends Component {

  componentWillMount () {
    store.dispatch(getUser())

    // Handle funky FB login hash
    if (window.location.hash === '#_=_') {
      window.location.hash = ''
      history.pushState('', document.title, window.location.pathname)
    }

    const postAuth = window.localStorage.getItem('postAuth')
    if (postAuth) {
      window.location = postAuth
      window.localStorage.removeItem('postAuth')
    }
  }

  // componentDidMount () {
  //   const messaging = firebase.messaging()
  //   messaging.requestPermission()
  //   .then(function () {
  //     console.log('Notification permission granted.')
  //     messaging.getToken()
  //       .then((currentToken) => {
  //         console.log('Current Token', currentToken)
  //       })
  //       .catch((err) => {
  //         console.log('An error occurred while retrieving token. ', err)
  //       })
  //   })
  //   .catch((err) => {
  //     console.log('Unable to get permission to notify.', err)
  //   })
  // }

  getChildContext () {
    return {
      dispatch: store.dispatch
    }
  }

  render () {
    return <Provider store={store}>
      <StyleRoot>
        <MuiThemeProvider>
          <Router history={browserHistory}>
            <Route path='/' component={RoomCards} />
            <Route path='/rooms' component={RoomCards} />
            <Route path='/rooms/create' component={CreateRoom} />
            <Route path='/rooms/:roomId' component={Room} />
            <Route path='/badges/create' component={CreateBadge} />
            <Route path='/badges/:certificateId' component={BadgeDetail} />
          </Router>
        </MuiThemeProvider>
      </StyleRoot>
    </Provider>
  }
}

Nametag.childContextTypes = {
  dispatch: PropTypes.func
}

const DecoratedNametag = Radium(DragDropContext(TouchBackend({ enableMouseEvents: true }))(Nametag))

ReactDOM.render(<DecoratedNametag />, mountNode)
