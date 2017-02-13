import userReducer from '../UserReducer'
import constants from '../../constants'

jest.unmock('../UserReducer')

describe('User reducer', () => {
  describe('ADD_USER', () => {
    it('should add user info', () => {
      let newState = userReducer({},
        {
          type: constants.ADD_USER,
          id: 1,
          data: {
            stuff: 'things'
          }
        })
      expect(newState).toEqual({
        id: 1,
        data: {stuff: 'things'}
      })
    })
  })

  describe('LOGOUT_USER', () => {
    it('should set the user state to false', () => {
      let newState = userReducer({
        id: '123'
      }, {
        type: constants.LOGOUT_USER
      })
      expect(newState).toEqual({loggedIn: false})
    })
  })

  describe('USER_SETTING', () => {
    it('should set a generic user setting', () => {
      let newState = userReducer({}, {
        type: constants.USER_SETTING,
        option: 'stuff',
        value: 'things'
      })
      expect(newState).toEqual({stuff: 'things'})
    })
  })

  describe('APPEND_USER_ARRAY', () => {
    it('should update an array in the user data object', () => {
      let newState = userReducer({
        id: '123',
        data: {
          stuff: ['morestuff']
        }
      }, {
        type: constants.APPEND_USER_ARRAY,
        property: 'stuff',
        value: 'things'
      })
      expect(newState.data).toEqual({stuff: ['morestuff', 'things']})
    })
  })
})
