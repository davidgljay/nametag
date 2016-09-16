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

  describe('ADD_USER_NT_CERT', () => {
    it('should add a certificate to a nametag for the room', () => {
      let testCert = {
        name: 'test certificate',
        id: 'wudda',
      }

      let newState = roomReducer({
        1: { title: 'Test Room'},
      }, {
        type: constants.ADD_USER_NT_CERT,
        room: 1,
        cert: testCert,
      })
      expect(newState).toEqual(
        {
          1: {
            title: 'Test Room',
            userNametag: {
              certificates: [testCert],
            },
          },
        })
    })

    it('should add a second certificate', () => {
      let testCert = {
        name: 'test certificate 2',
        id: 'womps',
      }

      let newState = roomReducer({
        1: {
          title: 'Test Room',
          userNametag: {
            certificates: [
              {
                name: 'test certificate',
                id: 'wudda',
              },
            ],
          },
        },
      }, {
        type: constants.ADD_USER_NT_CERT,
        room: 1,
        cert: testCert,
      })
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
          userNametag: {
            certificates: [
              {
                name: 'test certificate',
                id: 'wudda',
              },
              testCert,
            ],
          },
        },
      })
    })
    it('should not add a second certificate with the same id', () => {
      let testCert = {
        name: 'test certificate',
        id: 'wudda',
      }

      let newState = roomReducer({
        1: {
          title: 'Test Room',
          userNametag: {
            certificates: [testCert],
          },
        },
      }, {
        type: constants.ADD_USER_NT_CERT,
        room: 1,
        cert: testCert,
      })
      expect(newState).toEqual(
        {
          1: {
            title: 'Test Room',
            userNametag: {
              certificates: [testCert],
            },
          },
        })
    })
  })

  describe('REMOVE_USER_NT_CERT', () => {
    it('should remove a certificate from a nametag for the room', () => {
      let testCert = {
        name: 'test certificate',
        id: 'wudda',
      }

      let newState = roomReducer({
        1: {
          title: 'Test Room',
          userNametag: {
            certificates: [testCert],
          },
        },
      },
        {
          type: constants.REMOVE_USER_NT_CERT,
          room: 1,
          certId: 'wudda',
        })
      expect(newState).toEqual(
        {
          1: {
            title: 'Test Room',
            userNametag: {
              certificates: [],
            },
          },
        })
    })
    it('should have no effect when no certificates are present', () => {
      let newState = roomReducer({
        1: {
          title: 'Test Room',
          userNametag: {
            certificates: [],
          },
        },
      },
        {
          type: constants.REMOVE_USER_NT_CERT,
          room: 1,
          certId: 'wudda',
        })
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
          userNametag: {
            certificates: [],
          },
        },
      })
    })
  })

  describe('ADD_USER_NAMETAG', () => {
    it('should add a user nametag to state', () => {
      let newState = roomReducer({
        1: {
          title: 'Test Room',
        },
      },
        {
          type: constants.ADD_USER_NAMETAG,
          room: 1,
          nametag: {'name': 'Dinosaur'},
        })
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
          userNametag: {
            name: 'Dinosaur',
          },
        },
      })
    })
  })

  describe('UPDATE_USER_NAMETAG', () => {
    it('should add an arbitrary value to a user nametag', () => {
      let newState = roomReducer({
        1: {
          title: 'Test Room',
        },
      },
        {
          type: constants.UPDATE_USER_NAMETAG,
          room: 1,
          property: 'name',
          value: 'Dinosaur',
        })
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
          userNametag: {
            name: 'Dinosaur',
          },
        },
      })
    })

    it('should not overwrite other values in a user nametag', () => {
      let newState = roomReducer({
        1: {
          title: 'Test Room',
          userNametag: {
            name: 'Dinosaur',
          },
        },
      },
        {
          type: constants.UPDATE_USER_NAMETAG,
          room: 1,
          property: 'bio',
          value: 'Rwaaarr!!!',
        })
      expect(newState).toEqual({
        1: {
          title: 'Test Room',
          userNametag: {
            name: 'Dinosaur',
            bio: 'Rwaaarr!!!',
          },
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
