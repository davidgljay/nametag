jest.unmock('../UserActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import constants from '../../constants'
import {hz, hzAuth, getAuth, unAuth} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import {mockHz} from '../../tests/mockGlobals'
import thunk from 'redux-thunk'
import * as actions from '../UserActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('User Actions', () => {
  let store
  beforeEach(() => {
    store = mockStore({})
  })
  describe('addUser', () => {
    it('should add a user', () => {
      expect(actions.addUser( '123', {data: 'stuff'}))
        .toEqual({
          type: constants.ADD_USER,
          data: {data: 'stuff'},
          id: '123',
        })
    })
  })

  describe('getUser', () => {
    it('should return info if a user is logged in', (done) => {
      getAuth.mockReturnValue(
        new Promise((resolve) =>
          resolve({id: 1, data: {stuff: 'things'}})
          )
        )

      actions.getUser()(store.dispatch, store.getState).then(
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

      actions.getUser()(store.dispatch, store.getState).then(
        () => {
          expect(store.getActions().length).toEqual(0)
          done()
        })
    })
  })

  describe('providerAuth', () => {
    it('should call hzAuth with the provider', () => {
      actions.providerAuth('facebook')()
      expect(hzAuth.mock.calls[0][0]).toEqual('facebook')
    })
  })

  describe('logout', () => {
    it('should clear localStorage tokens and dispatch a logout action', () => {
      actions.logout()(store.dispatch, store.getState)
      expect(unAuth.mock.calls.length).toEqual(1)
      expect(store.getActions()[0]).toEqual({
        type: constants.LOGOUT_USER,
      })
    })
  })

  describe('addUserNametag', () => {
    it('should add an entry to the user_nametags table', (done) => {
      let calls = []
      hz.mockReturnValue(mockHz({id: '123'}, calls)())
      actions.addUserNametag('abc', 'me', '456')().then((id) => {
        expect(id).toEqual({id: '123'})
        expect(calls[1]).toEqual({
          type: 'insert',
          req: {
            user: 'me',
            nametag: '456',
            room: 'abc',
          },
        })
        done()
      })
    })
  })

  describe('getUserNametag', () => {
    it('should get an entry for a room in the user_nametags table', (done) => {
      let calls = []
      hz.mockReturnValue(mockHz([{user: 'me', nametag: '456', room: 'abc'}], calls)())
      actions.getUserNametag('abc', 'me')(store.dispatch).then((user_nametag) => {
        expect(user_nametag).toEqual({user: 'me', nametag: '456', room: 'abc'})
        expect(calls[1]).toEqual({
          type: 'findAll',
          req: {
            room: 'abc',
          },
        })
        expect(store.getActions()[0]).toEqual({
          type: 'ADD_USER_NAMETAG',
          room: 'abc',
          nametag: '456',
        })
        done()
      })
    })

    it('should return an error if no user nametag is found', (done) => {
      let calls = []
      hz.mockReturnValue(mockHz([], calls)())
      actions.getUserNametag('def', 'me')(store.dispatch).then(() => {
        expect('Should not succeed').toBeFalsy()
        done()
      },
      (err)  => {
        expect(err).toBeTruthy()
        done()
      })
    })
  })
})

