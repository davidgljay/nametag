import { configure } from '@kadira/storybook'
import '../app/bower_components/bootstrap/dist/css/bootstrap.css'

const req = require.context('../app/scripts/components', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
