module.exports = ({email, name, organization, note}) => ({
  subject: `${name} from ${organization} has reached out through the contact form`,
  txt: `${name} from ${organization}:\n
  \n
      ${email}
  \n
      ${note}
  \n\n`,
  html: `<table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>
    <td style="text-align: center;">
    <h2>${name} from ${organization} has reached out through the contact form:</h2></td>
</tr>
<tr>
    <td style="padding: 10px; margin: 5px; border: 2px #a8a8a8 solid; min-width: 250px; border-radius: 3px;">
        <div>E-mail: ${email}</div>
        <div>${note}</div>
    </td>
    </tr>
</table>`
})
