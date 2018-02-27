module.exports = ({roomId, roomTitle, loginHash}) => ({
  subject: `Tons of people are joining ${roomTitle}`,
  txt: `People are pouring into ${roomTitle}, to keep the conversation small we've splintered off a new room.\n
  \n
  Drop in help get new people situated:\n
  \n
      https://nametag.chat/rooms/${roomId}\n
  \n\n`,
  html: `
  <table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>

</tr>
<tr>
  <td>
    <h1>People are pouring into your room ${roomTitle}</h1>
    <h3>To keep the conversation small we've splintered off a new room.</h3>
  </td>
</tr>
<tr>
  <td style="text-align: center">
      <a href="https://nametag.chat/rooms/${roomId}" target='_blank' style="text-decoration: none;">
          <div style="margin-top: 10px; margin-left: auto; margin-right: auto; padding: 10px; font-size: 20px; background: #12726a; color: #FFF; border-radius: 3px; max-width: 150px; text-align: center; text-decoration: none !important;">
              Check Out The New Room
          </div>
      </a>
  </td>
</tr>`
})
