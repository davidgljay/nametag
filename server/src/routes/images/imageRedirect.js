const http = require('http')

module.exports.redirect = (url, response) =>
  http.get(url, res => {
    response.setHeader('Content-Type', res.headers['content-type'])
    response.setHeader('Content-Length', res.headers['content-length'])
    res.on('data', chunk => {
      response.write(chunk)
    })
    res.on('end', () => {
      response.end()
    })
  })
