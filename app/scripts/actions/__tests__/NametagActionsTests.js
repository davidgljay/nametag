jest.unmock('../NametagActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import constants from '../../constants'
import {mockHz} from '../../tests/mockGlobals'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../NametagActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Nametag Actions', () => {
  let store
  beforeEach(() => {
    store = mockStore({})
  })

  describe('addNametag', () => {
    it('should add a namtag', () => {
      expect(actions.addNametag({name: 'tag'}, '123', 'abc'))
        .toEqual({
          type: constants.ADD_NAMETAG,
          nametag: {name: 'tag'},
          id: '123',
          room: 'abc',
        })
    })
  })

  describe('subscribe', () => {
    it('should subscribe to a list of nametags', (done) => {
      let calls = []
      hz.mockReturnValue(mockHz({id: 1}, calls)())
      actions.subscribe(1, 'abc')(store.dispatch).then(
        () => {
          expect(calls[1]).toEqual({type: 'find', req: 1})
          expect(calls[2].type).toEqual('watch')
          expect(store.getActions()[0]).toEqual(
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

