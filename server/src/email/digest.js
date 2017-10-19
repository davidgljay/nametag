module.exports = ({rooms, token}) => {

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

  for (var i=0; i < rooms.length; i++ ) {
    let room = rooms[i]
    html += `<td style="padding: 10px; border: 1px #000 solid; width:100%; min-width: 250px; max-width: 500px; border-radius: 2px;">
      <a href="https://nametag.chat/rooms/${room.id}" target='_blank' style="text-decoration: none; color: #000;">
      <table style="width: 100%; padding-bottom: 20px;">
        <tr>
          <td style="width: 80%;">
            <div style="font-weight: bold;">${room.title}</div>
          </td>
          <td>
            <div style="color: green; display: inline-block">${room.newMessageCount}</div>
            <img style="width: 20px, height: 20px" src=''/>
          </td>
          <td>
            <div style="color:green">${room.newNametagCount}</div>
            <img style="width: 20px, height: 20px" src=''/>
          </td>
        </tr>
      </table>
        <div>"${room.latestMessage}"</div>
      </a>
    </td>
  </tr>
  <tr><td><div style="height: 20px"/></td></tr>`
  }

  html += `</table>

    <div style='text-align:center; font-size: 10px; margin-top: 40px;'>
        <a style='color: grey; text-decoration: none;' href="https://nametag.chat/unsubscribe/${userToken}?roomid=digest&roomname=${encodeURIComponent(Nametag Updates)}">Unsubscribe</a>
    </div>`

  return {
  subject: `Updates in ${rooms[0].title}`,
  html
}
