const Nametag = {
  badges: ({badges}, args, {models: {Badges}}) => badges ? Badges.getAll(badges) : [],
  room: ({room}, args, {models: {Rooms}}) => Rooms.get(room)
}

module.exports = Nametag
