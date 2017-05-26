jest.mock('../../../../node_modules/rethinkdb')
jest.mock('uuid')
jest.dontMock('../Users')
jest.mock('../../../db')

const mockRdb = require('../../../../../tests/mockRdb')
const UserModel = require('../Users')
jest.mock('../../../db').returnValue({
  db: 'stuff'
})

const makeCursor = objects => ({
  toArray: () => objects
})

describe('User loader', () => {
  let Users
  beforeEach(() => {
    Users = UserModel({conn: 'mockConnection'})
  })
  describe(('findOrCreateFromAuth', () => {
    // Mocks not working as advertised, timeboxing for now
    xit('should return a user if one already exists', () => {
      let calls = []
      let mockProfile = {
        displayName: 'Stampisaur',
        photos: [{value: 'http://profile.photo.com'}],
        id: '12345'
      }
      // r.mockReturnValueOnce(mockRdb(makeCursor([{id: '456', displayNames: ['Stampi']}]), calls)())
      return Users.findOrCreateFromAuth(mockProfile, 'facebook')
        .then(user => {
          expect(user.displayNames[0]).toEqual('Stampi')
        })
    })

    it('should create a user if one does not exist', () => {

    })
  }))
})
