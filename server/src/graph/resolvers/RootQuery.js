const RootQuery = {
  rooms: (obj, args, {models: {Rooms}}) => {
    return Rooms.getActive()
  },
  room: (obj, {id}, {models: {Rooms}}) => {
    return Rooms.get(id)
  },
  me: (obj, args, {user}) => {
    return user
  }
}

module.exports = RootQuery
