const Donation = {
  granter: ({granter}, _, {models: {Granters}}) => Granters.get(granter),
  nametag: ({nametag}, _, {models: {Nametags}}) => Nametags.get(nametag),
  room: ({room}, _, {models: {Rooms}}) => Rooms.get(room)
}

module.exports = Donation
