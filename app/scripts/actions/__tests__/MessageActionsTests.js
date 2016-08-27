jest.unmock('../MessageActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import constants from '../../constants'
import {mockHz} from '../../tests/mockGlobals'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../MessageActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Message Actions', () => {
  let store
  let calls
  beforeEach(() => {
    store = mockStore({})
    calls = []
  })

  describe('getRoomMessages', () => {
    it('should fetch a list of messages from a room', (done) => {
      let results = [
        {msg: 'hi there', room: 'abc', id: '123'},
        {msg: 'well hello', room: 'abc', id: '456'},
      ]
      hz.mockReturnValue(mockHz(results, calls)())
      actions.getRoomMessages('abc')(store.dispatch).then(
        () => {
          expect(calls[1]).toEqual({type: 'findAll', req: {room: 'abc'}})
          expect(calls[2]).toEqual({type: 'watch', req: undefined})
          expect(store.getActions()[0]).toEqual({
            type: constants.ADD_MESSAGE,
            id: '123',
            message: results[0],
          })
          expect(store.getActions()[1]).toEqual({
            type: constants.ADD_MESSAGE,
            id: '456',
            message: results[1],
          })
          done()
        })
    })
  })

  describe('postMessage', () => {
    it('should post a message to a room', (done) => {
      let result = {id: '123'}
      let message = {
        type: 'message',
        text: 'This is a message',
        date: 'tuesday',
      }
      hz.mockReturnValue(mockHz(result, calls)())
      actions.postMessage(message)(store.dispatch).then(
        (id) => {
          expect(id).toEqual('123')
          expect(calls[1]).toEqual({type: 'upsert', req: message})
          expect(store.getActions()[0]).toEqual({
            type: constants.ADD_MESSAGE,
            message: message,
            id: '123',
          })
          done()
        })
    })
  })
})
