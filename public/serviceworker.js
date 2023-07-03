const CACHE_NAME = "version-1";
const urlsToCache = [ "offline.html", "logo.png", "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" ];

const self = this;

// Installation of SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    )
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) // if not one of our desginated cached assets or not found we make a network request
                    .catch(() => caches.match('offline.html')) // if network request unsuccessful, we are offline and display offline.html
            })
    )
});

// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) { // keep only the specific files from cache versions we need
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});