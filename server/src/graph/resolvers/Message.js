const Message = {
  author: ({author}, args, {models: {Nametags}}) => author ? Nametags.get(author) : null,
  room: ({room}, args, {models: {Rooms}}) => Rooms.get(room),
  replies: ({id}, {limit}, {models: {Messages}}) => Messages.getReplies(id, limit),
  parent: ({parent}, args, {models: {Messages}}) => parent ? Messages.get(parent) : null,
  recipient: ({recipient}, args, {models: {Nametags}}) => recipient ? Nametags.get(recipient) : null
}

module.exports = Message
