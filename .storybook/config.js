import { configure, addDecorator } from '@kadira/storybook'
import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const req = require.context('../app/scripts/components', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

const muiTheme = (story) =>
  <MuiThemeProvider>
    {story()}
  </MuiThemeProvider>


addDecorator(muiTheme)
configure(loadStories, module)
