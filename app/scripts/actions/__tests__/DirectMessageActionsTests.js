jest.unmock('../DirectMessageActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import constants from '../../constants'
import {mockHz} from '../../tests/mockGlobals'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../DirectMessageActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Message Actions', () => {
  let store
  let calls
  beforeEach(() => {
    store = mockStore({})
    calls = []
  })

  describe('postDirectMessage', () => {
    it('should post a message', () => {
      let result = {id: '123'}
      let message = {
        type: 'direct_message',
        to: '456',
        text: 'This is a message',
        date: 'tuesday',
      }
      hz.mockReturnValue(mockHz(result, calls)())
      return actions.postDirectMessage(message)(store.dispatch).then(
        (id) => {
          expect(id).toEqual({'id': '123'})
          expect(calls[1]).toEqual({type: 'upsert', req: message})
        })
    })
  })
})
