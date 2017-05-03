module.exports = ({email, token}) => ({
  subject: 'Nametag E-mail Confirmation',
  txt: `A email confirmation has been requested for the following account:\n
  \n
      ${email}\n
  \n
  To confirm the account, please visit the following link:\n
  \n
      https://nametag.chat/emailconfirm/${token}\n
  \n
  If you did not request this, you can safely ignore this email.`,
  html: `<p>A email confirmation has been requested for the following account: <b>${email}</b>.</p>
  <p>To confirm the account, please visit the following link:</p>
  <p>https://nametag.chat/emailconfirm/${token}</p>
  <p>If you did not request this, you can safely ignore this email.</p>`
})
