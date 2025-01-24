# What is a Service Worker?

A service worker is a script that your browser runs in the background, separate from a web page. It acts as a network proxy, allowing you to intercept and handle network requests, including programmatically managing a cache of responses.

## How Does It Work?

Registration: First, the service worker script is registered with the browser.

**Installation** : Once registered, the service worker is installed and activated.

**Interception** : The service worker can intercept network requests made by the web page. It can choose to respond with cached content or fetch new content from the network2.

**Caching** : Service workers can cache responses, which allows for offline functionality and faster load times.

**Background Sync** : They can also handle background tasks, such as sending push notifications or synchronizing data in the background.

## Benefits

**Offline Capabilities** : Service workers enable web applications to work offline or on low-quality networks.

**Performance** : They can improve performance by caching assets and serving them locally.

**User Experience** : Enhances user experience with features like push notifications and background sync.

### Example Use Case

Imagine a news app that uses a service worker. When a user visits the app, the service worker can check if there's cached content available2. If there is, it serves the cached content immediately, reducing load times. If not, it fetches the latest content from the server and updates the cache for future use.

## 1. LocalStorage

**Description**
: Key-value storage available on the browser.

**Capacity**: Typically 5–10 MB.

**Scope**: Per origin (shared across tabs and windows for the same domain).
**Persistence**: Data is stored until explicitly removed by the user or application.

**Synchronous**: Access blocks the main thread.

**Best For**:

- Small, non-sensitive data like UI preferences or theme settings.
- Quick lookups that don't need high security or advanced querying.

**Drawbacks**:

- Cannot store large amounts of data.
- Blocking nature can slow down the UI.
- Not suitable for complex objects (only strings can be stored).

## 2. SessionStorage

**Description**: Similar to LocalStorage, but data persists only for the duration of the page session.

**Capacity**: Typically 5–10 MB.

**Scope**: Per tab or window; data isn't shared between them.

**Persistence**: Cleared when the tab or browser is closed.

**Best For**:
-Storing temporary data like form inputs during navigation.

**Drawbacks**:

- Limited persistence.
- Same limitations as LocalStorage (synchronous, string-only).

## 3. Cookies

**Description**: Small pieces of data sent with every HTTP request to the server.

**Capacity**: ~4 KB per cookie.

**Scope**: Sent automatically to the server with matching requests.

**Persistence**: Controlled by the expires or max-age attributes.

**Best For**:

- Storing server-side session IDs or other authentication tokens.
- Ensuring the server receives small pieces of data automatically.

**Drawbacks**:

- Limited storage capacity.
- Included in every HTTP request, which can slow down performance.

## 4. IndexedDB

**Description**: A low-level, asynchronous, NoSQL database available in the browser.

**Capacity**: Hundreds of MB (depending on browser and device).

**Scope**: Per origin.

**Persistence**: Data persists until explicitly cleared by the user or app.

**Best For**:

- Storing large or complex datasets (e.g., offline forms, app data).
- Querying data using indexes.

**Drawbacks**:

- API is more complex than other storage options.
- Requires more setup for simpler use cases.

## 5. Cache Storage (Service Worker Cache)

**Description**: Stores HTTP responses and resources for offline use.

**Capacity**: Limited by browser storage policies (shared with other storage).

**Scope**: Controlled by the Service Worker.

**Persistence**: Data persists until removed or updated by the Service Worker.

**Best For**:

- Storing static resources (HTML, CSS, JS, images).
- Offline-first web apps.

**Drawbacks**:

- Not suitable for structured data or direct querying.

## 6. WebSQL (Deprecated)

**Description**: Relational database storage for browsers.

**Status**: Deprecated and no longer recommended for new projects.

## 7. File System Access API

**Description**: Allows web apps to read/write files to the user’s local file system (with permissions).

**Scope**: Direct file system access.

**Best For**:

- Managing large files directly, like images or documents.

**Drawbacks**:

- Requires user permissions.
- Limited to modern browsers.

## 8. Web Storage (Memory Storage)

**Description**: Temporary, in-memory storage available during the browser session.

**Scope**: Per tab or window.

**Best For**:

- Volatile data that doesn’t need to persist (e.g., temporary computations).

**Drawbacks**:

- Lost when the page is refreshed or the tab is closed.

### Which Storage is Best for Offline Form Submissions?

**Recommendation**: Use IndexedDB

> **Reasons**:

**Handles Structured Data**: Unlike LocalStorage, IndexedDB can store objects directly, making it ideal for form submissions.

**Asynchronous**: Does not block the main thread, ensuring smooth performance.

**Large Capacity**: Suitable for apps that may need to store multiple or large forms offline.

**Persistence**: Data stays available even after browser restarts, making it reliable for offline apps.

How It Fits Your Scenario:

- You can store offline submissions as JSON objects in IndexedDB.
- Sync the stored data with the server when the network is restored.
- Delete synced data from IndexedDB to free up space.

Comparison Table

| **Feature**     | **LocalStorage** | **SessionStorage** | **Cookies**  | **IndexedDB**  | **Cache Storage** |
| --------------- | ---------------- | ------------------ | ------------ | -------------- | ----------------- |
| **Capacity**    | ~10 MB           | ~10 MB             | ~4 KB        | Hundreds of MB | Browser-limited   |
| **Persistence** | Until cleared    | Session only       | Configurable | Until cleared  | Until cleared     |
| **Data Type**   | Strings          | Strings            | Strings      | Objects/Blobs  | HTTP Responses    |
| **Performance** | Blocks UI        | Blocks UI          | N/A          | Async          | Async             |
| **Best For**    | Simple data      | Temp data          | HTTP data    | Complex data   | Static assets     |

