importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js')
var cacheName = 'nametag-cache-v1'
var urlsToCache = [
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
  // Customize notification here
  let notificationTitle
  let notificationOptions
  const reason = payload.data.reason
  const params = JSON.parse(payload.data.params)
  switch (reason) {
    case 'MENTION':
      notificationTitle = `${params.senderName} has mentioned you in ${params.roomTitle}`
      notificationOptions = {
        body: params.text,
        icon: params.icon,
        data: `/rooms/${params.roomId}`
      }
      break
    case 'DM':
      notificationTitle = `${params.senderName} has sent you a direct message in ${params.roomTitle}`
      notificationOptions = {
        body: params.text,
        icon: params.icon,
        data: `/rooms/${params.roomId}`
      }
      break
    case 'BADGE_REQUEST':
      notificationTitle = `${params.requesterName} has requested the badge ${params.templateName}`
      notificationOptions = {
        body: params.requesterBio,
        icon: params.requesterIcon,
        data: `/granters/${params.granterCode}`
      }
      break
    case 'BADGE_GRANTED:':
      notificationTitle = `${params.badgeName} Badge Granted`
      notificationOptions = {
        body: `You have been granted the ${params.badgeName} badge by ${params.granterName}`,
        icon: params.image,
        data: `/`
      }
      break
    case 'MOD_ROOM_JOIN':
      notificationTitle = `${params.nametagName} had joined the room ${params.roomName}`
      notificationOptions = {
        icon: params.image,
        data: `/rooms/${params.roomId}`
      }
      break
    case 'ROOM_NEW_MESSAGES':
      notificationTitle = `New messages in ${params.roomTitle}.`
      notificationOptions = {
        icon: params.image,
        body: 'Click to check it out',
        data: `/rooms/${params.roomId}`
      }
      break
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(clientList => {
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i]
      if (client.url === event.notification.data && 'focus' in client) {
        return client.focus()
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(event.notification.data)
    }
  }))
})
