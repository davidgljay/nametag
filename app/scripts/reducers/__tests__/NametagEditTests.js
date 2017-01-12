import reducer from '../NametagEditReducer'
import constants from '../../constants'

jest.unmock('../NametagEditReducer')

describe('UPDATE_NAMETAG_EDIT', () => {
  it('should add an arbitrary value to a nametag edit', () => {
    let newState = reducer({
      1: {
        name: 'tag',
      },
    },
      {
        type: constants.UPDATE_NAMETAG_EDIT,
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

  it('should not overwrite other values in a nametag edit', () => {
    let newState = reducer({
      1: {
        name: 'Dinosaur',
      },
    },
      {
        type: constants.UPDATE_NAMETAG_EDIT,
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
