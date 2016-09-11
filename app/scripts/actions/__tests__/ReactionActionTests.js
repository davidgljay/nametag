jest.unmock('../ReactionActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import constants from '../../constants'
import {mockHz} from '../../tests/mockGlobals'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../ReactionActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('RoomActions', () => {
  let store
  let calls
  beforeEach(() => {
    store = mockStore({})
    calls = []
    hz.mockClear()
  })

  describe('addReaction', () => {
    let mockReaction
    beforeEach(()=>{
      mockReaction = {
        emoji: ':dinosuar:',
        room: 'abc',
        message: 'MSG',
        nametag: '123',
      }
    })
    it('should post a reaction', () => {
      let result = {id: '999'}
      hz.mockReturnValue(mockHz(result, calls)())
      actions.addReaction(mockReaction)(store.dispatch).then(
        (res) => {
          expect(res).toEqual(result)
          expect(calls[1]).toEqual({type: 'insert', req: mockReaction})
        })
    })
  })

  describe('removeReaction', () => {
    let mockReaction
    beforeEach(()=>{
      mockReaction = 'rctn'
    })
    it('should delete a reaction', () => {
      hz.mockReturnValue(mockHz({}, calls)())
      actions.removeReaction(mockReaction)(store.dispatch).then(
        () => {
          expect(calls[1]).toEqual({type: 'find', req: mockReaction})
          expect(calls[2]).toEqual({type: 'delete', req: null})
        })
    })
  })


})
