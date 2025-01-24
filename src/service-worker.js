/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
import { build, files, version } from '$service-worker';

const CACHE_NAME = `cache-v1-${version}`;
const ASSETS = [...build, ...files];

// const DB_NAME = 'sync-offline-submissions';
// const STORE_NAME = 'submissions';

// Cache static assets on install
// sw.addEventListener('install', (event) => {
// 	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
// });

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

// service-worker.js
// sw.addEventListener("message", (event) => {
// 	// event is an ExtendableMessageEvent object
// 	console.log(`The client sent me a message: ${event.data}`);

// 	event.source.postMessage("Hi client");
// });


// Utility functions for IndexedDB
// function openDatabase() {
// 	return new Promise((resolve, reject) => {
// 		const request = indexedDB.open(DB_NAME, 1);

// 		request.onupgradeneeded = (event) => {
// 			const db = event.target.result;
// 			if (!db.objectStoreNames.contains(STORE_NAME)) {
// 				db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
// 			}
// 		};

// 		request.onsuccess = () => resolve(request.result);
// 		request.onerror = () => reject(request.error);
// 	});
// }

// async function saveToIndexedDB(data) {
// 	console.log('Saving to IndexedDB...',data);
// 	const db = await openDatabase();
// 	return await new Promise((resolve, reject) => {
// 		const transaction = db.transaction(STORE_NAME, 'readwrite');
// 		const store = transaction.objectStore(STORE_NAME);

// 		const request = store.add(data);
// 		request.onsuccess = () => resolve(request.result);
// 		request.onerror = () => reject(request.error);
// 	});
// }

// async function getAllFromIndexedDB() {
// 	const db = await openDatabase();
// 	return await new Promise((resolve, reject) => {
// 		const transaction = db.transaction(STORE_NAME, 'readonly');
// 		const store = transaction.objectStore(STORE_NAME);

// 		const request = store.getAll();
// 		request.onsuccess = () => resolve(request.result);
// 		request.onerror = () => reject(request.error);
// 	});
// }

// async function deleteFromIndexedDB(id) {
// 	const db = await openDatabase();
// 	return await new Promise((resolve, reject) => {
// 		const transaction = db.transaction(STORE_NAME, 'readwrite');
// 		const store = transaction.objectStore(STORE_NAME);

// 		const request = store.delete(id);
// 		request.onsuccess = () => resolve(request.result);
// 		request.onerror = () => reject(request.error);
// 	});
// }
// IndexedDB utility functions (same as your provided code)
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
// Handle offline form submissions

// sw.addEventListener('fetch', (event) => {
// 	if (event.request.method === 'POST' && event.request.url.includes('/submit')) {
// 		event.respondWith(
// 			(async () => {
// 				try {
// 					const response = await fetch(event.request.clone());
// 					return response;
// 				// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 				} catch (error) {
// 					const formData = await event.request.clone().formData();
// 					const data = {};
// 					formData.forEach((value, key) => {
// 						data[key] = value;
// 					});

// 					// Save to IndexedDB
// 					await saveToIndexedDB(data);

// 					// Register sync event
// 					if ('serviceWorker' in navigator && 'SyncManager' in window) {
// 						navigator.serviceWorker.ready.then((registration) => {
// 							return registration.sync.register('sync-offline-submissions');
// 						});
// 					}

// 					return new Response(
// 						JSON.stringify({
// 							success: false,
// 							message: 'Offline: Form data saved locally.',
// 						}),
// 						{ status: 200, headers: { 'Content-Type': 'application/json' } }
// 					);
// 				}
// 			})()
// 		);
// 	}
// });

// Background sync for submitting data
// sw.addEventListener('sync', (event) => {
// 	if (event.tag === 'sync-forms') {
// 		event.waitUntil(
// 			(async () => {
// 				const forms = await getAllFromIndexedDB();

// 				for (const form of forms) {
// 					try {
// 						const response = await fetch('/submit', {
// 							method: 'POST',
// 							headers: { 'Content-Type': 'application/json' },
// 							body: JSON.stringify(form),
// 						});

// 						if (response.ok) {
// 							// Remove the synced form from IndexedDB
// 							await deleteFromIndexedDB(form.id);
// 						} else {
// 							console.error('Failed to sync form:', form, response.statusText);
// 						}
// 					} catch (error) {
// 						console.error('Failed to sync form:', form, error);
// 					}
// 				}
// 			})()
// 		);
// 	}
// });

// self.addEventListener('sync', (event) => {
// 	if (event.tag === 'sync-offline-submissions') {
// 		event.waitUntil(syncOfflineData());
// 	}
// });

// async function syncOfflineData() {
// 	console.log('Syncing offline submissions...');