Service worker in svelte [link in Documentation](https://svelte.dev/docs/kit/service-workers)

for the install activate and fetch use this code in your `src/service-worker.js` file

```js
/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
import { build, files, version } from '$service-worker';

const CACHE_NAME = `cache-v1-${version}`;
const ASSETS = [...build, ...files];

sw.addEventListener('install', (event) => {
 // Create a new cache and add all files to it
 async function addFilesToCache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(ASSETS);
 }

 event.waitUntil(addFilesToCache());
});

// Remove old caches on activate
sw.addEventListener('activate', (event) => {
 // Remove previous cached data from disk
 async function deleteOldCaches() {
  for (const key of await caches.keys()) {
   if (key !== CACHE_NAME) await caches.delete(key);
  }
 }
 event.waitUntil(deleteOldCaches());
});
sw.addEventListener('fetch', (event) => {
 // ignore POST requests etc
 if (event.request.method !== 'GET') return;

 async function respond() {
  const url = new URL(event.request.url);
  const cache = await caches.open(CACHE_NAME);

  // `build`/`files` can always be served from the cache
  if (ASSETS.includes(url.pathname)) {
   const response = await cache.match(url.pathname);

   if (response) {
    return response;
   }
  }

  // for everything else, try the network first, but
  // fall back to the cache if we're offline
  try {
   const response = await fetch(event.request);

   // if we're offline, fetch can return a value that is not a Response
   // instead of throwing - and we can't pass this non-Response to respondWith
   if (!(response instanceof Response)) {
    throw new Error('invalid response from fetch');
   }

   if (response.status === 200) {
    cache.put(event.request, response.clone());
   }

   return response;
  } catch (err) {
   const response = await cache.match(event.request);

   if (response) {
    return response;
   }

   // if there's no cache, then just error out
   // as there is nothing we can do to respond to this request
   throw err;
  }
 }

 event.respondWith(respond());
});
```

These events install the service workers on build and activate for all routes of application.

Now for communicate with indexedDB make a file `$lib/utils/indexedDBUtils.ts` and add this code to this

This is generic code so you just have tocall and use this function where you want

```js
// IndexedDB Utility Functions

export async function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('offlineFormData', 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('submissions')) {
                db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function storeInIndexedDB(formName: string, data: Record<string, any>): Promise<void> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readwrite');
        const store = transaction.objectStore('submissions');
        const record = { formName, data, timestamp: Date.now() };

        const request = store.add(record);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}

export async function getAllFromIndexedDB(formName: string): Promise<Record<string, any>[]> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readonly');
        const store = transaction.objectStore('submissions');
        const request = store.getAll();

        request.onsuccess = () => {
            const results = request.result.filter((item) => item.formName === formName);
            resolve(results.map((item) => item.data));
        };
        request.onerror = () => reject(request.error);
    });
}

export async function clearIndexedDB(formName: string): Promise<void> {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('submissions', 'readwrite');
        const store = transaction.objectStore('submissions');

        // Delete records matching the formName
        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                if (cursor.value.formName === formName) {
                    cursor.delete();
                }
                cursor.continue();
            }
        };
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}
```

In your form component import these functions

```js
import { storeInIndexedDB, getAllFromIndexedDB, clearIndexedDB } from '$lib/utils/indexedDBUtils';
```

Add isOffline flag and form name

```js
 let isOffline = false;
 const formName = 'UserAccountForm';
```

Monitor network status and set events according to that

```js

 // Monitor network status
 onMount(() => {
  isOffline = !navigator.onLine;
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', () => (isOffline = true));
  checkAndSyncData();
 });

 async function handleOnline() {
  isOffline = false;
  await checkAndSyncData(); // Sync offline data when back online
 }
```

Submit function and sync data to API server

```js
async function submitForm(event: Event) {
  event.preventDefault();
  const formElement = event.target as HTMLFormElement;
  const formData = new FormData(formElement);
  const data = Object.fromEntries(formData.entries());

  if (isOffline) {
   console.log('Offline. Storing data in IndexedDB.');
   await storeInIndexedDB(formName, data);
  } else {
   console.log('Online. Submitting data via form action.');
   formElement.submit(); // Submit form to the action directly
  }
 }

 async function checkAndSyncData() {
  const offlineData = await getAllFromIndexedDB(formName);
  if (offlineData.length > 0) {
   for (const data of offlineData) {
    // Send the data to the server using fetch
    try {
     await fetch('/api/server/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
     });
    } catch (error) {
     console.error('Failed to sync data:', error);
    }
   }
   await clearIndexedDB(formName); // Clear synced data from IndexedDB
  }
 }
```

Use form as

```html
  <form
   class="w-full space-y-4"
   method="post"
   use:enhance
   action="?/create"
   onsubmit={submitForm}
  >
```

And form field is as

```html
<div>
    <label for="FirstName" class="block text-sm font-medium text-gray-700">First Name</label>
    <input
     name="FirstName"
     type="text"
     placeholder="Enter first name"
     class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
     bind:value={$form.FirstName}
     aria-invalid={$errors.FirstName ? 'true' : undefined}
     {...$constraints.FirstName}
    />

    {#if $errors.FirstName}
     <p class="mt-1 text-sm text-red-500">{$errors.FirstName}</p>
    {/if}
   </div>
```
