jest.unmock('../RoomActions')
jest.unmock('../../tests/mockGlobals')
jest.unmock('../NametagActions')
jest.unmock('../UserActions')

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
        id: '123',
      })
    })
  })

  describe('setRoomNametagCount', () => {
    it('should set the room nametag count', () => {
      expect(actions.setRoomNametagCount('123', 10))
        .toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          room: '123',
          nametagCount: 10,
        })
    })
  })

  describe('addNametagCert', () => {
    it('should add a certificate to the user nametag for this room', () => {
      expect(actions.addNametagCert({name: 'Test Certificate', id: '123' }, 'abc'))
        .toEqual({
          type: constants.ADD_USER_NT_CERT,
          cert: {name: 'Test Certificate', id: '123' },
          room: 'abc',
        })
    })
  })

  describe('removeNametagCert', () => {
    it('should remove a certificate from the user nametag for this room', () => {
      expect(actions.removeNametagCert('123', 'abc'))
        .toEqual({
          type: constants.REMOVE_USER_NT_CERT,
          certId: '123',
          room: 'abc',
        })
    })
  })

  describe('updateNametag', () => {
    it('should update the user nametag', () => {
      expect(actions.updateNametag('abc', 'name', 'Allosaur'))
        .toEqual({
          type: constants.UPDATE_USER_NAMETAG,
          room: 'abc',
          property: 'name',
          value: 'Allosaur',
        })
    })
  })

  describe('subscribe', () => {
    it('should subscribe to a room', function(done) {
      let mockResponses = [
        [{id: 1}, {id: 2}],
        [{}],
        [{}, {}, {}],
      ]
      hz.mockReturnValueOnce({
        watch: () => {
          return {
            subscribe: (subs) => {
              return subs(mockResponses[0])
            },
          }
        },
      })
      hz.mockReturnValueOnce({
        findAll: () => {
          return {
            watch: () => {
              return {
                subscribe: (subs) => {
                  return subs(mockResponses[1])
                },
              }
            },
          }
        },
      })
      hz.mockReturnValueOnce({
        findAll: () => {
          return {
            watch: () => {
              return {
                subscribe: (subs) => {
                  return subs(mockResponses[2])
                },
              }
            },
          }
        },
      })
      actions.subscribe()(store.dispatch, store.getState)
      .then(function() {
        expect(store.getActions()[0]).toEqual({
          type: constants.ADD_ROOM,
          room: {id: 2},
          id: 2,
        })
        expect(store.getActions()[1]).toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          room: 2,
          nametagCount: 1,
        })
        expect(store.getActions()[2]).toEqual({
          type: constants.ADD_ROOM,
          room: {id: 1},
          id: 1,
        })
        expect(store.getActions()[3]).toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          room: 1,
          nametagCount: 3,
        })
        done()
      })
    })
  })

  describe('joinRoom', () => {
    it('should join a room', (done) => {
      let calls2 = []
      hz.mockReturnValueOnce(mockHz({id: '456'}, calls)())
      hz.mockReturnValueOnce(mockHz({id: 'def'}, calls2)())
      actions.joinRoom('1234', {name: 'tag', room: '1234'}, 'me')(store.dispatch)
        .then((nametagId) => {
          // Expect the promise to return the nametag value
          expect(nametagId).toEqual('456')

          // Expect the nametag to be inserted into the nametag db
          expect(hz.mock.calls[0]).toEqual(['nametags'])
          expect(calls[1]).toEqual({
            type: 'upsert',
            req: {name: 'tag', room: '1234'},
          })

          // Expect the nametag id to be inserted into the user_nametags table
          expect(hz.mock.calls[1]).toEqual(['user_nametags'])
          expect(calls2[1]).toEqual({
            type: 'insert',
            req: {
              room: '1234',
              user: 'me',
              nametag: '456',
            },
          })

          // Expect the nametag to be added to the store
          expect(store.getActions()[0]).toEqual({
            type: 'ADD_NAMETAG',
            nametag: {name: 'tag', room: '1234'},
            id: '456',
          })
          done()
        },
        (err) => {
          expect(err).toEqual(null)
          done()
        })
    })
  })

  describe('getRoom', () => {
    it('should watch a room', (done) => {
      let room = {
        id: '123',
        name: 'A Room',
      }
      hz.mockReturnValue({
        find: (id) => {
          calls.push({find: id})
          return {
            watch: () => {
              return {
                subscribe: (subs) => {
                  return subs(room)
                },
              }
            },
          }
        },
      })
      actions.getRoom('123')(store.dispatch).then((res) => {
        expect(calls[0]).toEqual({find: '123'})
        expect(res).toEqual(room)
        expect(store.getActions()[0]).toEqual({
          type: 'ADD_ROOM',
          room: room,
          id: room.id,
        })
        done()
      })
    })
  })
})