// 	// Retrieve data from IndexedDB
// 	const db = await openDatabase(); // Function to open IndexedDB
// 	const submissions = await getAllFromIndexedDB(db); // Get all offline submissions

// 	for (const submission of submissions) {
// 		try {
// 			// Attempt to send the submission to the server
// 			const response = await fetch(`./api/server/submit`, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify(submission),
// 			});

// 			if (response.ok) {
// 				console.log(`Synced submission ID ${submission.id}`);
// 				// Remove the submission from IndexedDB if successfully synced
// 				await deleteFromIndexedDB(db, submission.id);
// 			} else {
// 				console.error(`Failed to sync submission ID ${submission.id}`);
// 			}
// 		} catch (err) {
// 			console.error('Error syncing submission', err);
// 		}
// 	}
// }

// sw.addEventListener('online', () => {
// 	console.log('Browser is back online. Attempting to sync offline submissions.');
// 	syncOfflineData(); // Direct sync without background sync
// });




// async function syncTask() {
// 	// try {
// 	// 	const response = await fetch('/submit', {
// 	// 		method: 'POST',
// 	// 		body: JSON.stringify({ /* data to sync */ }),
// 	// 		headers: {
// 	// 			'Content-Type': 'application/json'
// 	// 		}
// 	// 	});

// 	// 	if (!response.ok) {
// 	// 		throw new Error('Network response was not ok');
// 	// 	}
// 	// 	const responseData = await response.json();
// 	// 	console.log('Data synchronized successfully:', responseData);
// 	// } catch (error) {
// 	// 	console.error('Failed to synchronize:', error);
// 	// }
// 	const forms = await getAllFromIndexedDB();

// 	for (const form of forms) {
// 		try {
// 			const response = await fetch('/submit', {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify(form),
// 			});

// 			if (response.ok) {
// 				// Remove the synced form from IndexedDB
// 				await deleteFromIndexedDB(form.id);
// 			} else {
// 				console.error('Failed to sync form:', form, response.statusText);
// 			}
// 		} catch (error) {
// 			console.error('Failed to sync form:', form, error);
// 		}
// 	}
// }
// // }









// self.addEventListener('fetch', (event) => {
// 	// ignore POST requests etc
// 	if (event.request.method === 'POST' && event.request.url.includes('/submit')) {
// 		event.respondWith(handleFormSubmission(event));
// 	}

// 	else if (event.request.method == 'GET') {
// 		async function respond() {
// 			const url = new URL(event.request.url);
// 			const cache = await caches.open(CACHE_NAME);

// 			// `build`/`files` can always be served from the cache
// 			if (ASSETS.includes(url.pathname)) {
// 				const response = await cache.match(url.pathname);

// 				if (response) {
// 					return response;
// 				}
// 			}

// 			// for everything else, try the network first, but
// 			// fall back to the cache if we're offline
// 			try {
// 				const response = await fetch(event.request);

// 				// if we're offline, fetch can return a value that is not a Response
// 				// instead of throwing - and we can't pass this non-Response to respondWith
// 				if (!(response instanceof Response)) {
// 					throw new Error('invalid response from fetch');
// 				}

// 				if (response.status === 200) {
// 					cache.put(event.request, response.clone());
// 				}

// 				return response;
// 			} catch (err) {
// 				const response = await cache.match(event.request);

// 				if (response) {
// 					return response;
// 				}

// 				// if there's no cache, then just error out
// 				// as there is nothing we can do to respond to this request
// 				throw err;
// 			}
// 		}

// 		event.respondWith(respond());
// 	}
// });

// Intercept fetch requests
// sw.addEventListener('fetch', (event) => {
// 	if (event.request.method === 'POST' && event.request.url.includes('/submit')) {
// 		event.respondWith(handleFormSubmission(event));
// 	} else {
// 		event.respondWith(
// 			caches
// 				.match(event.request)
// 				.then(
// 					(cached) =>
// 						cached ||
// 						fetch(event.request).catch(() => new Response('You are offline', { status: 503 }))
// 				)
// 		);
// 	}
// });

// async function handleFormSubmission(event) {
// 	try {
// 		// Try submitting the form to the server
// 		const response = await fetch(event.request.clone());
// 		if (!response.ok) throw new Error('Network response not ok');
// 		return response;
// 	} catch (err) {
// 		// Save the form data to localStorage if offline
// 		const formData = await event.request.formData();
// 		const data = {};
// 		formData.forEach((value, key) => (data[key] = value));
// 		saveToLocalStorage(data);

// 		return new Response(JSON.stringify({ success: false, message: 'Saved offline' }), {
// 			status: 200,
// 			headers: { 'Content-Type': 'application/json' }
// 		});
// 	}
// }

