module.exports = ({requesterName, requesterBio, templateName, granterCode}) => ({
  subject: `${requesterName} has requested the ${templateName} badge`,
  txt: `The following user has requested the ${templateName} badge:
  \n
      ${requesterName}\n
      ${requesterBio}\n
  \n
  Please visit your granter page to approve or reject this request:\n
  \n
  https://nametag.chat/granters/${granterCode}
  `,
  html: `<p>The following user has requested the ${templateName} badge:</p>
  <p>
  <b>${requesterName}</b><br/>
  ${requesterBio}<br/>
  </p>
  <p>Please visit your <a href='https://nametag.chat/granters/${granterCode}'>granter page</a> to approve or reject this request.</p>
  <p>https://nametag.chat/granters/${granterCode}</p>`
})
