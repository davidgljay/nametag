module.exports = ({roomId, roomTitle, nametagName, nametagImage, nametagBio, loginHash}) => ({
  subject: `${nametagName} has just joined "${roomTitle}"`,
  txt: `Someone new has joined your room:\n
  \n
      ${nametagName}\n
      ${nametagBio}\n
  \n
  Click here to welcome them:\n
  \n
      https://nametag.chat/rooms/${roomId}?loginHash=${loginHash}\n
  \n\n
  You can also unsubscribe from these updates:\n
  https://nametag.chat/unsubscribe/${loginHash}?roomid=${roomId}&roomname=${encodeURIComponent(roomTitle)}\n\n`,
  html: `<table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>
    <td style="text-align: center;"><h2>Someone new has joined "${roomTitle}"</h2></td>
</tr>
<tr>
    <td style="padding: 10px; margin: 5px; border: 2px #a8a8a8 solid; min-width: 250px; border-radius: 3px;">
        ${
          nametagImage
          ? `<img style="width: 60px; height: 60px; border-radius: 30px; display: inline-block;" src='${nametagImage}'/>`
          : ''
        }
        <div style="font-weight: bold;">${nametagName}</div>
        <div>${nametagBio}</div>
    </td>
    </tr>
    <tr>
    <td style="text-align: center">
        <a href="https://nametag.chat/rooms/${roomId}?loginHash=${loginHash}" target='_blank' style="text-decoration: none;">
            <div style="margin-top: 10px; margin-left: auto; margin-right: auto; padding: 10px; font-size: 20px; background: #12726a; color: #FFF; border-radius: 3px; text-decoration: none !important; max-width: 150px; text-align: center;">
                Say Hi
            </div>
        </a>
  </td>
</tr>

    <div style='text-align:center; font-size: 10px; margin-top: 40px;'>
        <a style='color: grey; text-decoration: none;' href="https://nametag.chat/unsubscribe/${loginHash}?roomid=${roomId}&roomname=${encodeURIComponent(roomTitle)}">Unsubscribe</a>
    </div>`
})
