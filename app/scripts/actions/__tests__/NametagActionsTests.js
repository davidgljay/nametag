jest.unmock('../NametagActions')
jest.unmock('../../tests/mockGlobals')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

import constants from '../../constants'
import {mockHz} from '../../tests/mockGlobals'
import {hz} from '../../api/horizon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../NametagActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Nametag Actions', () => {
  let store
  let calls
  beforeEach(() => {
    store = mockStore({})
    calls = []
  })

  describe('addNametag', () => {
    it('should add a namtag', () => {
      expect(actions.addNametag({name: 'tag'}, '123', 'abc'))
        .toEqual({
          type: constants.ADD_NAMETAG,
          nametag: {name: 'tag'},
          id: '123'
        })
    })
  })

// Consider renaming to get or fetch, need to define a convention
  describe('watchNametags', () => {
    it('should find to an array of nametags', () => {
      hz.mockReturnValue(mockHz([{id: 1, room: 'abc'}], calls)())
      return actions.watchNametags([1])(store.dispatch).then(
        ([nametag]) => {
          expect(nametag).toEqual({id: 1, room: 'abc'})
          expect(calls[1]).toEqual({type: 'findAll', req: {id: 1}})
          expect(calls[2].type).toEqual('watch')
          expect(store.getActions()[0]).toEqual({
            nametags: [{'id': 1, 'room': 'abc'}],
            type: 'ADD_NAMETAG_ARRAY'
          })
        })
    })
  })

  describe('watchRoomNametags', () => {
    it('should fetch a list of nametags from a room', () => {
      let results = [
        {name: 'tag', room: 'abc', id: '123'},
        {name: 'tag2', room: 'abc', id: '456'}
      ]
      hz.mockReturnValue(mockHz(results, calls)())
      return actions.watchRoomNametags('abc')(store.dispatch).then(
        () => {
          expect(calls[1]).toEqual({type: 'findAll', req: {room: 'abc'}})
          expect(calls[2]).toEqual({type: 'watch', req: undefined})
          expect(store.getActions()[0]).toEqual({
            type: constants.ADD_NAMETAG_ARRAY,
            nametags: results
          })
        })
    })
  })
})

describe('putNametag', () => {
  it('should add an entry to the nametags table', () => {
    let calls = []
    hz.mockReturnValue(mockHz({id: '123'}, calls)())
    return actions.putNametag({name: 'tag'})().then((id) => {
      expect(id).toEqual('123')
      expect(calls[1]).toEqual({
        type: 'upsert',
        req: {
          name: 'tag'
        }
      })
    })
  })
})

describe('showPresence', () => {
  it('should upsert an entry to the nametag_presence table', () => {
    let calls = []
    hz.mockReturnValue(mockHz(201, calls)())
    return actions.showPresence('123')().then(() => {
      expect(calls[1]).toEqual({
        type: 'upsert',
        req: {id: '123', present: calls[1].req.present}
      })
    })
  })
})
