const fetch = require('node-fetch')
const btoa = require('btoa')
const {elasticsearch} = require('./secrets.json')
module.exports = {
  init: () => {
    console.log('Updating elasticsearch password')

    const options = {
      method: 'POST',
      headers: {
        'Authorization': "Basic " + btoa('elastic:changeme'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "password" : elasticsearch.password
      })
    }
    fetch('http://elasticsearch:9200/_xpack/security/user/elastic/_password', options)
  }
}
