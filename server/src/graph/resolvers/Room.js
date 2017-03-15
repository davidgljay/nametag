const Room = {
  messages ({id}, _, {user: {nametags}, loaders: {Messages}}) {
    return Messages.getRoomMessages(id, nametags[id])
  },
  nametags ({id}, _, {loaders: {Nametags}}) {
    return Nametags.getRoomNametags(id)
  }
}

module.exports = Room
