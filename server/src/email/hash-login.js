module.exports = ({loginHash, path}) => ({
  subject: `Log In to Nametag`,
  txt: `Here is your link to log in to Nametag:\n
  \n
      https://nametag.chat/login/${loginHash}${path ? `?path=${encodeURIComponent(path)}` : ''}\n
  \n\n`,
  html: `<table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>
    <td style="text-align: center;"><h2>Here is your link to log in to Nametag:</h2></td>
</tr>
<tr>
    <td style="text-align: center">
        <a href="https://nametag.chat/login/${loginHash}${path ? `?path=${encodeURIComponent(path)}` : ''}" target='_blank' style="text-decoration: none;" >
            <div style="margin-top: 10px; margin-left: auto; margin-right: auto; padding: 10px; font-size: 20px; background: #12726a; color: #FFF; border-radius: 3px; max-width: 150px; text-align: center;">
                Log In
            </div>
        </a>
  </td>
</tr>`
})
