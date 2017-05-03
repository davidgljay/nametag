module.exports = ({token}) => ({
  subject: 'Nametag Password Reset',
  txt:
    `We received a request to reset your password, click here to reset your password:\n
    \n
    https://nametag.chat/passwordreset/${token}\n
    \n
    If you did not request this change, you can ignore this email.\n`,
  html:
    `<p>We received a request to reset your password. If you did not request this change, you can ignore this email.<br />
    If you did, <a href="https://nametag.chat/passwordreset/${token}">please click here to reset password</a> or copy and past the following link into a browser:</p>
    <p>https://nametag.chat/passwordreset/${token}</p>`
})
