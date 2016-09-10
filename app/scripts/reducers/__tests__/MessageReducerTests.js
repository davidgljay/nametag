import MessageReducer from '../MessageReducer'
import constants from '../../constants'

jest.unmock('../MessageReducer')

describe('Message reducer', () => {
  describe('ADD_MESSAGE', () => {
    it('should add a message', () => {
      let newState = MessageReducer({},
        {
          type: constants.ADD_MESSAGE,
          id: 1,
          message: {
            msg: 'Test Message',
          },
        })
      expect(newState).toEqual({
        1: {
          msg: 'Test Message',
        },
      })
    })
  })
})
