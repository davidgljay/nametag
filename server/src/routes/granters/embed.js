const {db} = require('../../db')
const pug = require('pug')

module.exports = (req, res, next) => {
  res.render('embed.pug', {title: 'Nametag Embed'})
}

module.exports.oEmbed = (req, res, next, {conn, models: {Granters}}) => {
  console.log(req.params.granter)
  return Granters.getByUrlCode(req.params.granter)
  .then(granter => granter
    ? db.table('rooms').getAll(granter.id, {index: 'granter'}).count().run(conn)
    : 0
  )
  .then(count => {
    res.json({
        version: 1,
        type: 'HTML',
        height: 170 * count,
        width: '100%',
        html: pug.renderFile('/usr/nametag/server/views/embed.pug')
    })
  })
}
