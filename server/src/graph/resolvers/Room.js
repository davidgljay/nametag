const checkIfBanned = (nametagId, Nametags) =>
  Nametags.get(nametagId).then(nametag => nametag.banned)

const Room = {
  messages: ({id}, _, {user, models: {Messages, Nametags}}) => {
    if (!user || !user.nametags || !user.nametags[id]) {
      return []
    }
    return checkIfBanned(user.nametags[id], Nametags)
      .then(banned =>
        banned ? []
        : Messages.getRoomMessages(id, user.nametags[id])
      )
  },
  actionTypes: ({actionTypes}) => actionTypes || [],
  nametags: ({id}, _, {user, models: {Nametags}}) => Nametags.getRoomNametags(id),
  nametagCount: ({id}, _, {models: {Nametags}}) => Nametags.getNametagCount(id),
  newNametagCount: ({id}, _, {user, models: {Nametags}}) =>
    user ? Nametags.newNametagCount(id) : 0,
  newMessageCount: ({id}, _, {user, models: {Messages}}) =>
    user ? Messages.newMessageCount(id) : 0,
  mod: ({mod}, _, {models: {Nametags}}) => Nametags.get(mod),
  granter: ({granter}, _, {models: {Granters}}) => Granters.get(granter),
  templates: ({templates}, _, {models: {Templates}}) => Templates.getAll(templates)
}

module.exports = Room