// Save form data to localStorage
// function saveToLocalStorage(data) {
// 	const storedData = JSON.parse(localStorage.getItem('offlineForms')) || [];
// 	storedData.push({ id: Date.now(), ...data });
// 	localStorage.setItem('offlineForms', JSON.stringify(storedData));
// }

// Sync form data when back online
// sw.addEventListener('sync', (event) => {
// 	if (event.tag === 'sync-forms') {
// 		event.waitUntil(syncOfflineForms());
// 	}
// });

// async function syncOfflineForms() {
// 	const storedData = JSON.parse(localStorage.getItem('offlineForms')) || [];
// 	for (const form of storedData) {
// 		try {
// 			const response = await fetch('/submit', {
// 				method: 'POST',
// 				body: JSON.stringify(form),
// 				headers: { 'Content-Type': 'application/json' }
// 			});
// 			if (response.ok) {
// 				removeFromLocalStorage(form.id);
// 			}
// 		} catch (err) {
// 			console.error('Sync failed:', err);
// 		}
// 	}
// }

// // Remove data from localStorage
// function removeFromLocalStorage(id) {
// 	const storedData = JSON.parse(localStorage.getItem('offlineForms')) || [];
// 	const updatedData = storedData.filter((item) => item.id !== id);
// 	localStorage.setItem('offlineForms', JSON.stringify(updatedData));
// }

// self.addEventListener('fetch', (event) => {
//     if (event.request.method === 'POST' && event.request.url.includes('/submit')) {
//         event.respondWith(
//             (async () => {
//                 try {
//                     const response = await fetch(event.request.clone());
//                     return response;
//                 } catch (err) {
//                     // Offline: Save data to IndexedDB
//                     const formData = await event.request.formData();
//                     const data = {};
//                     formData.forEach((value, key) => (data[key] = value));
//                     await saveToIndexedDB(data);

//                     return new Response(
//                         JSON.stringify({ success: false, message: 'Data saved locally' }),
//                         { status: 200, headers: { 'Content-Type': 'application/json' } }
//                     );
//                 }
//             })()
//         );
//     }
// });

// self.addEventListener('sync', (event) => {
//     if (event.tag === 'sync-forms') {
//         event.waitUntil(
//             (async () => {
//                 const pendingForms = await getFromIndexedDB();
//                 for (const form of pendingForms) {
//                     try {
//                         await fetch('/submit', {
//                             method: 'POST',
//                             body: JSON.stringify(form),
//                             headers: { 'Content-Type': 'application/json' },
//                         });
//                         await removeFromIndexedDB(form.id);
//                     } catch (err) {
//                         console.error('Sync failed:', err);
//                     }
//                 }
//             })()
//         );
//     }
// });

// // Save to IndexedDB
// async function saveToIndexedDB(data) {
//     const DATABASE_NAME = 'FormDatabase';
//     const STORE_NAME = 'FormStore';

//     const db = await new Promise((resolve, reject) => {
//         const request = indexedDB.open(DATABASE_NAME, 1);

//         request.onupgradeneeded = (event) => {
//             const db = event.target.result;
//             if (!db.objectStoreNames.contains(STORE_NAME)) {
//                 db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
//             }
//         };

//         request.onsuccess = () => resolve(request.result);
//         request.onerror = () => reject(request.error);
//     });

//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(STORE_NAME, 'readwrite');
//         const store = transaction.objectStore(STORE_NAME);
//         const request = store.add(data);

//         request.onsuccess = () => resolve(request.result);
//         request.onerror = () => reject(request.error);
//     });
// }

// // Get from IndexedDB
// async function getFromIndexedDB() {
//     const DATABASE_NAME = 'FormDatabase';
//     const STORE_NAME = 'FormStore';

//     const db = await new Promise((resolve, reject) => {
//         const request = indexedDB.open(DATABASE_NAME, 1);

//         request.onsuccess = () => resolve(request.result);
//         request.onerror = () => reject(request.error);
//     });

//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(STORE_NAME, 'readonly');
//         const store = transaction.objectStore(STORE_NAME);
//         const request = store.getAll();

//         request.onsuccess = () => resolve(request.result);
//         request.onerror = () => reject(request.error);
//     });
// }

// // Remove from IndexedDB
// async function removeFromIndexedDB(id) {
//     const DATABASE_NAME = 'FormDatabase';
//     const STORE_NAME = 'FormStore';

//     const db = await new Promise((resolve, reject) => {
//         const request = indexedDB.open(DATABASE_NAME, 1);

//         request.onsuccess = () => resolve(request.result);
//         request.onerror = () => reject(request.error);
//     });

//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(STORE_NAME, 'readwrite');
//         const store = transaction.objectStore(STORE_NAME);
//         const request = store.delete(id);

//         request.onsuccess = () => resolve();
//         request.onerror = () => reject(request.error);
//     });
// }

// Save to LocalStorage
