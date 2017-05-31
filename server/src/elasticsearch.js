const fetch = require('node-fetch')
const btoa = require('btoa')
const {elasticsearch} = require('./secrets.json')
module.exports = {

  //Put in docker init?
  init: () => {
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
    return fetch('http://elasticsearch:9200/_xpack/security/user/elastic/_password', options)
  },
  index: (obj, index, type) => {
    const options = {
      method: 'PUT',
      headers: {
        'Authorization': "Basic " + btoa(`elastic:${elasticsearch.password}`),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }
    return fetch(`http://elasticsearch:9200/${index}/${type}/${obj.id}`, options)
  },
  search : (query, templates, index, type) => {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': "Basic " + btoa(`elastic:${elasticsearch.password}`),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {
             "query": {
              	"bool": {
              		"should": [
                    {
                      "match": {
                				"title": {
                					"query": query,
                					"boost": 2
                				}
              			  }
                    },
                  	{ "match": {"description": query} }
                  ],
                  "filter": {
                    "bool": {
                      "should": [
                        {
                          "match": {
                            "template": "public"
                          }
                        }
                      ].concat(
                        templates.map(template => ({
                          "match": {
                            "template": template
                          }
                        }))
                      )
                    }
                  }
              	}
              },
              "_source": {
          		    "excludes": "*"
              }
        })
    }
    return fetch(`http://elasticsearch:9200/${index}/${type}`, options)
      .then(res => res.hits.hits.map(hit => hit._id))
  }
}
