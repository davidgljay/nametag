const RootSubscription = {
  messageAdded: messageAdded => messageAdded,
  messageDeleted: messageDeleted => messageDeleted,
  latestMessageUpdated: latestMessage => latestMessage,
  nametagAdded: nametag => nametag,
  badgeRequestAdded: badgeRequest => badgeRequest,
  roomUpdated: room => room,
  nametagUpdated: nametagUpdate => nametagUpdate,
  typingPromptAdded: prompt => prompt
}

module.exports = RootSubscription
