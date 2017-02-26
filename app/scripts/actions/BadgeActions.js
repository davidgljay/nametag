import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'

export const addBadgeArray = (badges) => ({
  type: constants.ADD_BADGE_ARRAY,
  badges
})

export const updateBadge = (id, property, value) => ({
  type: constants.UPDATE_BADGE,
  id,
  property,
  value
})

/*
* Fetches to a badges
*
* @params
*    none
*
* @returns
*    Promise resolving to certificate
*/
export function fetchBadges (badgeIds) {
  return function (dispatch) {
    if (!badgeIds || badgeIds.length === 0) {
      return
    }
    const badgeSearch = badgeIds.map(id => ({id}))
    return new Promise((resolve, reject) => {
      hz('badges')
        .findAll(...badgeSearch).fetch().subscribe(
          (badges) => {
            if (badges) {
              dispatch(addBadgeArray(badges))
              resolve(badges)
            } else {
              reject('Badge not found')
            }
          },
          (err) => {
            reject(err)
          })
    })
    .catch(errorLog('Error subscribing to certificate ' + badgeIds + ': '))
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
export function createBadge (
  creator,
  descriptionArray,
  granter,
  iconArray,
  name,
  notes,
  granted) {
  return (dispatch) => {
    const badge = {
      creator,
      description_array: descriptionArray,
      granter,
      icon_array: iconArray,
      name,
      notes,
      granted
    }
    return new Promise((resolve, reject) => {
      hz('badges').insert(badge).subscribe((cert) => {
        dispatch(addBadgeArray([{...badge, id: cert.id}]))
        resolve(cert)
      }, reject)
    })
    .catch(errorLog('Error creating a certificate: '))
  }
}

/*
* Marks a certificate as granted
*
* Note: This is faking an action which will later be handled with cryptography,
* badges should not be mutable!
*
* @params
*    id: The id of the certificate being granted.
*
* @returns
*    Promise resolving to the response from the certificate creation process.
*/

export function grantBadge (id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('badges').update({id, granted: true}).subscribe((result) => {
        dispatch(updateBadge(id, 'granted', true))
        resolve(result)
      }, reject)
    })
    .catch(errorLog('Error granting certificate ' + id + ': '))
  }
}
