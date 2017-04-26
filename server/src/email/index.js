const helper = require('sendgrid').mail
const templates = require('./templates')
const {sendgrid} = require('../secrets.json')
const sg = require('sendgrid')(sendgrid.key)

module.exports = ({to, from, template, params}) => {
  const {subject, txt, html} = templates[template](params)

  const mail = {
    body: {
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
       email: from
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
  }

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })

  sg.API(request)
    .then((error, response) => {
    if (error) {
      console.log('Error response received')
    }
    console.log(response.statusCode)
    console.log(response.body)
    console.log(response.headers)
  })
}
