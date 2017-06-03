const {ErrNotAuthorized, ErrNotLoggedIn} = require('../../errors')

const RootQuery = {
  rooms: (obj, {id, query}, {user, models: {Rooms}}) => query
    ? Rooms.getQuery(query)
    : Rooms.getVisible(id),
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
