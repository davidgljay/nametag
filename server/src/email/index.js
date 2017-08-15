const templates = require('./templates')
const {sparkpost} = require('../secrets.json')
const {APIError} = require('../errors')
const fetch = require('node-fetch')

module.exports = ({to, from, template, params}) => {
  const {subject, txt, html} = templates[template](params)

  const mail = {
    campaign_id: template,
    recipients: [
      {
        address: to
      }
    ],
    content: {
      from: {
        email: from.email,
        name: from.name
      },
      subject,
      html,
      txt
    }
  }

  if (!sparkpost.key || process.env.NODE_ENV === 'test') {
    console.log('No Sparkpost key defined, skipping sending e-mail.');
  }

  return fetch(process.env.SPARKPOST_URL, {
    method: 'POST',
    headers: {
      'Authorization': sparkpost.key,
      'Content-Type': 'application/json'
    },
    body: mail
  }).catch(err => {
    const errors = err.response.body.errors.reduce((text, err) =>
      text.concat(` ${err.message}`), '')
    return Promise.reject(new APIError(errors))
  })
}
