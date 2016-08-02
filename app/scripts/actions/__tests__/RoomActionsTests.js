jest.unmock('../RoomActions')
jest.unmock('../../tests/mockGlobals')
jest.unmock('../../api/horizon')

import constants from '../../constants'
import {hzMock, setGlobals} from '../../tests/mockGlobals'
setGlobals()

describe('RoomActions', () => {
  describe('addRoom', () => {
    it('creates an addRoom action', () => {
      let RoomActions = require('../RoomActions')
      let addRoom = RoomActions.addRoom('test', '123')
      expect(addRoom).toEqual({
        type: constants.ADD_ROOM,
        room: 'test',
        key: '123',
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

  describe('subscribe', () => {
    let dispatch
    let results
    beforeEach(() => {
      results = []
      dispatch = (res) => {results.push(res)}
    })

    it('should subscribe to a room', function(done) {
      let rooms = [{id: 1}, {id: 2}]
      hzMock(rooms)
      let RoomActions = require('../RoomActions')
      RoomActions.subscribe()(dispatch)
      .then(function() {
        expect(results[0]).toEqual({
          type: constants.ADD_ROOM,
          room: {id: 2},
          key: 2,
        })
        expect(results[1]).toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          roomId: 2,
          nametagCount: 2,
        })
        expect(results[2]).toEqual({
          type: constants.ADD_ROOM,
          room: {id: 1},
          key: 1,
        })
        expect(results[3]).toEqual({
          type: constants.SET_ROOM_NT_COUNT,
          roomId: 1,
          nametagCount: 2,
        })
        done()
      })
    })
  })
    // beforeEach(function () {
    //     timer = TestUtils.renderIntoDocument(<Timer/>);
    // });
})

