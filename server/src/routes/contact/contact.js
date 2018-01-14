const sendEmail = require('../../email')

module.exports = (params) =>
  sendEmail({
    to: 'david@nametag.chat',
    from: {
      name: params.reason === 'demoRequest' ? 'Nametag Demo Request' : 'Nametag Contact Form',
      email: 'info@nametag.chat'
    },
    template: params.reason,
    params
  })
