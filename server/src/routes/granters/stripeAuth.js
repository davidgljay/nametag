const fetch = require('node-fetch')
const {STRIPE_TOKEN_URL} = require('../../constants')
const {APIError} = require('../../errors')
const config = require('../../secrets.json')

module.exports = ({models:{Granters}}, code, granter) =>
  fetch(STRIPE_TOKEN_URL, {
      method: 'POST',
      body: JSON.stringify({
        client_secret: config.stripe.client_id,
        code,
        grant_type: 'authorization_code'
      })
    })
    .then(res => res.ok ? res.json() : Promise.reject(new APIError('Stripe authentication failed')))
    .then(data => !data.error
       ? Granters.addStripe(granter, data.stripe_user_id)
       : new APIError(data.error_description)
    )
