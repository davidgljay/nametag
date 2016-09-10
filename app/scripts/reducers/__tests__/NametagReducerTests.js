import nametagReducer from '../NametagReducer'
import constants from '../../constants'

jest.unmock('../NametagReducer')

describe('Nametag reducer', () => {
  describe('ADD_NAMETAG', () => {
    it('should assign a nametag', () => {
      let newState = nametagReducer({},
        {
          type: constants.ADD_NAMETAG,
          id: 1,
          nametag: {
            name: 'Test Nametag',
          },
        })
      expect(newState).toEqual({
        1: {
          name: 'Test Nametag',
        },
      })
    })
  })
})
