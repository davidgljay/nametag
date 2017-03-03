var cacheName = 'nametag-cache-v1'
var urlsToCache = [
  '/',
  '/public/scripts/app.js',
  '/public/manifest.json',
  '/horizon/horizon.js',
  '/images/google.png',
  '/images/twitter.jpg',
  '/images/fb.jpg'
]

// Install Service Worker
self.addEventListener('install', function (event) {
  console.log('Service Worker: Installing....')

  event.waitUntil(

        // Open the Cache
        caches.open(cacheName).then(function (cache) {
          console.log('Service Worker: Caching App Shell at the moment......')

            // Add Files to the Cache
          return cache.addAll(urlsToCache)
        })
    )
})

// Fired when the Service Worker starts up
self.addEventListener('activate', function (event) {
  console.log('Service Worker: Activating....')

  event.waitUntil(
        caches.keys().then(function (cacheNames) {
          return Promise.all(cacheNames.map(function (key) {
            if (key !== cacheName) {
              console.log('Service Worker: Removing Old Cache', key)
              return caches.delete(key)
            }
          }))
        })
    )
  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  console.log('Service Worker: Fetch', event.request.url)

  console.log('Url', event.request.url)

  event.respondWith(
        caches.match(event.request).then(function (response) {
          return response || fetch(event.request)
        })
    )
})
