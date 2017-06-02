import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Compose from '../Compose'

storiesOf('Compose', module)
  .add('basic', () =>
    <Compose
      postMessage={action('postMessage')} />
)
