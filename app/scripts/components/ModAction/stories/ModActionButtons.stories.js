import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import ModActionButtons from '../ModActionButtons'

storiesOf('ModActionButtons', module)
  .add('not escalated', () =>
    <ModActionButtons
      remindOfNorms={action('remindOfNorms')}
      escalated = {false}
      escalate = {action('escalate')}
      removeUser = {action('removeUser')}
      authorName = 'Test Author'
      notifyBadge = {action('notifyBadge')}
      />
    )
  .add('escalated', () =>
    <ModActionButtons
      remindOfNorms={action('remindOfNorms')}
      escalated = {true}
      escalate = {action('escalate')}
      removeUser = {action('removeUser')}
      authorName = 'Test Author'
      notifyBadge = {action('notifyBadge')}
      />
    )
