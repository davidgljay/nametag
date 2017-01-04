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

export const updateCertificate = (id, property, value) => {
  return {
    type: constants.UPDATE_CERTIFICATE,
    id,
    property,
    value,
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
*    granted: Optional, denotes whether the certificate has been granted
*
* @returns
*    Promise resolving to the newly created certificate
*/
export function createCertificate(creator, description_array, granter, icon_array, name, notes, granted) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('certificates').insert({creator, description_array, granter, icon_array, name, notes, granted})
        .subscribe((cert) => {
          dispatch(addCertificate(cert, cert.id))
          resolve(cert)
        }, reject)
    })
  }
}

/*
* Marks a certificate as granted
*
* Note: This is faking an action which will later be handled with cryptography,
* certificates should not be mutable!
*
* @params
*    id: The id of the certificate being granted.
*
* @returns
*    Promise resolving to the response from the certificate creation process.
*/

export function grantCertificate(id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('certificates').update({id, granted: true}).subscribe((result) => {
        dispatch(updateCertificate(id, 'granted', true))
        resolve(result)
      }, reject)
    })
  }
}
