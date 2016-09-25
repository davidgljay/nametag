jest.unmock('../UserNametagActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import * as actions from '../UserNametagActions'
import constants from '../../constants'
import {mockHz} from '../../tests/mockGlobals'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('UserNametagActions', () => {
  let store
  let calls
  beforeEach(() => {
    store = mockStore({})
    calls = []
    hz.mockClear()
  })

  describe('addUserNametagCert', () => {
    it('should add a certificate to the user nametag for this room', () => {
      expect(actions.addUserNametagCert({name: 'Test Certificate', id: '123' }, 'abc'))
        .toEqual({
          type: constants.ADD_USER_NT_CERT,
          cert: {name: 'Test Certificate', id: '123' },
          room: 'abc',
        })
    })
  })

  describe('removeUserNametagCert', () => {
    it('should remove a certificate from the user nametag for this room', () => {
      expect(actions.removeUserNametagCert('123', 'abc'))
        .toEqual({
          type: constants.REMOVE_USER_NT_CERT,
          certId: '123',
          room: 'abc',
        })
    })
  })

  describe('updateUserNametag', () => {
    it('should update the user nametag', () => {
      expect(actions.updateUserNametag('abc', 'name', 'Allosaur'))
        .toEqual({
          type: constants.UPDATE_USER_NAMETAG,
          room: 'abc',
          property: 'name',
          value: 'Allosaur',
        })
    })
  })

  describe('getUserNametag', () => {
    it('should get an entry for a room in the user_nametags table', () => {
      hz.mockReturnValue(mockHz([{user: 'me', nametag: '456', room: 'abc'}], calls)())
      return actions.getUserNametag('abc', 'me')(store.dispatch).then((userNametag) => {
        expect(userNametag).toEqual('456')
        expect(calls[1]).toEqual({
          type: 'findAll',
          req: {
            user: 'me',
          },
        })
        expect(store.getActions[0]).toEqual({
          type: constants.UPDATE_USER_NAMETAG,
          room: 'abc',
          property: 'id',
          value: '456',
        })
        expect(store.getActions[1]).toEqual({
          type: constants.UPDATE_USER_NAMETAG,
          room: 'abc',
          property: 'room',
          value: 'abc',
        })
      })
    })

    it('should set the nametag value for the room to null if no user nametag is found', () => {
      hz.mockReturnValue(mockHz([], calls)())
      return actions.getUserNametag('def', 'me')(store.dispatch).then((userNametag) => {
        expect(userNametag).toEqual(null)
      })
    })
  })

  describe('putUserNametag', () => {
    it('should add an entry to the user_nametags table', () => {
      hz.mockReturnValue(mockHz({id: '123'}, calls)())
      return actions.putUserNametag('abc', 'me', '456')().then((id) => {
        expect(id).toEqual({id: '123'})
        expect(calls[1]).toEqual({
          type: 'insert',
          req: {
            user: 'me',
            nametag: '456',
            room: 'abc',
          },
        })
      })
    })
  })
})
