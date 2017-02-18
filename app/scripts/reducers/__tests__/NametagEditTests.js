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
        room: 1,
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
        room: 1,
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

describe('ADD_NT_EDIT_CERT', () => {
  it('should add a certificate to a nametag for the room', () => {
    let testCert = {
      name: 'test certificate',
      id: 'wudda'
    }

    let newState = reducer({
      1: {name: 'tag', id: 1}
    }, {
      type: constants.ADD_NT_EDIT_CERT,
      room: 1,
      cert: testCert
    })
    expect(newState).toEqual(
      {
        1: {
          name: 'tag',
          id: 1,
          badges: [testCert]
        }
      })
  })

  it('should add a second certificate', () => {
    let testCert = {
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
      type: constants.ADD_NT_EDIT_CERT,
      room: 1,
      cert: testCert
    })

    expect(newState).toEqual({
      1: {
        name: 'tag',
        badges: [
          testCert,
          {
            name: 'test certificate',
            id: 'wudda'
          }
        ]
      }
    })
  })

  it('should not add a second certificate with the same id', () => {
    let testCert = {
      name: 'test certificate',
      id: 'wudda'
    }

    let newState = reducer({
      1: {
        name: 'tag',
        badges: [testCert]
      }
    }, {
      type: constants.ADD_NT_EDIT_CERT,
      room: 1,
      cert: testCert
    })
    expect(newState).toEqual(
      {
        1: {
          name: 'tag',
          badges: [testCert]
        }
      })
  })
})

describe('REMOVE_NT_EDIT_CERT', () => {
  it('should remove a certificate from a nametag for the room', () => {
    let testCert = {
      name: 'test certificate',
      id: 'wudda'
    }

    let newState = reducer({
      1: {
        name: 'tag',
        badges: [testCert]
      }
    },
      {
        type: constants.REMOVE_NT_EDIT_CERT,
        room: 1,
        certId: 'wudda'
      })
    expect(newState).toEqual(
      {
        1: {
          name: 'tag',
          badges: []
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
        type: constants.REMOVE_NT_EDIT_CERT,
        room: 1,
        certId: 'wudda'
      })
    expect(newState).toEqual({
      1: {
        name: 'tag',
        badges: []
      }
    })
  })
})
