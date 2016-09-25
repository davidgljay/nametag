
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Radium, {StyleRoot} from 'radium'

import Room from './containers/Room/RoomContainer'
import RoomCards from './containers/Room/RoomCardsContainer'
import {getUser} from './actions/UserActions'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

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

const DecoratedNametag = Radium(DragDropContext(HTML5Backend)(Nametag))

ReactDOM.render(<DecoratedNametag/>, mountNode)

