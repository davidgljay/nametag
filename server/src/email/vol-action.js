module.exports = ({roomId, roomTitle, volunteerName, volunteerIcon, volunteerEmail, actions}) => ({
  subject: `${volunteerName} has volunteered in ${roomTitle}`,
  txt: `${volunteerName} has volunteered to do the following:\n
  \n
      ${actions.map(a => `${a}\n`)}
  \n
  Their e-mail is: ${volunteerEmail}\n
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
    ${volunteerIcon ? `<div style="width: 50px; height: 50px; border-radius: 25px; background: url(${volunteerIcon})   center center / cover no-repeat;"/>` : ''}
    <h2>${volunteerName} has volunteered to do the following:</h2></td>
</tr>
<tr>
    <td style="padding: 10px; margin: 5px; border: 2px #a8a8a8 solid; min-width: 250px; border-radius: 3px;">
        <div style="font-weight: bold;">${actions.map(a => `${a}\n`)}</div>
        <div>Their e-mail is: ${volunteerEmail}</div>
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
