
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Radium, {StyleRoot} from 'radium'

import Room from './containers/Room/RoomContainer'
import RoomCards from './containers/Room/RoomCardsContainer'
import CreateRoom from './containers/Room/CreateRoomContainer'
import CreateBadge from './containers/Badge/CreateBadgeContainer'
import Badge from './containers/Badge/BadgeContainer'
// import {getUser} from './actions/UserActions'
import {registerServiceWorker, firebaseInit} from './actions/NotificationActions'

import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {ApolloProvider} from 'react-apollo'
import {client} from './graph/client'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import store from './graph/store'
import { Router, Route, browserHistory } from 'react-router'

injectTapEventPlugin()

const mountNode = document.getElementById('app')

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#005362',
    primary2Color: '#4cdc85',
    accent1Color: '#620057',
    accent2Color: '#dc6d4c',
    pickerHeaderColor: '#005362'
  }
})

class Nametag extends Component {

  componentWillMount () {
    // store.dispatch(getUser())
    store.dispatch(firebaseInit())
    store.dispatch(registerServiceWorker())

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

  render () {
    return <ApolloProvider client={client} store={store}>
      <StyleRoot>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Router history={browserHistory}>
            <Route path='/' component={RoomCards} />
            <Route path='/rooms' component={RoomCards} />
            <Route path='/rooms/create' component={CreateRoom} />
            <Route path='/rooms/:roomId' component={Room} />
            <Route path='/granters/:granterCode/badges/create' component={CreateBadge} />
            <Route path='/granters/:granterCode/badges/:templateId' component={Badge} />
            <Route path='/badges/:templateId' component={Badge} />
          </Router>
        </MuiThemeProvider>
      </StyleRoot>
    </ApolloProvider>
  }
}

const DecoratedNametag = Radium(DragDropContext(TouchBackend({ enableMouseEvents: true }))(Nametag))

ReactDOM.render(<DecoratedNametag />, mountNode)
