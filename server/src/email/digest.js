module.exports = ({rooms, loginHash}) => {
  let html = `<table style="padding: 20px; margin-left: auto; margin-right: auto;">
    <tr><td>
      <a href="https://nametag.chat">
        <img src="https://s3.amazonaws.com/nametag_images/nametagLogoBlack55.png">
      </a>
    </td></tr>
  <tr>
    <td style="text-align: center;"><h3>Your conversations on Nametag:</h3></td>
  </tr>
  <tr>`

  for (var i = 0; i < rooms.length; i++) {
    let room = rooms[i]
    html += `<tr>
<td style="padding: 10px; border: 1px #a8a8a8 solid; width:100%; min-width: 250px; max-width: 500px; border-radius: 4px; box-shadow: 2px 2px 6px #888888;">
      <a href="https://nametag.chat/rooms/${room.id}" target='_blank' style="text-decoration: none; color: #000;">
      <table style="width: 100%; padding-bottom: 20px;">
        <tr style="vertical-align: top;">
          <td style="width: 70%;">
            <img style="width: 60px; height: 60px; border-radius: 30px; display: inline-block;" src='${room.mod.image}'/>
            <div style="font-weight: bold; font-size: 18px;">${room.title}</div>
          </td>
          <td style="text-align: right;">
            <div style="color: #12726a; display: inline-block; font-size: 18px;">${room.newMessages}</div>
            <img style="display: inline-block;" src='http://s3.amazonaws.com/nametag_images/site/messageicon.png'/>
          </td>
          <td style="text-align: right;">
            <div style="color: #12726a; display: inline-block; font-size: 18px;">${room.newNametags}</div>
            <img style="display: inline-block;" src='http://s3.amazonaws.com/nametag_images/site/usericon.png'/>
          </td>
        </tr>
      </table>
        <div>"${room.latestMessage}"</div>
      </a>
    </td>
    </tr>
    <tr style="height: 20px;"><td/></tr>`
  }

  html += `</table>

    <div style='text-align:center; font-size: 10px; margin-top: 40px;'>
        <a style='color: grey; text-decoration: none;' href="https://nametag.chat/unsubscribe/${loginHash}?roomid=digest&roomname=${encodeURIComponent('Nametag Updates')}">Unsubscribe</a>
    </div>`

  return {
    subject: `Updates in ${rooms[0].title}`,
    html
  }
}
