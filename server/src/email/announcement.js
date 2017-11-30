module.exports = ({roomId, roomName, message, author, loginHash}) => ({
  subject: `Update in ${roomName}`,
  txt: `${author} has sent out an update about ${roomName}:\n
  \n
      ${message}\n
  \n
  Click here to reply:\n
  \n
      https://nametag.chat/rooms/${roomId}\n
  \n\n
  You can also unsubscribe:\n
  https://nametag.chat/unsubscribe/${loginHash}?roomid=${roomId}&roomname=${encodeURIComponent(roomName)}\n\n`,
  html: `<table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
    </td></tr>
<tr>
    <td style="text-align: center;"><h2>${author} has sent out an update about ${roomName}</h2></td>
</tr>
<tr>
    <td style="padding: 10px; margin: 5px; border: 2px #a8a8a8 solid; min-width: 250px; border-radius: 3px;">
        <div style="font-weight: bold;">${author}</div>
        <div>${message}</div>
    </td>
    </tr>
    <tr>
    <td style="text-align: center">
        <a href="https://nametag.chat/rooms/${roomId}" target='_blank' style="text-decoration: none;">
            <div style="margin-top: 10px; margin-left: auto; margin-right: auto; padding: 10px; font-size: 20px; background: #12726a; color: #FFF; border-radius: 3px; text-decoration: none !important; max-width: 150px; text-align: center;">
                Reply
            </div>
        </a>
  </td>
</tr>

    <div style='text-align:center; font-size: 10px; margin-top: 40px;'>
        <a style='color: grey; text-decoration: none;' href="https://nametag.chat/unsubscribe/${loginHash}?roomid=${roomId}&roomname=${encodeURIComponent(roomName)}">Unsubscribe</a>
    </div>`
})
