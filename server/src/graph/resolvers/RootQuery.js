const {ErrNotAuthorized, ErrNotLoggedIn} = require('../../errors')

const RootQuery = {
  rooms: (obj, {id, query, granter}, {user, models: {Rooms}}) => {
    if (granter) {
      return Rooms.getGranterRooms(granter)
    } else if (query) {
      return Rooms.getQuery(query)
    }
    return Rooms.getVisible(id)
  },
  room: (obj, {id}, {models: {Rooms}}) => Rooms.get(id),
  me: (obj, args, {user}) => Promise.resolve(user),
  granter: (obj, {urlCode}, {user, models: {Granters}}) => user
  ? Granters.getByUrlCode(urlCode)
      .then(granter => {
        return user.badges[granter.adminTemplate]
        ? granter : Promise.reject(ErrNotAuthorized)
      })
  : Promise.reject(ErrNotLoggedIn),
  template: (obj, {id}, {models: {Templates}}) => Templates.get(id)
}

module.exports = RootQuery
