import messageReducer from '../MessageReducer'
import constants from '../../constants'

jest.unmock('../MessageReducer')

describe('Message reducer', () => {
  describe('ADD_MESSAGE', () => {
    it('should add a message', () => {
      let newState = messageReducer({},
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
  describe('ADD_MESSAGE_ARRAY', () => {
    it('should assign an array of messages', () => {
      let newState = messageReducer({},
        {
          type: constants.ADD_MESSAGE_ARRAY,
          messages: [
            {
              id: 1,
              name: 'Test Message',
            },
            {
              id: 2,
              name: 'Another Test Message',
            },
          ],
        })
      expect(newState).toEqual({
        1: {
          id: 1,
          name: 'Test Message',
        },
        2: {
          id: 2,
          name: 'Another Test Message',
        },
      })
    })
  })
})
