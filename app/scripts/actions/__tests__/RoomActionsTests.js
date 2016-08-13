jest.unmock('../RoomActions')
jest.unmock('../../tests/mockGlobals')
jest.unmock('../../api/horizon')

import constants from '../../constants'
import {hzMock} from '../../tests/mockGlobals'

describe('RoomActions', () => {
  describe('addRoom', () => {
    it('creates an addRoom action', () => {
      let RoomActions = require('../RoomActions')
      let addRoom = RoomActions.addRoom('test', '123')
      expect(addRoom).toEqual({
        type: constants.ADD_ROOM,
        room: 'test',
        id: '123',
      })
    })
  })

  describe('setRoomNametagCount', () => {
    it('should set the room nametag count', () => {
      let RoomActions = require('../RoomActions')
      expect(RoomActions.setRoomNametagCount('123', 10))
        .toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          roomId: '123',
          nametagCount: 10,
        })
    })
  })

  describe('addNametagCert', () => {
    it('should add a certificate to the user nametag for this room', () => {
      let RoomActions = require('../RoomActions')
      expect(RoomActions.addNametagCert({name: 'Test Certificate', id: '123' }, 'abc'))
        .toEqual({
          type: constants.ADD_USER_NT_CERT,
          cert: {name: 'Test Certificate', id: '123' },
          roomId: 'abc',
        })
    })
  })

  describe('removeNametagCert', () => {
    it('should remove a certificate from the user nametag for this room', () => {
      let RoomActions = require('../RoomActions')
      expect(RoomActions.removeNametagCert('123', 'abc'))
        .toEqual({
          type: constants.REMOVE_USER_NT_CERT,
          certId: '123',
          roomId: 'abc',
        })
    })
  })

  describe('updateNametag', () => {
    it('should update the user nametag', () => {
      let RoomActions = require('../RoomActions')
      expect(RoomActions.updateNametag('abc', 'name', 'Allosaur'))
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
      hzMock(mockResponses)
      let RoomActions = require('../RoomActions')
      RoomActions.subscribe()(dispatch)
      .then(function() {
        expect(results[0]).toEqual({
          type: constants.ADD_ROOM,
          room: {id: 2},
          id: 2,
        })
        expect(results[1]).toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          roomId: 2,
          nametagCount: 2,
        })
        expect(results[2]).toEqual({
          type: constants.ADD_ROOM,
          room: {id: 1},
          id: 1,
        })
        expect(results[3]).toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          roomId: 1,
          nametagCount: 1,
        })
        done()
      })
    })
  })
})

