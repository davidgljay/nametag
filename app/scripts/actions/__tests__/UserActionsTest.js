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
  let calls
  beforeEach(() => {
    store = mockStore({})
    calls = []
    hz.mockClear()
  })
  describe('addUser', () => {
    it('should add a user', () => {
      expect(actions.addUser('123', {data: 'stuff'}))
        .toEqual({
          type: constants.ADD_USER,
          data: {data: 'stuff'},
          id: '123'
        })
    })
  })

  describe('getUser', () => {
    it('should return info if a user is logged in', () => {
      getAuth.mockReturnValue(
        new Promise((resolve) =>
          resolve({id: 1, data: {stuff: 'things'}})
          )
        )

      return actions.getUser()(store.dispatch, store.getState).then(
        () => {
          expect(store.getActions()[0]).toEqual(
            {
              type: constants.ADD_USER,
              data: {stuff: 'things'},
              id: 1
            })
        })
    })

    it('should take no action if user is not logged in', () => {
      getAuth.mockReturnValue(
          Promise.resolve(false)
        )

      return actions.getUser()(store.dispatch, store.getState).then(
        () => {
          expect(store.getActions().length).toEqual(0)
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
        type: constants.LOGOUT_USER
      })
    })
  })

  describe('appendUserArray', () => {
    it('should append to an array that already exists', () => {
      const mockResponses = [{
        data: {
          stuff: ['things']
        }
      }, {
        updated: 1
      }]
      let calls2 = []
      hz.currentUser = () => hz()
      hz.mockReturnValueOnce(mockHz(mockResponses[0], calls)())
      hz.mockReturnValueOnce(mockHz(mockResponses[1], calls2)())

      return actions.appendUserArray('stuff', 'morethings')(store.dispatch)
        .then((res) => {
          expect(res.updated).toEqual(1)
          expect(store.getActions()[0]).toEqual({
            type: constants.APPEND_USER_ARRAY,
            property: 'stuff',
            value: 'morethings'
          })
          expect(calls[1].type).toEqual('fetch')
          expect(calls2[1].type).toEqual('update')
          expect(calls2[1].req).toEqual({
            data: {
              stuff: ['things', 'morethings']
            }
          })
        })
    })
  })
})
