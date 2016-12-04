
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Radium, {StyleRoot} from 'radium'

import Room from './containers/Room/RoomContainer'
import RoomCards from './containers/Room/RoomCardsContainer'
import CreateRoom from './containers/Room/CreateRoomContainer'
import {getUser} from './actions/UserActions'

import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import mainReducer from './reducers'

import { Router, Route, Link, hashHistory } from 'react-router'

injectTapEventPlugin()

const mountNode = document.getElementById('app')

let store = createStore(mainReducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

class Nametag extends Component {

  componentWillMount() {
    store.dispatch(getUser())

    // Handle funky FB login hash
    if (window.location.hash === '#_=_') {
      window.location.hash = ''
      history.pushState('', document.title, window.location.pathname)
    }

  }

  getChildContext() {
    return {
      dispatch: store.dispatch,
    }
  }

  render() {
    return <Provider store={store}>
      <StyleRoot>
        <MuiThemeProvider>
          <Router history={hashHistory}>
            <Route path="/" component={RoomCards} />
            <Route path="/rooms" component={RoomCards}/>
            <Route path="/rooms/create" component={CreateRoom}/>
            <Route path="/rooms/:roomId" component={Room}/>
          </Router>
        </MuiThemeProvider>
      </StyleRoot>
    </Provider>
  }
}

Nametag.childContextTypes = {
  dispatch: PropTypes.func,
}

const DecoratedNametag = Radium(DragDropContext(TouchBackend({ enableMouseEvents: true }))(Nametag))

ReactDOM.render(<DecoratedNametag/>, mountNode)
