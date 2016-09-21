import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import CreateRoom from '../CreateRoom'

import '../../../../material.min.css'
import '../../../../material.min.js'

storiesOf('CreateRoom', module)
  .add('basic', () =>
    <CreateRoom/>
  )
