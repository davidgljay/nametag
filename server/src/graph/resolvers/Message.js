const Message = {
  author: ({author}, args, {models: {Nametags}}) => Nametags.get(author),
  room: ({room}, args, {models: {Rooms}}) => Rooms.get(room),
<<<<<<< HEAD
  template: ({template}, args, {models: {Templates}}) => template ? Templates.get(template) : null,
=======
  template: ({template}, args, {models: {Templates}}) => Templates.get(template),
>>>>>>> homepage
  replies: ({id}, {limit}, {models: {Messages}}) => Messages.getReplies(id, limit),
  replyCount: ({id}, {limit}, {models: {Messages}}) => Messages.getReplyCount(id),
  parent: ({parent}, args, {models: {Messages}}) => Messages.get(parent),
  recipient: ({recipient}, args, {models: {Nametags}}) => Nametags.get(recipient),
  nametag: ({nametag}, args, {models: {Nametags}}) => Nametags.get(nametag)
}

module.exports = Message
