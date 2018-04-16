module.exports = ({userEmail}) => ({
  subject: `New User`,
  txt: `A new user has joined:\n
  \n
      ${userEmail}\n
  \n\n`,
  html: `
  <table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>
    <td style="text-align: center;"><h3>A user has joined!</h3></td>

</tr>
<tr>
  <td>
    <h3>${userEmail}</h3>
  </td>
</tr>
</table>`
})
