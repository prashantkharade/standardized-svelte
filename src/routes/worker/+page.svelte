<!-- <script lang="ts">
	// import { browser } from '$app/environment';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms'; // For enhanced form submission
	import { onMount } from 'svelte';

	import { openDB } from 'idb';

	let isOffline = false;

	onMount(() => {
		isOffline = !navigator.onLine;
		window.addEventListener('online', () => (isOffline = false));
		window.addEventListener('offline', () => (isOffline = true));
	});

    $:console.log(isOffline);

    // onMount(() => {
        
        if(!isOffline){
            getAllFromIndexedDB();
        }
    // })
	if (browser && 'serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then(() => console.log('Service Worker Registered'))
				.catch((err) => console.error('Service Worker registration failed:', err));
		});
	}

	// // In your main app code (e.g., inside a submit handler)
	// if ('serviceWorker' in navigator && 'SyncManager' in window) {
	// 	navigator.serviceWorker.ready
	// 		.then((registration) => {
	// 			// Register the sync event
	// 			return registration.sync.register('sync-offline-submissions');
	// 		})
	// 		.then(() => {
	// 			console.log('Background sync registered');
	// 		})
	// 		.catch((err) => {
	// 			console.error('Failed to register background sync', err);
	// 		});
	// } else {
	// 	console.warn('Background sync not supported');
	// 	// Optionally, handle fallback for browsers without background sync support
	// }

	// function handleOfflineSubmission(data) {
	// 	storeInIndexedDB(data).then(() => {
	// 		if ('serviceWorker' in navigator && 'SyncManager' in window) {
	// 			navigator.serviceWorker.ready
	// 				.then((registration) => registration.sync.register('sync-offline-submissions'))
	// 				.then(() => {
	// 					console.log('Background sync registered for offline submissions');
	// 				})
	// 				.catch((err) => {
	// 					console.error('Background sync registration failed', err);
	// 				});
	// 		} else {
	// 			console.warn('Background sync not supported');
	// 		}
	// 	});
	// }

	// async function handleFormSubmission(event) {
	// 	event.preventDefault();

	// 	const formData = new FormData(event.target);
	// 	const data = Object.fromEntries(formData);

	// 	if (!navigator.onLine) {
	// 		console.log('Offline. Storing data in IndexedDB.');

	// 		// Save data to IndexedDB
	// 		await storeInIndexedDB(data);

	// 		// Register the background sync event
	// 		if ('serviceWorker' in navigator && 'SyncManager' in window) {
	// 			navigator.serviceWorker.ready
	// 				.then((registration) => registration.sync.register('sync-offline-submissions'))
	// 				.then(() => {
	// 					console.log('Background sync registered.');
	// 				})
	// 				.catch((err) => {
	// 					console.error('Failed to register background sync', err);
	// 				});
	// 		} else {
	// 			console.warn('Background sync not supported. Data will stay in IndexedDB.');
	// 		}
	// 	} else {
	// 		console.log('Online. Submitting data directly to the server.');
	// 		await fetch(`/api/server/submit`, {
	// 			method: 'POST',
	// 			body: JSON.stringify(data),
	// 			headers: { 'Content-Type': 'application/json' }
	// 		});
	// 	}
	// }

	onMount(() => {
		const form = document.getElementById('offlineForm');

		form.addEventListener('submit', async (event) => {
			event.preventDefault();

			const formData = new FormData(event.target);
			const data = Object.fromEntries(formData);

			if (!navigator.onLine) {
				console.log('Offline. Storing data in IndexedDB.');

				// Save data to IndexedDB
              
				await storeInIndexedDB(data);

				// Register the sync event
				if ('serviceWorker' in navigator && 'SyncManager' in window) {
					navigator.serviceWorker.ready
						.then((registration) => registration.sync.register('sync-offline-submissions'))
						.then(() => {
							console.log('Background sync registered.');
						})
						.catch((err) => {
							console.error('Failed to register background sync', err);
						});
				} else {
					console.warn('Background sync not supported. Data will stay in IndexedDB.');
				}
			} else {
				console.log('Online. Submitting data directly to the server.');
				await fetch('api/server/submit', {
					method: 'POST',
					body: JSON.stringify(data),
					headers: { 'Content-Type': 'application/json' }
				});
			}
		});
	});
