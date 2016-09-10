jest.unmock('../CertificateActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import * as actions from '../CertificateActions'
import constants from '../../constants'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Certificate Actions', () => {
  describe('addCertificate', () => {
    it('should add a certificate', () => {
      expect(actions.addCertificate({name: 'cert'}, '123'))
        .toEqual({
          type: constants.ADD_CERTIFICATE,
          certificate: {name: 'cert'},
          id: '123',
        })
    })
  })

  describe('fetch', () => {
    let store
    beforeEach(() => {
      store = mockStore({})
    })

    it('should fetch a certificate', (done) => {
      hz.mockReturnValue({
        find: () => {
          return {
            fetch: () => {
              return {
                subscribe: (subs) => {
                  return subs({
                    name: 'cert',
                  })
                },
              }
            },
          }
        },
      })
      actions.fetch(1)(store.dispatch, store.getState).then(
        () => {
          expect(store.getActions()[0]).toEqual(
            {
              type: constants.ADD_CERTIFICATE,
              certificate: {name: 'cert'},
              id: 1,
            })
          done()
        })
    })
  })
})

