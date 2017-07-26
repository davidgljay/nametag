const templates = require('./templates')
const {sendgrid} = require('../secrets.json')
const {APIError} = require('../errors')
const sg = require('sendgrid')(sendgrid.key)

module.exports = ({to, from, template, params}) => {
  const {subject, txt, html} = templates[template](params)

  const mail = {
    personalizations: [
      {
        to: [
          {
            email: to
          }
        ],
        subject
      }
    ],
    from: {
      name: from.name,
      email: from.email
    },
    content: [
      {
        type: 'text/plain',
        value: txt
      },
      {
        type: 'text/html',
        value: html
      }
    ]
  }

  if (!sendgrid.key) {
    console.log(`No sendgrid API key set. Skipping sending email to ${to}: ${JSON.stringify(mail)}`)
    return Promise.resolve()
  }

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail
  })

  return sg.API(request)
    .catch(err => {
      const errors = err.response.body.errors.reduce((text, err) =>
        text.concat(` ${err.message}`), '')
      return Promise.reject(new APIError(errors))
    })
}
