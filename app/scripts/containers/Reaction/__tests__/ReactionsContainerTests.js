jest.unmock('../ReactionsContainer')

import * as functions from '../ReactionsContainer'

describe('ReactionsContainer', () => {
  it('should map state to props appropriately', () => {
    const state = {
      reactions: {
        '1': {
          message: 'a',
          emoji: ':100:',
        },
        '2': {
          message: 'a',
          emoji: ':thumbs_up:',
        },
        '3': {
          message: 'b',
          emoji: ':thumps_up',
        }      
      },
    }
    let props = functions.mapStateToProps(state, {message: 'a'})
    expect(props.reactions).toEqual({
      '1': {
        message: 'a',
        emoji: ':100:',
      },
      '2': {
        message: 'a',
        emoji: ':thumbs_up:',
      },
    })
    expect(props.message).toEqual('a')
  })
})
