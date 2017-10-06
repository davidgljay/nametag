module.exports = ({roomId, roomTitle, userToken}) => ({
  subject: `Your Room Has Been Approved: ${roomTitle}`,
  txt: `Your room has been approved!:\n
  \n
      ${roomTitle}\n
  \n
  Drop in and get your conversation started:\n
  \n
      https://nametag.chat/rooms/${roomId}\n
  \n\n`,
  html: `
  <table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>
    <td style="text-align: center;"><h3>Your Room Has Been Approved!</h3></td>

</tr>
<tr>
  <td>
    <h1>${roomTitle}</h1>
  </td>
</tr>
<tr>
  <td style="text-align: center">
      <a href="https://nametag.chat/rooms/${roomId}" target='_blank'>
          <div style="margin-top: 10px; margin-left: auto; margin-right: auto; padding: 10px; font-size: 20px; background: #12726a; color: #FFF; border-radius: 3px; max-width: 150px; text-align: center; text-decoration: none !important;">
              Go To Room
          </div>
      </a>
  </td>
</tr>`
})
