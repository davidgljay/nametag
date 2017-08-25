const RootSubscription = {
  messageAdded: messageAdded => messageAdded,
  messageDeleted: messageDeleted => messageDeleted,
  latestMessageUpdated: latestMessage => latestMessage,
  nametagAdded: nametag => nametag,
  badgeRequestAdded: badgeRequest => badgeRequest,
  roomUpdated: room => room,
  nametagUpdated: nametagUpdate => nametagUpdate,
  typingPrompt: nametagId => nametagId
}

module.exports = RootSubscription
