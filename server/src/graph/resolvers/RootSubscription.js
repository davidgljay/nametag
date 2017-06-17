const RootSubscription = {
  messageAdded: messageAdded => messageAdded,
  nametagPresence: presence => presence,
  latestMessageUpdated: latestMessage => latestMessage,
  nametagAdded: nametag => nametag,
  badgeRequestAdded: badgeRequest => badgeRequest
}

module.exports = RootSubscription
