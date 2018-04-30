const {db} = require('../../db')

module.exports = (req, res, next, conn) => {
    res.render('embed.pug', {title: 'Nametag Embed'})
  }
