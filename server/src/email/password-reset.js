module.exports = ({token, rootUrl}) => ({
  subject: 'Nametag Password Reset'
  txt:
    `We received a request to reset your password, click here to reset your password:\n
    \n
    ${rootUrl}/admin/password-reset#${token}\n
    \n
    If you did not request this change, you can ignore this email.\n`,
  html:
    `<p>We received a request to reset your password. If you did not request this change, you can ignore this email.<br />
    If you did, <a href="${rootUrl}/admin/password-reset#${token}">please click here to reset password</a>.</p>`
})
