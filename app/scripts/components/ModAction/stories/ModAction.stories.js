import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import ModAction from '../ModAction'

storiesOf('ModAction', module)
  .add('basic', () =>
    <ModAction
      close={action('close')}
      author={{
        name: 'Test Author'
      }}
      msgId='123'
      norms={
        [
          'Norm 1',
          'Norm 2'
        ]
      }
      />
  )
