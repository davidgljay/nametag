jest.unmock('../CertificateActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import * as actions from '../CertificateActions'
import constants from '../../constants'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {mockHz} from '../../tests/mockGlobals'

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

  describe('fetchCertificate', () => {
    let store
    let calls
    beforeEach(() => {
      store = mockStore({})
      calls = []
    })

    it('should fetch a certificate', (done) => {
      hz.mockReturnValue(mockHz({name: 'cert', id: 1}, calls)())
      actions.fetchCertificate(1)(store.dispatch, store.getState).then(
        () => {
          expect(store.getActions()[0]).toEqual(
            {
              type: constants.ADD_CERTIFICATE,
              certificate: {name: 'cert', id: 1},
              id: 1,
            })
          done()
        })
    })
  })
})

