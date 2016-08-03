import roomReducer from '../RoomReducer'
import constants from '../../constants'

jest.unmock('../RoomReducer')

describe('Room reducer', () => {
  describe('ADD_ROOM', () => {
    it('should assign a room', () => {
      let newState = roomReducer({},
        {
          type: constants.ADD_ROOM,
          key: 1,
          room: {
            title: 'Test Room',
          },
        })
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
        },
      })
    })
    it('should update a room rather than creating a new one', () => {
      let newState = roomReducer(
        {
          1: {title: 'Test Room 1'},
        },
        {
          type: constants.ADD_ROOM,
          key: 1,
          room: {
            title: 'Test Room 2',
          },
        }
      )
      expect(newState).toEqual({
        1: {
          title: 'Test Room 2',
        },
      })
    })
  })
  describe('SET_ROOM_NT_COUNT', () => {
    it('should set the room nametag count', () => {
      let newState = roomReducer(
        {
          1: { title: 'Test Room'},
        },
        {
          type: constants.SET_ROOM_NT_COUNT,
          roomId: 1,
          nametagCount: 3,
        })
      expect(newState).toEqual(
        {
          1: {
            title: 'Test Room',
            nametagCount: 3,
          },
        })
    })
  })
})
