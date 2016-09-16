import roomReducer from '../UserNametagReducer'
import constants from '../../constants'

jest.unmock('../UserNametagReducer')

describe('User Nametag reducer', () => {
  describe('ADD_USER_NT_CERT', () => {
    it('should add a certificate to a nametag for the room', () => {
      let testCert = {
        name: 'test certificate',
        id: 'wudda',
      }

      let newState = roomReducer({
        1: { name: 'tag'},
      }, {
        type: constants.ADD_USER_NT_CERT,
        room: 1,
        cert: testCert,
      })
      expect(newState).toEqual(
        {
          1: {
            name: 'tag',
            certificates: [testCert],
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
          name: 'tag',
          certificates: [
            {
              name: 'test certificate',
              id: 'wudda',
            },
          ],
        },
      }, {
        type: constants.ADD_USER_NT_CERT,
        room: 1,
        cert: testCert,
      })
      expect(newState).toEqual({
        1: {
          name: 'tag',
          certificates: [
            {
              name: 'test certificate',
              id: 'wudda',
            },
            testCert,
          ],
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
          name: 'tag',
          certificates: [testCert],
        },
      }, {
        type: constants.ADD_USER_NT_CERT,
        room: 1,
        cert: testCert,
      })
      expect(newState).toEqual(
        {
          1: {
            name: 'tag',
            certificates: [testCert],
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
          name: 'tag',
          certificates: [testCert],
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
            name: 'tag',
            certificates: [],
          },
        })
    })
    it('should have no effect when no certificates are present', () => {
      let newState = roomReducer({
        1: {
          name: 'tag',
          certificates: [],
        },
      },
        {
          type: constants.REMOVE_USER_NT_CERT,
          room: 1,
          certId: 'wudda',
        })
      expect(newState).toEqual({
        1: {
          name: 'tag',
          certificates: [],
        },
      })
    })
  })

  describe('ADD_USER_NAMETAG', () => {
    it('should add a user nametag to state', () => {
      let newState = roomReducer({
        1: {
          name: 'tag',
        },
      },
        {
          type: constants.ADD_USER_NAMETAG,
          room: 1,
          nametag: {'name': 'Dinosaur'},
        })
      expect(newState).toEqual({
        1: {
          name: 'Dinosaur',
        },
      })
    })
  })

  describe('UPDATE_USER_NAMETAG', () => {
    it('should add an arbitrary value to a user nametag', () => {
      let newState = roomReducer({
        1: {
          name: 'tag',
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
          name: 'Dinosaur',
        },
      })
    })

    it('should not overwrite other values in a user nametag', () => {
      let newState = roomReducer({
        1: {
          name: 'Dinosaur',
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
          name: 'Dinosaur',
          bio: 'Rwaaarr!!!',
        },
      })
    })
  })
})
