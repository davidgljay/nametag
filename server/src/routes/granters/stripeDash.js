const config = require('../../secrets.json')
const stripe = require('stripe')(config.stripe.client_secret)
const {ErrNotAuthorized} = require('../../errors')

module.exports = ({models: {Granters}}, granterCode, user) =>
  Granters.getByUrlCode(granterCode)
  .then((granter) =>
    user.badges[granter.adminTemplate] && granter.stripe
    ? stripe.accounts.createLoginLink(granter.stripe)
    : Promise.reject(ErrNotAuthorized)
  )
