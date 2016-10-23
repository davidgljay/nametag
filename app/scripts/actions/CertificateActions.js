import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'

let certificateSubscriptions = {}

export const addCertificate = (certificate, id) => {
  return {
    type: constants.ADD_CERTIFICATE,
    certificate,
    id,
  }
}

/*
* Subscribe to a certificates
*
* @params
*    none
*
* @returns
*    Promise
*/
export function fetchCertificate(certificateId) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      certificateSubscriptions[certificateId] = hz('certificates')
        .find(certificateId).fetch().subscribe(
          (certificate) => {
            if (certificate) {
              resolve(dispatch(addCertificate(certificate, certificateId)))
            } else {
              reject('Certificate not found')
            }
          },
          (err) => {
            reject(err)
          })
    })
    .catch(errorLog('Error subscribing to certificate ' + certificateId + ': '))
  }
}
