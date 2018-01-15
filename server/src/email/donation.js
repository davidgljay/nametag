module.exports = ({roomId, roomTitle, donorName, donorImage, donorEmail, amount}) => ({
  subject: `${donorName} has donated in ${roomTitle}`,
  txt: `${donorName} has donated $${amount}!
  \n
  Their e-mail is: ${donorEmail}\n
  \n
  Drop in to say thanks:\n
  \n
      https://nametag.chat/rooms/${roomId}\n
  \n\n`,
  html: `<table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>
    <td style="text-align: center;">
    ${donorImage ? `<div style="width: 50px; height: 50px; border-radius: 25px; background: url(${donorImage})   center center / cover no-repeat;"/>` : ''}
    <h2>${donorName} has donated $${amount}!</h2></td>
</tr>
<tr>
    <td style="padding: 10px; margin: 5px; border: 2px #a8a8a8 solid; min-width: 250px; border-radius: 3px;">
        <div>Their e-mail is: ${donorEmail}</div>
    </td>
    </tr>
    <tr>
    <td style="text-align: center">
        <a href="https://nametag.chat/rooms/${roomId}" target='_blank' style="text-decoration: none;">
            <div style="margin-top: 10px; margin-left: auto; margin-right: auto; padding: 10px; font-size: 20px; background: #12726a; color: #FFF; border-radius: 3px; text-decoration: none !important; max-width: 150px; text-align: center;">
                Say Thanks
            </div>
        </a>
  </td>
</tr>`
})
