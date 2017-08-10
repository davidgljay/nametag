module.exports = ({roomId, roomName, message, author}) => ({
  subject: `You have been mentioned in ${roomName}`,
  txt: `You have been mentioned:\n
  \n
      ${message}\n
      -${author}\n
  \n
  Click here to reply:\n
  \n
      https://nametag.chat/rooms/${roomId}\n
  \n`,
  html: `<h2>You have been mentioned in ${roomName}</h2>

<div style="display: flex; flex-direction: column; align-items: baseline;">
    <div style="padding: 10px; margin: 5px; background: #a8a8a8; color: #FFF; border-radius: 3px;">
        ${message}
    </div>
    <a href="https://nametag.chat/rooms/${roomId}" target='_blank'>
      <div style=" margin: 5px; padding: 10px; font-size: 20px; background: #12726a; color: #FFF; border-radius: 3px;">
          Reply
      </div>
    </a>
</div>`
})
