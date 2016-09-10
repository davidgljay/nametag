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
            stuff: 'things',
          },
        })
      expect(newState).toEqual({
        id: 1,
        data: {stuff: 'things'},
      })
    })
  })

  describe('LOGOUT_USER', () => {
    it('should set the user state to false', () => {
      let newState = userReducer({
        id: '123',
      }, {
        type: constants.LOGOUT_USER,
      })
      expect(newState).toEqual(false)
    })
  })

  describe('ADD_USER_NAMETAG', () => {
    it('should add a nametag id to the nametags object', () => {
      let newState = userReducer({
        id: '123',
      }, {
        type: constants.ADD_USER_NAMETAG,
        room: 'abc',
        nametag: 'def',
      })
      expect(newState.nametags).toEqual({abc: 'def'})
    })
  })
})
