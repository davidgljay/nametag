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
* Fetches to a certificates
*
* @params
*    none
*
* @returns
*    Promise resolving to certificate
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

/*
* Creates a certificate
*
* @params
*    creator: User id of the person creating this certificate. This violates the
*        no-user-ids principle, and will be replaced with an organization id in the future.
*    decription: A description of the certificate.
*    granter: The name of the granting organization.
*    icon: The (optional) icon for this certificate.
*    name: The name appearing on this certificate.
*    note: An initial note for this certificate
*
* @returns
*    Promise
*/
export function createCertificate(...args) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('certificates').insert({...args}).subscribe((cert) => {
        dispatch(addCertificate(cert, cert.id))
        resolve(cert)
      }, reject)
    })
  }
}
