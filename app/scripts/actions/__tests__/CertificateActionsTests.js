jest.unmock('../BadgeActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import * as actions from '../BadgeActions'
import constants from '../../constants'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {mockHz} from '../../tests/mockGlobals'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Badge Actions', () => {
  let store
  let calls
  beforeEach(() => {
    store = mockStore({})
    calls = []
  })

  describe('addBadge', () => {
    it('should add a certificate', () => {
      expect(actions.addBadge({name: 'cert'}, '123'))
        .toEqual({
          type: constants.ADD_CERTIFICATE,
          certificate: {name: 'cert'},
          id: '123'
        })
    })
  })

  describe('fetchBadge', () => {
    it('should fetch a certificate', (done) => {
      hz.mockReturnValue(mockHz({name: 'cert', id: 1}, calls)())
      actions.fetchBadge(1)(store.dispatch, store.getState).then(
        () => {
          expect(store.getActions()[0]).toEqual(
            {
              type: constants.ADD_CERTIFICATE,
              certificate: {name: 'cert', id: 1},
              id: 1
            })
          done()
        })
    })
  })

  describe('createBadge', () => {
    it('should create a certifiate', () => {
      const cert = {
        creator: 'abc',
        name: 'Is a dinosuar',
        granter: 'Jurassic Park',
        description_array: ['This is a dino, we checked.'],
        icon_array: ['http://dino.img'],
        notes: ['Verified'],
        granted: false
      }
      hz.mockReturnValue(mockHz({...cert, id: '123'}, calls)())
      return actions.createBadge(
        cert.creator,
        cert.description_array,
        cert.granter,
        cert.icon_array,
        cert.name,
        cert.notes,
        cert.granted,
      )(store.dispatch, store.getState)
        .then(
          (c) => {
            expect(c.id).toEqual('123')
            expect(c.creator).toEqual('abc')
            expect(store.getActions()[0]).toEqual(
              {
                type: constants.ADD_CERTIFICATE,
                certificate: c,
                id: '123'
              }
            )
          }
        )
    })
  })

  describe('grantBadge', () => {
    it('should create a certifiate', () => {
      const cert = {
        creator: 'abc',
        name: 'Is a dinosuar',
        granter: 'Jurassic Park',
        description_array: ['This is a dino, we checked.'],
        icon_array: ['http://dino.img'],
        granted: false
      }
      store = mockStore({'123': cert})
      hz.mockReturnValue(mockHz({updated: 1}, calls)())
      return actions.grantBadge('123')(store.dispatch, store.getState)
        .then(
          () => {
            expect(store.getActions()[0]).toEqual(
              {
                type: constants.UPDATE_CERTIFICATE,
                id: '123',
                property: 'granted',
                value: true
              }
            )
            expect(calls[1]).toEqual({
              type: 'update',
              req: { id: '123', granted: true }
            })
          }
        )
    })
  })
})
