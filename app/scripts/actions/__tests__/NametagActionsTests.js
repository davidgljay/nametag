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
          room: 'abc',
        })
    })
  })

  describe('subscribe', () => {
    let dispatch
    let results
    beforeEach(() => {
      results = []
      dispatch = (res) => {results.push(res)}
    })
    it('should subscribe to a list of nametags', (done) => {
      hzMock([{id: 1}])
      let NametagActions = require('../NametagActions')

      NametagActions.subscribe(1, 'abc')(dispatch).then(
        () => {
          expect(results[0]).toEqual(
            {
              type: constants.ADD_NAMETAG,
              nametag: {id: 1},
              id: 1,
              room: 'abc',
            })
          done()
        })
    })
  })
})

