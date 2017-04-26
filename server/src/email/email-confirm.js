module.exports = ({email, rootUrl, token}) => ({
  subject: 'Nametag E-mail Confirmation'
  txt: `A email confirmation has been requested for the following account:\n
  \n
      ${email}\n
  \n
  To confirm the account, please visit the following link:\n
  \n
      ${rootUrl}/confirm/endpoint#${token}\n
  \n
  If you did not request this, you can safely ignore this email.`,
  html: `<p>A email confirmation has been requested for the following account: <b>${email}</b>.</p>
  <p>To confirm the account, please visit the following link: <a href="${rootURL}/admin/confirm-email#${token}">Confirm Email</a></p>
  <p>If you did not request this, you can safely ignore this email.</p>`
})
