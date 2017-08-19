const Room = {
  messages: ({id}, _, {user, models: {Messages}}) => {
    if (!user || !user.nametags || !user.nametags[id]) {
      return []
    }
    return Messages.getRoomMessages(id, user.nametags[id])
  },
  nametags: ({id}, _, {user, models: {Nametags}}) => {
    if (!user || !user.nametags || !user.nametags[id]) {
      return []
    }
    return Nametags.getRoomNametags(id)
  },
  nametagCount: ({id}, _, {models: {Nametags}}) => {
    return Nametags.getNametagCount(id)
  },
  mod: ({mod}, _, {models: {Nametags}}) => Nametags.get(mod),
  templates: ({templates}, _, {models: {Templates}}) => Templates.getAll(templates)
}

module.exports = Room
