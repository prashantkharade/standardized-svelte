<script lang="ts">
	import { onMount } from 'svelte';
	import { storeInIndexedDB, getAllFromIndexedDB, clearIndexedDB } from '$lib/utils/indexedDBUtils';
	import { afterNavigate } from '$app/navigation';
	import { workerSchema } from '$lib';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	let isOffline = $state();
	const formName = 'anotherForm';

	onMount(() => {
		isOffline = !navigator.onLine;
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', () => (isOffline = true));
		checkAndSyncData();
	});

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

	let originalData = {
		email: data.form.data.email,
		age: data.form.data.age
	};

	const { form, enhance, constraints, validate, validateForm, message, errors } = superForm(
		data.form,
		{
			//   validators: ClientValidationAdapter<S> | 'clear' | false,
			validationMethod: 'oninput',
			//   customValidity: boolean = false
			validators: zodClient(workerSchema),
			errorSelector: '[aria-invalid="true"],[data-invalid]',
			scrollToError: 'smooth',
			autoFocusOnError: 'detect',
			stickyNavbar: undefined,
			customValidity: true
		}
	);

	function resetForm() {
		form.set({ ...originalData });
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
		method="post"
		action="?/another"
		onsubmit={submitForm}
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
				placeholder="Enter Your age"
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
