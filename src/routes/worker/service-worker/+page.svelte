<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { storeInIndexedDB, getAllFromIndexedDB, clearIndexedDB } from '$lib/utils/indexedDBUtils';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { workerSchema } from '$lib';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	let isOffline = $state();
	const formName = 'anotherForm';
	let hasUnsavedChanges = false; // Tracks unsaved changes

	// Original data for reset purposes
	let originalData = {
		email: data.form.data.email,
		age: data.form.data.age
	};

	// Initialize form and enhance with superforms
	const { form, enhance, constraints, validate, validateForm, message, errors } = superForm(
		data.form,
		{
			validationMethod: 'oninput',
			validators: zodClient(workerSchema),
			errorSelector: '[aria-invalid="true"],[data-invalid]',
			scrollToError: 'smooth',
			autoFocusOnError: 'detect',
			customValidity: true
		}
	);

	// Check for offline state and sync data
	onMount(() => {
		isOffline = !navigator.onLine;
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', () => (isOffline = true));
		window.addEventListener('beforeunload', confirmNavigation);

		beforeNavigate(({ cancel }) => {
			if (hasUnsavedChanges && !confirm('You have unsaved changes. Do you really want to leave?')) {
				cancel();
			}
		});

		checkAndSyncData();
	});

	// Clean up listeners
	// onDestroy(() => {
	// 	window.removeEventListener('beforeunload', confirmNavigation);
	// 	window.removeEventListener('online', handleOnline);
	// 	window.removeEventListener('offline', () => (isOffline = true));
	// });

	// Handle form changes to track unsaved changes
	function handleFormChange() {
		hasUnsavedChanges = true;
	}

	// Confirm navigation or window closure
	function confirmNavigation(event: BeforeUnloadEvent) {
		// event.preventDefault();
		if (hasUnsavedChanges) {
			const message = 'You have unsaved changes. Do you really want to leave?';
			event.returnValue = message; // Required for some browsers
			return message;
		}
	}

	async function handleOnline() {
		isOffline = false;
		await checkAndSyncData();
	}

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
			formElement.submit();
		}

		hasUnsavedChanges = false; // Reset unsaved changes after successful submission
	}

	async function checkAndSyncData() {
		const offlineData = await getAllFromIndexedDB(formName);
		if (offlineData.length > 0) {
			for (const data of offlineData) {
				try {
					await fetch('/api/server/submit/submitForm', {
						method: 'POST',
						body: JSON.stringify(data),
						headers: { 'Content-Type': 'application/json' }
					});
				} catch (error) {
					console.error('Failed to sync data:', error);
				}
			}
			await clearIndexedDB(formName);
		}
	}

	function resetForm() {
		form.set({ ...originalData });
		hasUnsavedChanges = false; // Reset unsaved changes when form is reset
	}

	const init = () => {
		originalData.age = data.form.data.age;
		originalData.email = data.form.data.email;
	};

	afterNavigate(() => {
		init();
	});
</script>

{#if isOffline}
	<p class="text-center text-red-500">You are offline. Data will sync when back online.</p>
{/if}

<div class="p-4">
	<h1 class="text-2xl font-bold">Another Form</h1>
	<form
		use:enhance
		method="POST"
		action="?/another"
		onsubmit={submitForm}
		onchange={handleFormChange}
		class="mt-4 flex flex-col gap-4"
	>
		<div>
			<label for="email" class="block text-sm font-medium">Your Email</label>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="Enter email"
				class="mt-1 w-full rounded-md border border-gray-300 p-2"
				required
				bind:value={$form.email}
				aria-invalid={$errors.email ? 'true' : undefined}
				{...$constraints.email}
			/>
		</div>
		<div>
			<label for="age" class="block text-sm font-medium">Your Age</label>
			<input
				id="age"
				name="age"
				type="number"
				placeholder="Enter your age"
				class="mt-1 w-full rounded-md border border-gray-300 p-2"
				required
				bind:value={$form.age}
				aria-invalid={$errors.age ? 'true' : undefined}
				{...$constraints.age}
			/>
		</div>
		<button type="submit" class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
			Submit
		</button>
	</form>
</div>
