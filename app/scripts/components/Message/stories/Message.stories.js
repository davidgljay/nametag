import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Message from '../Message'

storiesOf('Message', module)
  .add('of type message', () =>
    <Message
      id='123'
      text="Message sample text"
      date={123456789}
      type='message'
      author={
        {
          name: 'Test author',
          icon: 'http://test.author.icon',
        }
      }
      />
  )
