var CACHE_NAME = 'nametag-cache-v1'
var urlsToCache = [
  '/',
  '/public/scripts/app.js',
  '/horizon/horizon.js',
  '/images/google.png',
  '/images/twitter.jpg',
  '/images/fb.jpg'
]

self.addEventListener('install', function (event) {
  console.log('Installing new service worker')
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache)
      })
      .then(result => {
        return result
      })
      .catch(err => console.log('Error Caching', err))
)
})

self.addEventListener('fetch', function (event) {
  console.log('Fetch Req', event)
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        console.log('Cache hit')
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
        .catch(e => console.log('Error matching cache', e))
      }
    )
  )
})
