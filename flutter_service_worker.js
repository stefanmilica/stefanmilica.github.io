'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "8df900106f9d7914570957118b8f29b6",
"assets/assets/images/pozivnica_js_lat_front.png": "136407674407aaf6e831034a8658f534",
"assets/assets/images/wedding_bg_texture.webp": "8594b85dcec6624a6fc5e83740196ac7",
"assets/assets/images/wedding_letters.webp": "723f42de71869671d177a42991981033",
"assets/assets/images/wedding_letters_ms.webp": "1e97c9eeb2b9ea2ea0156b6207bc285e",
"assets/assets/images/wedding_mask_for_letters.webp": "6fac8792f36a515f3ea3ca0d238ca433",
"assets/assets/images/wedding_menu_bg.webp": "285289ee58afec6bd91c6fd393bb4f20",
"assets/assets/images/wedding_splash_bg_without_texture.png": "5184a9708e19d72a915d0adf8c3a9525",
"assets/assets/images/wedding_splash_bg_without_texture_without_letters.png": "12a7a9ac2682da918a6aba70d85436ec",
"assets/assets/images/wedding_splash_bg_without_texture_without_letters_without_mask.webp": "9191ab82c81a84986a38d3ec6ec723eb",
"assets/assets/images/wedding_splash_bg_without_texture_without_letters_without_mask_ms.webp": "bd0f4ccce560a055a6af2882b6cd6f71",
"assets/FontManifest.json": "08056140e7656df3ffe836dabe6d1f13",
"assets/fonts/Cormorant-Bold.ttf": "d90a11f64852952816aedf3481212110",
"assets/fonts/Cormorant-BoldItalic.ttf": "573f7bc7f7c6a82c1308d686cd07feae",
"assets/fonts/Cormorant-Italic.ttf": "517a50d4c2b776d3d15d6f74eaec1d26",
"assets/fonts/Cormorant-Light.ttf": "65ae028146e8d73d23106c35803f5893",
"assets/fonts/Cormorant-LightItalic.ttf": "ea74446f960848ed65a991fc41b13b25",
"assets/fonts/Cormorant-Medium.ttf": "5ab27a8fef8a3ff1fcb63af5e640dc73",
"assets/fonts/Cormorant-MediumItalic.ttf": "9f36b5f3b8537043394825154e5c0394",
"assets/fonts/Cormorant-Regular.ttf": "45c3e0cc1ffcd96a2f101a89cb575a7c",
"assets/fonts/Cormorant-SemiBold.ttf": "48d01bf7f92a389f1b5c513d7fb3313e",
"assets/fonts/Cormorant-SemiBoldItalic.ttf": "ae568483cf409d433f7efc7ac2da86e8",
"assets/fonts/Gwendolyn-Bold.ttf": "b83cfe775686e3eaace2ebff3313b982",
"assets/fonts/Gwendolyn-Regular.ttf": "edb20e990c4aea087b9df2627195078e",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "51b92c567785048b7145c53b6bd8012d",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "6132a2a11168e6d02f59f079f869a9fb",
"/": "6132a2a11168e6d02f59f079f869a9fb",
"main.dart.js": "7c604930cb8702b34529ae7f8ae1b642",
"manifest.json": "54a522267d997504d38487cb744b4673",
"version.json": "d8235c0350e5e25f621d809ece061f60"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
