const Message = {
  author: ({author}, args, {models: {Nametags}}) => author ? Nametags.get(author) : null,
  room: ({room}, args, {models: {Rooms}}) => Rooms.get(room),
  replies: ({id}, args, {models: {Messages}}) => Messages.getReplies(id),
  recipient: ({recipient}, args, {models: {Nametags}}) => recipient ? Nametags.get(recipient) : null
}

module.exports = Message
