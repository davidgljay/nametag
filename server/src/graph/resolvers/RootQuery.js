const {ErrNotAuthorized, ErrNotLoggedIn} = require('../../errors')

const RootQuery = {
  rooms: (obj, {query, granter}, {user, models: {Rooms}}) => {
    if (granter) {
      return Rooms.getGranterRooms(granter)
    } else if (query) {
      return Rooms.getQuery(query)
    }
    return Rooms.getVisible()
  },
  room: (obj, {id}, {models: {Rooms}}) => Rooms.get(id),
  replies: (obj, {message}, {models: {Messages}}) => Messages.getReplies(message),
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
