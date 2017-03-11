importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js')
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

firebase.initializeApp({
  'messagingSenderId': '820872076821'
})

// Install Service Worker
self.addEventListener('install', function (event) {
  event.waitUntil(
        // Open the Cache
        caches.open(cacheName).then(function (cache) {
            // Add Files to the Cache
          return cache.addAll(urlsToCache)
        })
    )
})

// Fired when the Service Worker starts up
self.addEventListener('activate', function (event) {
  event.waitUntil(
        caches.keys().then(function (cacheNames) {
          return Promise.all(cacheNames.map(function (key) {
            if (key !== cacheName) {
              return caches.delete(key)
            }
          }))
        })
    )
  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
        caches.match(event.request).then(function (response) {
          return response || fetch(event.request)
        })
    )
})

// Handle messages while in the background
firebase.messaging().setBackgroundMessageHandler((payload) => {
  console.log('Nametag:[sw.js] Received background message ', payload)
  // Customize notification here
  let notificationTitle
  const {room, from, body, reason} = payload.data
  switch (reason) {
    case 'MENTION':
      notificationTitle = `${from.name} has mentioned you in ${room.name}`
      break
    case 'DM':
      notificationTitle = `${from.name} has sent you a direct message in ${room.name}`
      break
  }
  const notificationOptions = {
    body: body,
    icon: from.icon
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})
