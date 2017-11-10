const http = require('http')
const https = require('https')

module.exports.redirect = (url, response) => {
  const protocol = url.slice(0,5) === 'https' ? https : http
  protocol.get(url, res => {
    response.setHeader('Content-Type', res.headers['content-type'])
    response.setHeader('Content-Length', res.headers['content-length'])
    res.on('data', chunk => {
      response.write(chunk)
    })
    res.on('end', () => {
      response.end()
    })
  })
}
