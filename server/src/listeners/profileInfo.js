const fetch = require('node-fetch')
const r = require('../../horizon/server/src/horizon.js').r

const onUserUpdate = (conn) => (err, user) => {

  if (err) {
    console.err(err)
    return
  }

  // Return if user data does not exist or if displayNames are already defined
  if (!user.new_val || !user.new_val.data || user.new_val.data.displayNames) return

  const prevData = user.new_val.data

  const userProfile = parseInfo(prevData)
  let newData = {
    displayNames: userProfile.names,
    loadingIcons: true,
  }
  newData.auth_data = prevData.auth_data
  newData.provider = prevData.provider
  r.db('nametag').table('users').get(user.new_val.id).update({
    data: newData,
  }).run(conn)
  .catch((err) => console.error(err))

  /* Post img URL to AWS. This should allow the roundtrip on images to be faster,
  which I want to optimize for. */

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: userProfile.picture,
      width: 50,
      height: 50,
    }),
  }

  fetch('https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image', options)
    .then((res) => {
      return res.ok ? res.json()
        : Promise.reject(res.statusCode)
    })
    .then((json) => {
      console.log("Load Icon Response:", json)
      return json.url && r.db('nametag').table('users').get(user.new_val.id).update({
        data: {
          iconUrls: [ json.url ],
          loadingIcons: false
        },
      }).run(conn)
    })
    .catch(err => console.log('Error updating user icon', err))
}

module.exports = (conn) => {
  r.db('nametag').table('users').changes().run(conn)
    .then((feed) => feed.each(onUserUpdate(conn)))
}

const parseInfo = (userdata) => {
  switch (userdata.provider) {
  case 'facebook':
    return {
      names: [userdata.auth_data.facebook.name],
      picture: userdata.auth_data.facebook.picture.data.url,
    }
  case 'google':
    return {
      names: [userdata.auth_data.google.name],
      picture: userdata.auth_data.google.picture,
    }
  case 'twitter':
    return {
      names: [
        userdata.auth_data.twitter.name,
        userdata.auth_data.twitter.screen_name,
      ],
      picture: userdata.auth_data.twitter.profile_image_url,
    }
  default:
    return {}
  }
}
