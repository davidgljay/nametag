import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Message from '../Message'

storiesOf('Message', module)
  .add('with no props', () =>
    <Message />
  )
