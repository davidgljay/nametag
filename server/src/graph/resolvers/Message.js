const Message = {
  nametag: ({author}, args, {loaders: {Nametags}}) => Nametags.get(author),
  room: ({room}, args, {loaders: {Room}}) => Room.get(room)
}

module.exports = Message
