const {ErrNotAuthorized, ErrNotLoggedIn, APIError} = require('../../errors')

const RootQuery = {
  rooms: (obj, args, {user, models: {Rooms}}) => Promise.all([
    Rooms.getPublic(),
    user && user.badges ? Rooms.getByTemplates(Object.keys(user.badges), true) : []
  ])
  .then(([pub, priv]) => pub.concat(priv).sort((a, b) => b.createdAt - a.createdAt)),
  room: (obj, {id}, {models: {Rooms}}) => Rooms.get(id),
  me: (obj, args, {user}) => Promise.resolve(user),
  granter: (obj, {urlCode}, {user, models: {Granters}}) => user
  ? Granters.getByUrlCode(urlCode)
      .then(granter => {
        console.log('granter', granter)
        console.log(user.badges[granter.adminTemplate]);
        return user.badges[granter.adminTemplate]
        ? granter : Promise.reject(ErrNotAuthorized)
      }
      )
  : Promise.reject(ErrNotLoggedIn),
  template: (obj, {id}, {models: {Templates}}) => Templates.get(id)
}

module.exports = RootQuery
