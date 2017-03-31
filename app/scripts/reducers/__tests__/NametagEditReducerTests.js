import reducer from '../NametagEditReducer'
import constants from '../../constants'

jest.unmock('../NametagEditReducer')
jest.unmock('lodash')

describe('UPDATE_NAMETAG_EDIT', () => {
  it('should add an arbitrary value to a nametag edit', () => {
    let newState = reducer({
      1: {
        name: 'tag'
      }
    },
      {
        type: constants.UPDATE_NAMETAG_EDIT,
        about: 1,
        property: 'name',
        value: 'Dinosaur'
      })
    expect(newState).toEqual({
      1: {
        name: 'Dinosaur'
      }
    })
  })

  it('should not overwrite other values in a nametag edit', () => {
    let newState = reducer({
      1: {
        name: 'Dinosaur'
      }
    },
      {
        type: constants.UPDATE_NAMETAG_EDIT,
        about: 1,
        property: 'bio',
        value: 'Rwaaarr!!!'
      })
    expect(newState).toEqual({
      1: {
        name: 'Dinosaur',
        bio: 'Rwaaarr!!!'
      }
    })
  })
})

describe('ADD_NT_EDIT_BADGE', () => {
  it('should add a certificate to a nametag for the room', () => {
    let testBadge = {
      name: 'test certificate',
      id: 'wudda'
    }

    let newState = reducer({
      1: {name: 'tag', id: 1}
    }, {
      type: constants.ADD_NT_EDIT_BADGE,
      about: 1,
      badge: testBadge
    })
    expect(newState).toEqual(
      {
        1: {
          name: 'tag',
          id: 1,
          badges: [testBadge]
        }
      })
  })

  it('should add a second certificate', () => {
    let testBadge = {
      name: 'test certificate 2',
      id: 'womps'
    }

    let newState = reducer({
      1: {
        name: 'tag',
        badges: [
          {
            name: 'test certificate',
            id: 'wudda'
          }
        ]
      }
    }, {
      type: constants.ADD_NT_EDIT_BADGE,
      about: 1,
      badge: testBadge
    })

    expect(newState).toEqual({
      1: {
        name: 'tag',
        badges: [
          testBadge,
          {
            name: 'test certificate',
            id: 'wudda'
          }
        ]
      }
    })
  })

  it('should not add a second badge with the same id', () => {
    let testBadge = {
      name: 'test certificate',
      id: 'wudda'
    }

    let newState = reducer({
      1: {
        name: 'tag',
        badges: [testBadge]
      }
    }, {
      type: constants.ADD_NT_EDIT_BADGE,
      about: 1,
      badge: testBadge
    })
    expect(newState).toEqual(
      {
        1: {
          name: 'tag',
          badges: [testBadge]
        }
      })
  })
})

describe('REMOVE_NT_EDIT_BADGE', () => {
  it('should remove a badge from a nametag for the room', () => {

    let newState = reducer({
      1: {
        name: 'tag',
        badges: [{id: 'test123'}, {id: 'badge456'}]
      }
    },
      {
        type: constants.REMOVE_NT_EDIT_BADGE,
        about: 1,
        badgeId: 'test123'
      })
    expect(newState).toEqual(
      {
        1: {
          name: 'tag',
          badges: [{id: 'badge456'}]
        }
      })
  })
  it('should have no effect when no badges are present', () => {
    let newState = reducer({
      1: {
        name: 'tag',
        badges: []
      }
    },
      {
        type: constants.REMOVE_NT_EDIT_BADGE,
        about: 1,
        badgeId: 'wudda'
      })
    expect(newState).toEqual({
      1: {
        name: 'tag',
        badges: []
      }
    })
  })
})
