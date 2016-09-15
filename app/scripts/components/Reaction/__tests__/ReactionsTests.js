jest.unmock('../Reactions')

import React from 'react'
import Reactions from '../Reactions'
import renderer from 'react-test-renderer'


describe('Reactions component', () => {
  describe('reactionsToArray', () => {
    it('should transform reactions to an array', () => {
      const reactionsToArray = new Reactions().reactionsToArray
      const reactionsObj = {
        '1': {
          emoji: '100',
        },
        '2': {
          emoji: '100',
        },
        '3': {
          emoji: 'thumbs_up',
        },
      }
      const reactionsArray = reactionsToArray(reactionsObj)
      expect(reactionsArray).toEqual([
        {
          emoji: '100',
          count: 2,
        },
        {
          emoji: 'thumbs_up',
          count: 1,
        },
      ])
    })
  })
})
