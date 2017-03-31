const Nametag = {
  badges: ({badges}, args, {models: {Badges}}) => badges ? Badges.getAll(badges) : [],
  room: ({room}, args, {models: {Rooms}}) => room ? Rooms.get(room) : null
}

module.exports = Nametag
