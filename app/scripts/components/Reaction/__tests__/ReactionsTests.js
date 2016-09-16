jest.unmock('../Reactions')

import React from 'react'
import Reactions from '../Reactions'


describe('Reactions component', () => {
  let component
  beforeEach(() => {
    component = new Reactions()
  })

  describe('reactionsToArray', () => {
    it('should transform reactions to an array', () => {
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
      const reactionsArray = component.reactionsToArray(reactionsObj)
      expect(reactionsArray).toEqual([
        {
          name: '100',
          count: 2,
        },
        {
          name: 'thumbs_up',
          count: 1,
        },
      ])
    })
  })
})
