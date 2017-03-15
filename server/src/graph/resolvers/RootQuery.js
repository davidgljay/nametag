const RootQuery = {
  rooms: (obj, args, {loaders:{Rooms}}) => {
    return Rooms.getActive()
  },
  room: (obj, {id}, {loaders:{Rooms}}) => {
    return Rooms.get(id)
  },
  me: (obj, args, {user}) => {
    return user
  }
}

module.exports = RootQuery
