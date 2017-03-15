const Room = {
  messages: ({id}, _, {user: {nametags}, loaders: {Messages}}) =>
    Messages.getRoomMessages(id, nametags[id]),
  nametags: ({id}, _, {loaders: {Nametags}}) => Nametags.getRoomNametags(id),
  mod: ({mod}, _, {loaders: {Nametags}}) => Nametags.get(mod)
}

module.exports = Room
