const Message = {
  author: ({author}, args, {models: {Nametags}}) => author ? Nametags.get(author) : null,
  room: ({room}, args, {models: {Room}}) => Room.get(room),
  recipient: ({recipient}, args, {models: {Nametags}}) => recipient ? Nametags.get(recipient) : null
}

module.exports = Message
