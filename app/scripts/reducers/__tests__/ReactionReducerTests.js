import ReactionReducer from '../ReactionReducer'
import constants from '../../constants'

jest.unmock('../ReactionReducer')

describe('Rection reducer', () => {
  describe('Reaction', () => {
    it('should add a reaction', () => {
      let newState = ReactionReducer({},
        {
          type: constants.ADD_REACTION,
          reaction: {
            id: 1,
            message: 'MSG',
            room: '456',
          },
        })
      expect(newState).toEqual({
        1: {
          id: 1,
          message: 'MSG',
          room: '456',
        },
      })
    })
  })
})
