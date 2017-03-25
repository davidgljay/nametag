import errorLog from '../utils/errorLog'
// import constants from '../constants'

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
* Upload an image
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
