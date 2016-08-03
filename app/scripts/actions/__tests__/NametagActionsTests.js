jest.unmock('../NametagActions')
jest.unmock('../../tests/mockGlobals')
jest.unmock('../../api/horizon')

import constants from '../../constants'
import {hzMock} from '../../tests/mockGlobals'

describe('Nametag Actions', () => {
  describe('addNametag', () => {
    it('should add a namtag', () => {
      let NametagActions = require('../NametagActions')
      expect(NametagActions.addNametag({name: 'tag'}, '123', 'abc'))
        .toEqual({
          type: constants.ADD_NAMETAG,
          nametag: {name: 'tag'},
          id: '123',
          roomId: 'abc',
        })
    })
  })
})

