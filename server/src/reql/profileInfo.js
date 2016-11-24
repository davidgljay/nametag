const https = require('https')

module.exports = (reqlConn) => {
  console.log('In profileInfo', reqlConn);
  // const profile = parseInfo(providerProfile)
  // hz.users.update(providerProfile.id, {
  //   data: {
  //     ...profile,
  //     ...providerProfile,
  //   },
  // })
  //
  // // Post img URL to AWS. This should allow the roundtrip on images to be faster,
  // // which I want to optimize for.
  // const options = {
  //   method: 'POST',
  //   headers: {},
  //   body: JSON.stringify({
  //     url: profile.iconUrl,
  //     width: 50,
  //     height: 50,
  //   }),
  // }
  //
  // https.post('AWS_image_url', options, (err) => {
  //   if (err) {
  //     console.log(err) //TODO: set up error logging.
  //   }
  // })
}

const parseInfo = (providerProfile) => {
  switch (providerProfile.provider) {
  case 'facebook':
    return
  case 'google':
    return
  case 'twitter':
    return
  default:
    return
  }
}
