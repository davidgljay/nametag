import roomReducer from '../RoomReducer'
import constants from '../../constants'

jest.unmock('../RoomReducer')

describe('Room reducer', () => {
  describe('ADD_ROOM', () => {
    it('should assign a room', () => {
      let newState = roomReducer({},
        {
          type: constants.ADD_ROOM,
          id: 1,
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
          id: 1,
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
        roomId: 1,
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
        roomId: 1,
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
        roomId: 1,
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
          roomId: 1,
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
          roomId: 1,
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

  describe('UPDATE_USER_NAMETAG', () => {
    it('should add an arbitrary value to a user nametag', () => {
      let newState = roomReducer({
        1: {
          title: 'Test Room',
        },
      },
        {
          type: constants.UPDATE_USER_NAMETAG,
          roomId: 1,
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
          roomId: 1,
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
})
