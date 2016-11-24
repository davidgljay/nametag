const https = require('https')

const onUserUpdate = (conn) => (user) => {
  // Return if user data does not exist or if displayNames are already defined
  if (!user.data || user.data.displayNames) return

  const profile = parseInfo(user.data)
  r.db('nametag').table('users').get(user.id).update({
    data: {
      ...profile,
      ...user.data.auth_data,
      provider,
    },
  }).run(conn)
  .catch((err) => console.error(err))

  // Post img URL to AWS. This should allow the roundtrip on images to be faster,
  // which I want to optimize for.
  const options = {
    method: 'POST',
    headers: {},
    body: JSON.stringify({
      url: profile.iconUrl,
      width: 50,
      height: 50,
    }),
  }

  https.post('AWS_image_url', options, (err) => {
    if (err) {
      console.log(err) //TODO: set up error logging.
    }
  })
}

module.exports = (conn) => {
  r.db('nametag').table('users').changes().run(conn)
    .then((feed) => feed.each(onUserUpdate(conn)))
}

const parseInfo = (userdata) => {
  switch (userdata.provider) {
  case 'facebook':
    return {
      displayNames: [userdata.auth_data.facebook.name],
    }
  case 'google':
    return {
    }
  case 'twitter':
    return
  default:
    return
  }
}
