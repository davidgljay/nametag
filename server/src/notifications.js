const {GCM_NOTIF_URL} = require('./constants')
const fetch = require('node-fetch')
const config = require('./secrets.json')

/*
* Sends notifications via FCM
*
* @param {Object} data Data to be sent, has the form:
*  reason: Reason the notification is being sent
*  params: Data relevant to the notification
*
* @param {String} token FCM token of the user
*
*/
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
    return Promise.resolve(new Error('Cannot send message, user does not have a fcm token'))
  }

  return fetch(GCM_NOTIF_URL, options)
    .then((res) => res.ok ? res.json()
        : Promise.reject(res.statusText)
    )
    .catch(err => console.log('Error posting notification', err))
}
