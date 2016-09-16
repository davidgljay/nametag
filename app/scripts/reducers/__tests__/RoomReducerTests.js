import roomReducer from '../RoomReducer'
import constants from '../../constants'

jest.unmock('../RoomReducer')

describe('Room reducer', () => {
  describe('ADD_ROOM', () => {
    let state
    let action
    beforeEach(() => {
      state = {}
      action = {
        type: constants.ADD_ROOM,
        id: 1,
        room: {
          title: 'Test Room',
        },
      }
    })

    it('should not transform state', () => {
      roomReducer(state, action)
      expect(state).toEqual({})
    })

    it('should assign a room', () => {
      let newState = roomReducer(state, action)
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
        },
      })
    })

    it('should update a room rather than creating a new one', () => {
      state = {
        1: {title: 'Update Me'},
      }
      let newState = roomReducer(state, action)
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
        },
      })
    })

    it('should preserve existing props if they are not overwritten', () => {
      state = {
        1: {tags: ['dinosaurs']},
      }
      let newState = roomReducer(state, action)
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
          tags: ['dinosaurs'],
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
          room: 1,
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

  describe('SET_ROOM_PROP', () => {
    let state
    let action
    beforeEach(() => {
      state = {
        1: {
          title: 'Test Room',
        },
      }
      action = {
        type: constants.SET_ROOM_PROP,
        room: 1,
        property: 'creator',
        value: 'Dinosaur',
      }
    })

    it('should not transform state', () => {
      roomReducer(state, action)
      expect(state).toEqual({
        1: {
          title: 'Test Room',
        },
      })
    })

    it('should add an arbitrary value to a room', () => {
      let newState = roomReducer(state, action)
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
          creator: 'Dinosaur',
        },
      })
    })
  })

  describe('ADD_ROOM_MESSAGE', () => {
    let state
    let action
    beforeEach(() => {
      state = {
        1: {
          title: 'Test Room',
          messages: ['123'],
        },
      }
      action = {
        type: constants.ADD_ROOM_MESSAGE,
        room: 1,
        messageId: '456',
      }
    })

    it('should not transform state', () => {
      roomReducer(state, action)
      expect(state).toEqual({
        1: {
          title: 'Test Room',
          messages: ['123'],
        },
      })
    })

    it('should add an id to room.messages', () => {
      let newState = roomReducer(state, action)
      expect(newState[1].messages).toEqual(
        ['123', '456']
        )
    })
  })
})
