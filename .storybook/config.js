import { configure } from '@kadira/storybook'

const req = require.context('../app/scripts/components', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
  require('../app/material.min.js')
  require('../app/material.min.css')
}

configure(loadStories, module)
