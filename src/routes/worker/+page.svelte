<script lang="ts">
	import { onMount } from 'svelte';
	import { storeInIndexedDB, getAllFromIndexedDB, clearIndexedDB } from '$lib/utils/indexedDBUtils';
	import { enhance } from '$app/forms';
	// import { enhance } from '@superform/svelte';

	let isOffline = !navigator.onLine;
	let syncStatus: 'idle' | 'success' | 'error' = 'idle';
	const formName = 'personalInformationForm';

	// Use compatible timeout type
	let syncTimeout: ReturnType<typeof setTimeout>;

	if (navigator.serviceWorker) {
		navigator.serviceWorker.register('service-worker.js');
	}

	onMount(() => {
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', () => (isOffline = true));
		checkAndSyncData();
	});

	async function handleOnline() {
		isOffline = false;
		clearTimeout(syncTimeout);
		syncTimeout = setTimeout(async () => {
			await checkAndSyncData();
		}, 1000); // Debounced sync
	}

	async function submitForm(event: Event) {
		event.preventDefault();
		const formElement = event.target as HTMLFormElement;
		const formData = new FormData(formElement);
		const data = Object.fromEntries(formData.entries());

		if (isOffline) {
			await storeInIndexedDB(formName, data);
		} else {
			formElement.submit();
		}
	}

	async function checkAndSyncData() {
		const offlineData = await getAllFromIndexedDB(formName);
		if (offlineData.length > 0) {
			try {
				for (const data of offlineData) {
					await fetch('/api/server/submit', {
						method: 'POST',
						body: JSON.stringify(data),
						headers: { 'Content-Type': 'application/json' },
					});
				}
				await clearIndexedDB(formName);
				syncStatus = 'success';
			} catch (error) {
				syncStatus = 'error';
				console.error('Failed to sync data:', error);
			}
		}
	}
</script>

{#if isOffline}
	<p class="text-center text-red-500">You are offline. Data will sync when back online.</p>
{:else if syncStatus === 'error'}
	<p class="text-center text-red-500">Sync failed. Retrying...</p>
{:else if syncStatus === 'success'}
	<p class="text-center text-green-500">All data synced successfully!</p>
{/if}

<div class="p-4">
	<h1 class="text-2xl font-bold">Personal Information Form</h1>
	<form
		use:enhance
		method="POST"
		action="?/submit"
		onsubmit={submitForm}
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
