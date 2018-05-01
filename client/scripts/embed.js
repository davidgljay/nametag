/* global __webpack_hash__ */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Radium, {StyleRoot} from 'radium'
import Raven from 'raven-js'
import constants from './constants'
import Embed from './containers/Granter/EmbedContainer'
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

  render () {
    return <ApolloProvider client={client} store={store}>
      <StyleRoot>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Router history={browserHistory}>
            <Route path='/granters/:urlCode/embed' component={Embed} />
          </Router>
        </MuiThemeProvider>
      </StyleRoot>
    </ApolloProvider>
  }
}

const DecoratedNametag = Radium(DragDropContext(TouchBackend({ enableMouseEvents: true }))(Nametag))

ReactDOM.render(<DecoratedNametag />, mountNode)
