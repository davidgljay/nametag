import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import radium, {StyleRoot} from 'radium'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {primary, secondary} from '../styles/colors'
import store from './graph/store'
import {client} from './graph/client'
import {ApolloProvider} from 'react-apollo'
import LandingPage from './components/Static/LandingPage'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: primary,
    primary2Color: '#4cdc85',
    accent1Color: secondary,
    accent2Color: '#dc6d4c',
    pickerHeaderColor: primary
  }
})

class LandingContainer extends Component {

  render () {
    return <ApolloProvider client={client} store={store}>
      <StyleRoot>
        <MuiThemeProvider muiTheme={muiTheme}>
          <LandingPage />
        </MuiThemeProvider>
      </StyleRoot>
    </ApolloProvider>
  }
}

const mountNode = document.getElementById('landing')

const DecoratedLanding = radium(LandingContainer)

ReactDOM.render(<DecoratedLanding />, mountNode)
