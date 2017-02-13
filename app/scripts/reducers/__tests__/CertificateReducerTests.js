import certificateReducer from '../CertificateReducer'
import constants from '../../constants'

jest.unmock('../CertificateReducer')

describe('Certificate reducer', () => {
  describe('ADD_CERTIFICATE', () => {
    it('should add a certificate to state', () => {
      let newState = certificateReducer({},
        {
          type: constants.ADD_CERTIFICATE,
          id: 1,
          certificate: {
            cert: 'Test certificate'
          }
        })
      expect(newState).toEqual({
        1: {
          cert: 'Test certificate'
        }
      })
    })
  })

  describe('UPDATE_CERTIFICATE', () => {
    it('should update a certificate', () => {
      let newState = certificateReducer(
        {
          1: {
            granted: false
          }
        },
        {
          type: constants.UPDATE_CERTIFICATE,
          id: 1,
          property: 'granted',
          value: true
        })
      expect(newState).toEqual({
        1: {
          granted: true
        }
      })
    })
  })
})
