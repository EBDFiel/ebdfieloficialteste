const CACHE_NAME = "ebd-fiel-v2";
const STATIC_CACHE = [
  "/",
  "/index.html",
  "/licao.html",
  "/manifest.json",
  "/img/fundo.png",
  "/img/logo-adultos.png",
  "/img/logo-jovens.png",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
];

// 🔥 INSTALAÇÃO
self.addEventListener("install", event => {
  console.log("Service Worker: Instalando...");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_CACHE);
    })
  );
});

// 🔥 ATIVAÇÃO (LIMPA CACHE ANTIGO)
self.addEventListener("activate", event => {
  console.log("Service Worker: Ativado!");

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// 🔥 FETCH (ESTRATÉGIA INTELIGENTE)
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();

        caches.open(CACHE_NAME).then(cache => {
  if (event.request.url.startsWith("http")) {
    cache.put(event.request, clone);
  }
});

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(res => {
          return res || caches.match("/index.html");
        });
      })
  );
});

// 🔥 ATUALIZAÇÃO AUTOMÁTICA
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});