const Message = {
  author: ({author}, args, {models: {Nametags}}) => author ? Nametags.get(author) : null,
  room: ({room}, args, {models: {Rooms}}) => Rooms.get(room),
  template: ({template}, args, {models: {Templates}}) => template ? Templates.get(template): null,
  replies: ({id}, {limit}, {models: {Messages}}) => Messages.getReplies(id, limit),
  replyCount: ({id}, {limit}, {models: {Messages}}) => Messages.getReplyCount(id),
  parent: ({parent}, args, {models: {Messages}}) => parent ? Messages.get(parent) : null,
  recipient: ({recipient}, args, {models: {Nametags}}) => recipient ? Nametags.get(recipient) : null
}

module.exports = Message
