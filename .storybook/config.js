import { configure } from '@kadira/storybook'
import 'react-mdl/extra/material.css'

const req = require.context('../app/scripts/components', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
