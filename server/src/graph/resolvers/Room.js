const {ErrNotInRoom} = require('../../errors')

const Room = {
  messages: ({id}, _, {user: {nametags}, loaders: {Messages}}) =>
    nametags[id] ? Messages.getRoomMessages(id, nametags[id]) : ErrNotInRoom,
  nametags: ({id}, _, {user: {nametags}, loaders: {Nametags}}) =>
    nametags[id] ? Nametags.getRoomNametags(id) : ErrNotInRoom,
  mod: ({mod}, _, {loaders: {Nametags}}) => Nametags.get(mod)
}

module.exports = Room
