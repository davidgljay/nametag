const fetch = require('node-fetch')
const {STRIPE_TOKEN_URL} = require('../../constants')
const {APIError} = require('../../errors')
const config = require('../../secrets.json')

module.exports = ({models:{Granters}}, granter, code) =>
  fetch(STRIPE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        client_secret: config.stripe.client_secret,
        code,
        grant_type: 'authorization_code'
      })
    })
    .then(res => res.json())
    .then(data => !data.error
       ? Granters.addStripe(granter, data.stripe_user_id)
       : new APIError(data.error_description)
    )
