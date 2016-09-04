import { configure } from '@kadira/storybook'
import '../app/material.min.css'
import '../app/material.min.js'

const req = require.context('../app/scripts/components', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
