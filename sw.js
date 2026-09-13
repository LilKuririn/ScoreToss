/* Cornscore — service worker.
   La page est servie en « réseau d'abord » : une mise à jour du site apparaît
   dès le prochain lancement connecté, tout en restant jouable hors ligne.
   Les fichiers annexes sont servis depuis le cache, plus rapides et stables. */

var CACHE = "cornscore-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(ASSETS); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

/* Seule la page de l'application est mise en cache et servie hors ligne.
   Sans ce filtre, toute page ouverte dans le périmètre — la politique de
   confidentialité, par exemple — était rangée sous le nom index.html, et
   c'est elle qui s'affichait au lancement suivant sans réseau. */
var RACINE = new URL("./", self.location).pathname;
function estLApplication(url){
  var chemin = new URL(url).pathname;
  return chemin === RACINE || chemin === RACINE + "index.html";
}

self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;

  if(e.request.mode === "navigate"){
    if(!estLApplication(e.request.url)) return;   /* le navigateur s'en charge */
    e.respondWith(
      fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put("./index.html", copy); });
        return res;
      }).catch(function(){
        return caches.match("./index.html").then(function(hit){
          return hit || caches.match("./");
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request);
    })
  );
});
