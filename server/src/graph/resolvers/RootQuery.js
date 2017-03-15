const RootQuery = {
  rooms: (obj, args, {loaders:{Rooms}}) => {
    console.log('Rooms query');
    return Rooms.getActive()
  },
  room: (obj, {id}, {loaders:{Rooms}}) => {
    console.log('Room query', id);
    return Rooms.get(id)
  },
  me: (obj, args, {user}) => {
    console.log('Me query');
    return user
  }
}

module.exports = RootQuery
