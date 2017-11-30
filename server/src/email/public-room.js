module.exports = ({roomId, roomTitle, modImage, modName, modBio}) => ({
  subject: `New Public Room: ${roomTitle}`,
  txt: `A public room has been submitted for approval:\n
  \n
      ${modName}\n
      ${roomTitle}\n
      ${modBio}\n
  \n
  Click here to reply:\n
  \n
      https://nametag.chat/rooms/${roomId}/approve\n
  \n\n`,
  html: `
  <table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>
    <td style="text-align: center;"><h3>A public room has been submitted for approval</h3></td>

</tr>
<tr>
  <td>
    <img src="${modImage}"/>
    <h3>${modName}</h3>
  </td>
</tr>
<tr>
  <td>
    <h1>${roomTitle}</h1>
    <div>"${modBio}"</div>
  </td>
</tr>
<tr>
  <td style="text-align: center">
      <a href="https://nametag.chat/rooms/${roomId}/approve" target='_blank' style="text-decoration: none;">
          <div style="margin-top: 10px; margin-left: auto; margin-right: auto; padding: 10px; font-size: 20px; background: #12726a; color: #FFF; border-radius: 3px; max-width: 150px; text-align: center; text-decoration: none !important;">
              Approve
          </div>
      </a>
  </td>
</tr>`
})
