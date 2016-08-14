jest.unmock('../UserActions')
jest.unmock('../../tests/mockGlobals')
// jest.unmock('../../api/horizon')
jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import constants from '../../constants'
import {hzAuth, getAuth} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
let UserActions = require('../UserActions')

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('User Actions', () => {
  describe('addUser', () => {
    it('should add a user', () => {
      expect(UserActions.addUser( '123', {data: 'stuff'}))
        .toEqual({
          type: constants.ADD_USER,
          data: {data: 'stuff'},
          id: '123',
        })
    })
  })

  describe('getUser', () => {
    let store
    beforeEach(() => {
      store = mockStore({})
    })

    it('should return info if a user is logged in', (done) => {
      getAuth.mockReturnValue(
        new Promise((resolve) =>
          resolve({id: 1, data: {stuff: 'things'}})
          )
        )

      UserActions.getUser()(store.dispatch, store.getState).then(
        () => {
          expect(store.getActions()[0]).toEqual(
            {
              type: constants.ADD_USER,
              data: {stuff: 'things'},
              id: 1,
            })
          done()
        })
    })

    it('should take no action if user is not logged in', (done) => {
      getAuth.mockReturnValue(
        new Promise((resolve) =>
          resolve(false)
          )
        )

      UserActions.getUser()(store.dispatch, store.getState).then(
        () => {
          expect(store.getActions().length).toEqual(0)
          done()
        })
    })
  })

  describe('providerAuth', () => {
    it('should call hzAuth with the provider', () => {
      UserActions.providerAuth('facebook')()
      expect(hzAuth.mock.calls[0][0]).toEqual('facebook')
    })
  })
})

