
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Room from './containers/Room/RoomContainer'
import RoomCards from './containers/Room/RoomCardsContainer'
import {getUser} from './actions/UserActions'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import mainReducer from './reducers'

import { Router, Route, Link, hashHistory } from 'react-router'

const mountNode = document.getElementById('app')
let store = createStore(mainReducer, applyMiddleware(thunk))

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
      <Router history={hashHistory}>
        <Route path="/" component={RoomCards} />
        <Route path="/rooms" component={RoomCards}/>
        <Route path="/rooms/:roomId" component={Room}/>
      </Router>
    </Provider>
  }
}

Nametag.childContextTypes = {
  dispatch: React.PropTypes.func,
}

let NametagWithDragging = DragDropContext(HTML5Backend)(Nametag)

ReactDOM.render(<NametagWithDragging/>, mountNode)

