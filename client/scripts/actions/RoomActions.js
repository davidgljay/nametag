import errorLog from '../utils/errorLog'
import constants from '../constants'
import readAndCompressImage from 'browser-image-resizer'

/*
* Show Replies
* @params
*   messageId
*
* @returns
*   Action to display replies
*/
export function setVisibleReplies (messageId) {
  return {
    type: constants.SET_VISIBLE_REPLIES,
    messageId
  }
}

/*
* Set Badge Grantee
* @params
*   nametagId
*
* @returns
*   Action to set a the recipient of a badge
*/
export function setBadgeGrantee (nametagId) {
  return {
    type: constants.SET_BADGE_GRANTEE,
    nametagId
  }
}

/*
* Set Badge To Grant
* @params
*   nametagId
*
* @returns
*   Action to set a the recipient of a badge
*/
export function setBadgeToGrant (badge) {
  return {
    type: constants.SET_BADGE_TO_GRANT,
    badge
  }
}

/*
* Open Nametag Image Menu
* @params
*   open
*
* @returns
*   Action to set a the recipient of a badge
*/
export function toggleNametagImageMenu (open) {
  return {
    type: constants.TOGGLE_NAMETAG_IMAGE_MENU,
    open
  }
}

/*
* Search Images
* @params
*   searchString
*
* @returns
*   Promise resolving to search string queries
*/
export function searchImage (query, startAt) {
  return () => {
    const start = startAt ? '&start=' + startAt : ''
    const url = 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image_search?query=' + query + start
    return fetch(url)
      .then(res => {
        return res.ok ? res.json()
        : Promise.reject(`Error searching images for ${query}`)
      }).catch(errorLog('Searching for image'))
  }
}

/*
* Sets an image from a url
* @params
*   url - The url of the image to be loaded
*
* @returns
*   Promise resolving to uploaded image
*/
export function setImageFromUrl (width, height, url) {
  return () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({width, height, url})
    }
    return fetch('/api/image_url', options)
      .then(res => {
        return res.ok ? res.json()
          : Promise.reject(`Error setting image from ${url}`)
      }).catch(errorLog('Searching for image'))
  }
}

/*
* Resizes and uploads an image
* @params
*   url - The url of the image to be loaded
*
* @returns
*   Promise resolving to uploaded image
*/
export function uploadImage (width, file) {
  return () => {
    return readAndCompressImage(file, {
      quality: 0.5,
      maxWidth: width * 3,
      maxHeight: width * 3,
      autoRotate: true,
      debug: true
    })
    .then(resizedImage => {
      const url = `/api/images`
      const formData = new FormData() //eslint-disable-line
      formData.append('images', resizedImage)
      const options = {
        method: 'POST',
        body: formData,
        headers: {
          imagewidth: width * 3
        }
      }
      console.log('Posting image after resize')

      return fetch(url, options)
    })
    .then(res => {
      return res.ok ? res.json()
        : Promise.reject(`Error uploading image`)
    }).catch(errorLog('Resizing and uploading image'))
  }
}
