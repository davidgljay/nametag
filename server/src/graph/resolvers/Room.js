const {ErrNotInRoom, ErrNotLoggedIn} = require('../../errors')

const Room = {
  messages: ({id}, _, {user, models: {Messages}}) => {
    if (!user) {
      return Promise.reject(ErrNotLoggedIn)
    } else if (!user.nametags || !user.nametags[id]) {
      return Promise.reject(ErrNotInRoom)
    }
    return Messages.getRoomMessages(id, user.nametags[id])
  },
  nametags: ({id}, _, {user, models: {Nametags}}) => {
    if (!user) {
      return Promise.reject(ErrNotLoggedIn)
    } else if (!user.nametags || !user.nametags[id]) {
      return Promise.reject(ErrNotInRoom)
    }
    return Nametags.getRoomNametags(id)
  },
  nametagCount: ({id}, _, {models: {Nametags}}) => {
    return Nametags.getNametagCount(id)
  },
  mod: (room, _, {models: {Nametags}}) => Nametags.get(room.mod)
}

module.exports = Room
