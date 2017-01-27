jest.unmock('../DirectMessageActions')
jest.unmock('../MessageActions')
jest.unmock('../../tests/mockGlobals')
jest.unmock('../RoomActions')
jest.unmock('lodash')

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
    store = mockStore({
      rooms: {
        abc: {
          name: 'stuff',
        },
      },
      nametags: {
        def: {
          id: 'def',
          name: 'cornelius',
          room: 'abc',
        },
      },
      user: {
        id: '123',
      },
    })
    calls = []
  })

  describe('postDirectMessage', () => {
    it('should post a message with the proper recipient', () => {
      let result = {id: '123'}
      let message = {
        room: 'abc',
        text: 'd cornelius This is a message',
        date: 'tuesday',
      }
      hz.mockReturnValue(mockHz(result, calls)())
      return actions.postDirectMessage(message)(store.dispatch, store.getState).then(
        (id) => {
          expect(id).toEqual({'id': '123'})
          expect(calls[1]).toEqual({type: 'upsert', req: {...message, recipient: 'def'}})
        })
    })
  })

  describe('watchDirectMessages', () => {
    it('should fetch a list of direct messages from a room', () => {
      let results = [
        {msg: 'hi there', room: 'abc', id: '123'},
        {msg: 'well hello', room: 'abc', id: '456'},
      ]
      hz.mockReturnValue(mockHz(results, calls)())
      return actions.watchDirectMessages('abc')(store.dispatch, store.getState).then(
        () => {
          expect(calls[1]).toEqual({type: 'findAll', req: {room: 'abc', user: '123'}})
          expect(calls[2]).toEqual({type: 'watch', req: undefined})
          expect(store.getActions()[0]).toEqual({
            type: constants.ADD_MESSAGE_ARRAY,
            messages: results,
          })
        })
    })
  })
})
