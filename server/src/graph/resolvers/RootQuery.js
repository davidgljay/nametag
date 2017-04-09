const {ErrNotAuthorized} = require('../../errors')

const RootQuery = {
  rooms: (obj, args, {models: {Rooms}}) => Rooms.getActive(),
  room: (obj, {id}, {models: {Rooms}}) => Rooms.get(id),
  me: (obj, args, {user}) => user,
  granter: (obj, {urlCode}, {user, models: {BadgeGranters}}) => BadgeGranters.getByUrlCode(urlCode)
      .then(granter =>  user.badges[granter.adminTemplate] ? granter : ErrNotAuthorized),
  template: (obj, {id}, {models: {BadgeTemplates}}) => BadgeTemplates.get(id)
}

module.exports = RootQuery
