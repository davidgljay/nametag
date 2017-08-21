/* global __webpack_hash__ */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Radium, {StyleRoot} from 'radium'
import Raven from 'raven-js'

import constants from './constants'
import Room from './containers/Room/RoomContainer'
import RoomCards from './containers/Room/RoomCardsContainer'
import CreateRoom from './containers/Room/CreateRoomContainer'
import CreateBadge from './containers/Badge/CreateBadgeContainer'
import Badge from './containers/Badge/BadgeContainer'
import ShareBadge from './containers/Badge/ShareBadgeContainer'
import Granter from './containers/Granter/GranterContainer'
import PasswordReset from './containers/User/PasswordReset'
import Unsubscribe from './containers/User/UnsubscribeContainer'
import EmailConfirm from './containers/User/EmailConfirm'
import {registerServiceWorker, firebaseInit} from './actions/NotificationActions'

import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {ApolloProvider} from 'react-apollo'
import {client} from './graph/client'
import USER_QUERY from './graph/queries/userQuery.graphql'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import store from './graph/store'
import {primary, secondary} from '../styles/colors'
import { Router, Route, browserHistory } from 'react-router'

if (process.env.NODE_ENV === 'production') {
  Raven.config(constants.SENTRY_DSN, {
    release: __webpack_hash__,
    tags: {git_commit: process.env.CLIENT_GIT_HASH},
    environment: process.env.NODE_ENV
  }).install()
}

injectTapEventPlugin()

const mountNode = document.getElementById('app')

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: primary,
    primary2Color: '#4cdc85',
    accent1Color: secondary,
    accent2Color: '#dc6d4c',
    pickerHeaderColor: primary
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

    // Attach user id to Sentry error reports
    client.watchQuery({query: USER_QUERY, fetchPolicy: 'cache-only'}).subscribe({
      next: ({data}) => {
        if (data.me) {
          Raven.setUserContext({id: data.me.id})
        }
      }
    })
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
            <Route path='/granters/:urlCode' component={Granter} />
            <Route path='/granters/:urlCode/badges/create' component={CreateBadge} />
            <Route path='/granters/:urlCode/badges/:templateId' component={Badge} />
            <Route path='/badges/:templateId' component={Badge} />
            <Route path='/badges/:templateId/qrcode' component={ShareBadge} />
            <Route path='/passwordreset/:token' component={PasswordReset} />
            <Route path='/emailconfirm/:token' component={EmailConfirm} />
            <Route path='/unsubscribe/:userToken' component={Unsubscribe} />
          </Router>
        </MuiThemeProvider>
      </StyleRoot>
    </ApolloProvider>
  }
}

const DecoratedNametag = Radium(DragDropContext(TouchBackend({ enableMouseEvents: true }))(Nametag))

ReactDOM.render(<DecoratedNametag />, mountNode)
