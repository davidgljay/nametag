jest.unmock('../RoomActions')
jest.unmock('../../tests/mockGlobals')
jest.unmock('../NametagActions')
jest.unmock('../UserActions')
jest.unmock('../MessageActions')
jest.unmock('../UserNametagActions')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import * as actions from '../RoomActions'
import constants from '../../constants'
import {mockHz} from '../../tests/mockGlobals'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

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

  describe('addRoom', () => {
    it('creates an addRoom action', () => {
      let addRoom = actions.addRoom('test', '123')
      expect(addRoom).toEqual({
        type: constants.ADD_ROOM,
        room: 'test',
        id: '123'
      })
    })
  })

  describe('subscribe', () => {
    it('should subscribe to a room', function () {
      const lastPresent = Date.now()
      let mockResponses = [
        [{id: 1}, {id: 2}],
        [{lastPresent}],
        [{lastPresent}, {lastPresent}, {lastPresent}],
        [{id: 'nametag1'}, {id: 'nametag2'}]
      ]

      hz.mockReturnValueOnce(mockHz(mockResponses[0], calls)())
      hz.mockReturnValueOnce(mockHz(mockResponses[1], calls)())
      hz.mockReturnValueOnce(mockHz(mockResponses[2], calls)())
      hz.mockReturnValueOnce(mockHz(mockResponses[3], calls)())
      return actions.subscribe()(store.dispatch, store.getState)
      .then(() => {
        expect(store.getActions()[0]).toEqual({
          property: 'nametagCount',
          room: 2,
          type: 'SET_ROOM_PROP',
          value: 1
        })
        expect(store.getActions()[1]).toEqual({
          type: constants.SET_ROOM_PROP,
          room: 1,
          property: 'nametagCount',
          value: 3
        })
        expect(store.getActions()[2]).toEqual({
          type: constants.ADD_ROOM_ARRAY,
          rooms: [{id: 1}, {id: 2}]
        })
        expect(store.getActions()[3]).toEqual({
          type: constants.ADD_NAMETAG_ARRAY,
          nametags: [{id: 'nametag1'}, {id: 'nametag2'}]
        })
      })
    })
  })

  describe('joinRoom', () => {
    it('should join a room', () => {
      let calls2 = []
      let calls3 = []
      let calls4 = []
      hz.mockReturnValueOnce(mockHz({id: '456'}, calls)())
      hz.mockReturnValueOnce(mockHz({id: 'def'}, calls2)())
      hz.currentUser = jest.fn()
        .mockReturnValue(mockHz({id: 'a', data: {nametags: []}}, calls3)())
      hz.mockReturnValueOnce(mockHz({updated: true}, calls4)())
      return actions.joinRoom('1234', {name: 'tag', room: '1234'}, 'me')(store.dispatch)
        .then((nametagId) => {
          // Expect the promise to return the nametag value
          expect(nametagId).toEqual('456')

          // Expect the nametag to be inserted into the nametag db
          expect(hz.mock.calls[0]).toEqual(['nametags'])
          expect(calls[1]).toEqual({
            type: 'upsert',
            req: {name: 'tag', room: '1234'}
          })

          // Expect the nametag id to be inserted into the user_nametags table
          expect(hz.mock.calls[1]).toEqual(['user_nametags'])
          expect(calls2[1]).toEqual({
            type: 'upsert',
            req: {
              room: '1234',
              user: 'me',
              mentions: [],
              nametag: '456'
            }
          })

          // Expect the nametag to be added to the store
          expect(store.getActions()[0]).toEqual({
            type: 'ADD_NAMETAG',
            nametag: {name: 'tag', room: '1234'},
            id: '456'
          })
        },
        (err) => {
          expect(err).toEqual(null)
        })
    })
  })

  describe('watchRoom', () => {
    it('should watch a room', () => {
      let room = {
        id: '123',
        name: 'A Room'
      }
      hz.mockReturnValue(mockHz(room, calls)())
      return actions.watchRoom('123')(store.dispatch).then((res) => {
        expect(calls[1]).toEqual({type: 'find', req: '123'})
        expect(calls[2]).toEqual({type: 'watch', req: undefined})
        expect(store.getActions()[0]).toEqual({
          type: 'ADD_ROOM',
          room: room,
          id: room.id
        })
      })
    })
  })

  describe('postRoom', () => {
    it('should post a room', () => {
      let room = {
        name: 'A Room'
      }
      hz.mockReturnValue(mockHz({id: '123'}, calls)())
      return actions.postRoom(room)(store.dispatch).then((res) => {
        expect(calls[1]).toEqual({type: 'upsert', req: room})
        expect(res).toEqual('123')
        expect(store.getActions()[0]).toEqual({
          type: 'ADD_ROOM',
          room: {...room, id: '123'},
          id: '123'
        })
      })
    })
  })

  describe('upateRoom', () => {
    it('should update a room on the server', () => {
      hz.mockReturnValue(mockHz({updated: 1}, calls)())
      return actions.updateRoom('123', 'name', 'A new name')(store.dispatch).then((res) => {
        expect(calls[1]).toEqual({type: 'update', req: {id: '123', name: 'A new name'}})
        expect(res).toEqual({updated: 1})
        expect(store.getActions()[0]).toEqual({
          type: 'SET_ROOM_PROP',
          room: '123',
          property: 'name',
          value: 'A new name'
        })
      })
    })
  })
})
