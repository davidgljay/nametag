const RootSubscription = {
  messageAdded: messageAdded => messageAdded,
  nametagPresence: presence => presence,
  latestMessageUpdated: latestMessage => latestMessage
}

module.exports = RootSubscription
