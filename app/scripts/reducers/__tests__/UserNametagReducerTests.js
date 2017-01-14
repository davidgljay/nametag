import roomReducer from '../UserNametagReducer'
import constants from '../../constants'

jest.unmock('../UserNametagReducer')

describe('User Nametag reducer', () => {

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