async function storeInIndexedDB(data: Record<string, any>): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction('submissions', 'readwrite');
		const store = transaction.objectStore('submissions');
		const request = store.add(data);

		request.onsuccess = () => resolve();
		request.onerror = (event) => reject((event.target as IDBRequest).error);
	});
}


async function openDatabase(): Promise<IDBDatabase> {
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

async function clearIndexedDB(): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction('submissions', 'readwrite');
		const store = transaction.objectStore('submissions');
		const request = store.clear();

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}


async function getAllFromIndexedDB(): Promise<Record<string, any>[]> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction('submissions', 'readonly');
		const store = transaction.objectStore('submissions');
		const request = store.getAll();

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

</script> -->

<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { onDestroy, onMount } from 'svelte';

	let isOffline = false;

	// Handle network status
	onMount(() => {
		isOffline = !navigator.onLine;
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);
		checkAndSyncData(); // Sync data if coming online and data exists
	});

	// Cleanup event listeners on destroy
	// onDestroy(() => {
	// 	window.removeEventListener('online', handleOnline);
	// 	window.removeEventListener('offline', handleOffline);
	// });

	// Event handler for coming online
	function handleOnline() {
		isOffline = false;
		checkAndSyncData(); // Sync data when network is restored
	}

	// Event handler for going offline
	function handleOffline() {
		isOffline = true;
	}

	// Open IndexedDB
	async function openDatabase(): Promise<IDBDatabase> {
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

	// Store data in IndexedDB
	async function storeInIndexedDB(data: Record<string, any>): Promise<void> {
		const db = await openDatabase();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction('submissions', 'readwrite');
			const store = transaction.objectStore('submissions');
			const request = store.add(data);

			request.onsuccess = () => resolve();
			request.onerror = (event) => reject((event.target as IDBRequest).error);
		});
	}

	// Get all data from IndexedDB
	async function getAllFromIndexedDB(): Promise<Record<string, any>[]> {
		const db = await openDatabase();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction('submissions', 'readonly');
			const store = transaction.objectStore('submissions');
			const request = store.getAll();

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	// Sync data with the server when online
	async function syncDataToServer() {
		const offlineData = await getAllFromIndexedDB();

		if (offlineData.length > 0) {
			for (const data of offlineData) {
				try {
					// Send data to the server
					await fetch('api/server/submit', {
						method: 'POST',
						body: JSON.stringify(data),
						headers: { 'Content-Type': 'application/json' }
					});
					console.log('Synced data to server:', data);
				} catch (error) {
					console.error('Failed to sync data:', error);
				}
			}

			// Clear IndexedDB after syncing
			const db = await openDatabase();
			const transaction = db.transaction('submissions', 'readwrite');
			const store = transaction.objectStore('submissions');
			store.clear();
		}
	}

	// Check and sync data if online
	async function checkAndSyncData() {
		if (!isOffline) {
			await syncDataToServer();
		}
	}

	// Handle form submission
	onMount(() => {
		const form = document.getElementById('offlineForm');

		form.addEventListener('submit', async (event) => {
			event.preventDefault();

			const formData = new FormData(event.target as HTMLFormElement);
			const data = Object.fromEntries(formData);

			if (isOffline) {
				console.log('Offline. Storing data in IndexedDB.');
				await storeInIndexedDB(data);
			} else {
				console.log('Online. Submitting data directly to the server.');
				await fetch('api/server/submit', {
					method: 'POST',
					body: JSON.stringify(data),
					headers: { 'Content-Type': 'application/json' }
				});
			}
		});
	});
</script>

{#if isOffline}
	<p class="text-center text-red-500">You are offline. Data will be synced when online.</p>
{/if}
<div class="p-4">
	<h1 class="text-2xl font-bold">Personal Information Form</h1>
	<form
		id="offlineForm"
		method="post"
		action="?/submit"
		use:enhance
		class="mt-4 flex flex-col gap-4"
	>
		<div>
			<label for="name" class="block text-sm font-medium">Your Name</label>
			<input
				id="name"
				name="name"
				type="text"
				class="mt-1 w-full rounded-md border border-gray-300 p-2"
				required
			/>
		</div>
		<div>
			<label for="role" class="block text-sm font-medium">Role</label>
			<input
				id="role"
				name="role"
				type="text"
				class="mt-1 w-full rounded-md border border-gray-300 p-2"
				required
			/>
		</div>
		<button type="submit" class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
			Submit
		</button>
	</form>
</div>
