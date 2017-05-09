const {ErrNotAuthorized, ErrNotLoggedIn} = require('../../errors')

const RootQuery = {
  rooms: (obj, {id}, {user, models: {Rooms}}) => {
    return Promise.all([
      Rooms.getPublic(id),
      user && user.badges ? Rooms.getByTemplates(Object.keys(user.badges), true, id) : []
    ])
    .then(([pub, priv]) => pub.concat(priv).sort((a, b) => b.createdAt - a.createdAt))
  },
  room: (obj, {id}, {models: {Rooms}}) => Rooms.get(id),
  me: (obj, args, {user}) => Promise.resolve(user),
  granter: (obj, {urlCode}, {user, models: {Granters}}) => user
  ? Granters.getByUrlCode(urlCode)
      .then(granter => {
        return user.badges[granter.adminTemplate]
        ? granter : Promise.reject(ErrNotAuthorized)
      }
      )
  : Promise.reject(ErrNotLoggedIn),
  template: (obj, {id}, {models: {Templates}}) => Templates.get(id)
}

module.exports = RootQuery
