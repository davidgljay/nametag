jest.unmock('../RoomActions')

jest.unmock('redux-mock-store')
jest.unmock('redux-thunk')

// import * as actions from '../RoomActions'
// import constants from '../../constants'
// import configureStore from 'redux-mock-store'
// import thunk from 'redux-thunk'

// const middlewares = [thunk]
// const mockStore = configureStore(middlewares)

describe('RoomActions', () => {
  beforeEach(() => {
  })

  describe('setImageFromUrl', () => {
    it('should post a url and retrieve an image from that url')
  })
  describe('searchImage', () => {
    it('should perform a search and return a set of images')
  })
})
