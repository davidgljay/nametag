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
            name: 'Test Nametag'
          }
        })
      expect(newState).toEqual({
        1: {
          name: 'Test Nametag'
        }
      })
    })
  })

  describe('ADD_NAMETAG_ARRAY', () => {
    it('should assign am array of nametags', () => {
      let newState = nametagReducer({},
        {
          type: constants.ADD_NAMETAG_ARRAY,
          nametags: [
            {
              id: 1,
              name: 'Test Nametag'
            },
            {
              id: 2,
              name: 'Another Test Nametag'
            }
          ]
        })
      expect(newState).toEqual({
        1: {
          id: 1,
          name: 'Test Nametag'
        },
        2: {
          id: 2,
          name: 'Another Test Nametag'
        }
      })
    })
  })
})
