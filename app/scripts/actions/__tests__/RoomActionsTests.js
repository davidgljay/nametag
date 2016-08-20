jest.unmock('../RoomActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import * as actions from '../RoomActions'
import constants from '../../constants'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('RoomActions', () => {
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
          roomId: '123',
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
          roomId: 'abc',
        })
    })
  })

  describe('removeNametagCert', () => {
    it('should remove a certificate from the user nametag for this room', () => {
      expect(actions.removeNametagCert('123', 'abc'))
        .toEqual({
          type: constants.REMOVE_USER_NT_CERT,
          certId: '123',
          roomId: 'abc',
        })
    })
  })

  describe('updateNametag', () => {
    it('should update the user nametag', () => {
      expect(actions.updateNametag('abc', 'name', 'Allosaur'))
        .toEqual({
          type: constants.UPDATE_USER_NAMETAG,
          roomId: 'abc',
          property: 'name',
          value: 'Allosaur',
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
        find: () => {
          return {
            subscribe: (subs) => {
              return subs(mockResponses[1])
            },
          }
        },
      })
      hz.mockReturnValueOnce({
        find: () => {
          return {
            subscribe: (subs) => {
              return subs(mockResponses[2])
            },
          }
        },
      })
      actions.subscribe()(dispatch)
      .then(function() {
        expect(results[0]).toEqual({
          type: constants.ADD_ROOM,
          room: {id: 2},
          id: 2,
        })
        expect(results[1]).toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          roomId: 2,
          nametagCount: 1,
        })
        expect(results[2]).toEqual({
          type: constants.ADD_ROOM,
          room: {id: 1},
          id: 1,
        })
        expect(results[3]).toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          roomId: 1,
          nametagCount: 3,
        })
        done()
      })
    })
  })

  describe('joinRoom', () => {


  })
})

