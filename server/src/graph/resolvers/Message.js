const Message = {
  author: ({author}, args, {models: {Nametags}}) => Nametags.get(author),
  room: ({room}, args, {models: {Room}}) => Room.get(room)
}

module.exports = Message
