import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import ChooseNorms from '../ChooseNorms'

storiesOf('ChooseNorms', module)
  .add('with no predefined norms', () =>
    <ChooseNorms
      addNorm={action('addNorm')}
      removeNorm={action('removeNorm')}
      normsObj={{}}/>
  )
.add('with predefined norms', () =>
    <ChooseNorms
      addNorm={action('addNorm')}
      removeNorm={action('removeNorm')}
      normsObj={{
        1: 'stuff',
        2: 'things',
        5: 'I\'m a custom norm.',
      }}/>
  )
