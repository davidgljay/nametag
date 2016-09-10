import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import VisibilityOptions from '../VisibilityOptions'

storiesOf('VisibilityOptions', module)
  .add('public', () =>
    <VisibilityOptions
      isPublic={true}
      setPublic={
        (val) =>
          () => action('setPublic')(val)
      }/>
  )
  .add('private', () =>
    <VisibilityOptions
      isPublic={false}
      setPublic={
        (val) =>
          () => action('setPublic')(val)
      }/>
  )
