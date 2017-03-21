const {GCM_NOTIF_URL} = require('./constants')
const fetch = require('node-fetch')
const config = require('./secrets.json')

module.exports = (data, token) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${config.fcm.key}`
    },
    body: JSON.stringify({
      data,
      to: token
    })
  }

  if (!token) {
    return Promise.reject(new Error('Cannot send message, user does not have a fcm token'))
  }

  return fetch(GCM_NOTIF_URL, options)
    .then((res) => {
      return res.ok ? res.json()
        : Promise.reject(res.statusCode)
    })
    .catch(err => console.log('Error posting notification', err))
}
