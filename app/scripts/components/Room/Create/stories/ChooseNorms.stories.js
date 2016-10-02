import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import ChooseNorms from '../ChooseNorms'

storiesOf('ChooseNorms', module)
  .add('basic', () =>
    <ChooseNorms
      addNorm={action('addNorm')}
      removeNorm={action('removeNorm')}/>
  )
