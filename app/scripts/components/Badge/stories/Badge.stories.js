import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Badge from '../Badge'

// PropTypes:
//  badge: PropTypes.shape({
//    id: PropTypes.string.isRequired,
//    notes: PropTypes.arrayOf(PropTypes.shape({
//      text: PropTypes.string.isRequired,
//      date: PropTypes.string.isRequired
//    })).isRequired,
//    template: PropTypes.shape({
//      icon: PropTypes.string,
//      name: PropTypes.string.isRequired,
//      description: PropTypes.string.isRequired
//    }).isRequired
//  }).isRequired

const badge = {
  id: '1234',
  notes: [{
    text: 'A note!',
    date: new Date().toISOString()
  }],
  template: {
    icon: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.stayonsearch.com%2Fwp-content%2Fuploads%2F2012%2F12%2Fgoogle_penguin.png&f=1',
    name: 'Super cool Penguin',
    description: 'Is a penguin'
  }
}

storiesOf('Badge', module)
  .add('basic', () =>
    <Badge
      badge={badge} />)
  .add('showUpload', () =>
    <Badge
      badge={badge}
      showIconUpload />)
