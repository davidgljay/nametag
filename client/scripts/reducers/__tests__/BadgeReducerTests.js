import certificateReducer from '../BadgeReducer'
import constants from '../../constants'

jest.unmock('../BadgeReducer')

describe('Badge reducer', () => {
  describe('ADD_BADGE_ARRAY', () => {
    it('should add a certificate to state', () => {
      let newState = certificateReducer({},
        {
          type: constants.ADD_BADGE_ARRAY,
          badges: [{
            name: 'Test certificate',
            id: 1
          }]
        })
      expect(newState).toEqual({
        1: {
          name: 'Test certificate',
          id: 1
        }
      })
    })

    it('should add multiple certificates to state', () => {
      let newState = certificateReducer({
        1: {
          id: 1,
          name: 'A dinosaur'
        }
      },
        {
          type: constants.ADD_BADGE_ARRAY,
          badges: [
            {
              name: 'A whale',
              id: 2
            },
            {
              name: 'A dragon',
              id: 3
            }
          ]
        })
      expect(newState).toEqual({
        1: {
          name: 'A dinosaur',
          id: 1
        },
        2: {
          name: 'A whale',
          id: 2
        },
        3: {
          name: 'A dragon',
          id: 3
        }
      })
    })
  })

  describe('UPDATE_BADGE', () => {
    it('should update a certificate', () => {
      let newState = certificateReducer(
        {
          1: {
            granted: false
          }
        },
        {
          type: constants.UPDATE_BADGE,
          id: 1,
          property: 'granted',
          value: true
        })
      expect(newState).toEqual({
        1: {
          granted: true
        }
      })
    })
  })
})
