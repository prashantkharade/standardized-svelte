<!--
Form page.svelte 'script' section structure 
    // Importing required modules
    // Getting page server data
    // Page params based values
    // Page title setting
    // Define form variable and all required local varialbles
    // Define Form data handler
    // Define init function
    // On mount function
    // After navigate function
    // Update breadcrumbs function
    // Define reactive staments (In Svelte 5, define them through Runes)
-->
<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { schema, formDataArray } from '$lib';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	// import type { PageServerData } from '../$types';

	let { data } = $props();
	// let data:PageServerData;
	import { onMount } from 'svelte';
	import { storeInIndexedDB, getAllFromIndexedDB, clearIndexedDB } from '$lib/utils/indexedDBUtils';
	// import { enhance } from '$app/forms';

	let isOffline = false;
	const formName = 'UserAccountForm';
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

	let originalData = {
		FirstName: data.form.data.FirstName,
		LastName: data.form.data.LastName,
		CountryCode: data.form.data.CountryCode,
		Phone: data.form.data.Phone,
		Email: data.form.data.Email,
		Username: data.form.data.Username,
		Password: data.form.data.Password
	};

	const { form, enhance, constraints, validate, validateForm, message, errors } = superForm(
		data.form,
		{
			//   validators: ClientValidationAdapter<S> | 'clear' | false,
			validationMethod: 'oninput',
			//   customValidity: boolean = false
			validators: zodClient(schema),
			errorSelector: '[aria-invalid="true"],[data-invalid]',
			scrollToError: 'smooth',
			autoFocusOnError: 'detect',
			stickyNavbar: undefined,
			customValidity: true
		}
	);

	// Function to reset form to its original values
	function resetForm() {
		form.set({ ...originalData }); // Clone original data into the form
	}

	const init = () => {
		const userId = page.params.userId;
		console.log('userId', userId);

		originalData.FirstName = data.form.data.FirstName;
		originalData.LastName = data.form.data.LastName;
		originalData.CountryCode = data.form.data.CountryCode;
		originalData.Phone = data.form.data.Phone;
		originalData.Email = data.form.data.Email;
		originalData.Username = data.form.data.Username;
		originalData.Password = data.form.data.Password;
	};

	afterNavigate(() => {
		init();
	});

	// Function to populate form with user data
	function loadUserData(user: any) {
		goto(`/user/create/${user.id}`);
		// form.set({
		// 	FirstName: user.FirstName || '',
		// 	LastName: user.LastName || '',
		// 	CountryCode: user.CountryCode || '',
		// 	Phone: user.Phone || '',
		// 	Email: user.Email || '',
		// 	Username: user.Username || '',
		// 	Password: '' // Optionally reset the password
		// });
	}
</script>

<div class="flex">
	<div class="w-1/6 bg-gray-100 p-4">
		<h3 class="mb-4 text-lg font-bold">Users</h3>
		<ul>
			{#each formDataArray as user}
				<li>
					<button
						class="cursor-pointer rounded-md p-2 hover:bg-blue-100"
						onclick={() => loadUserData(user)}
					>
						{user.FirstName}
						{user.LastName}
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="m-4 mx-auto w-full max-w-2xl rounded-md border bg-gray-100 p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-bold">User Information Form</h2>

		{#if $message}<h3 class="text-bold text-blue-600">{$message}</h3>{/if}

		<form
			class="w-full space-y-4"
			method="post"
			use:enhance
			action="?/create"
			onsubmit={submitForm}
		>
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

			<div>
				<label for="LastName" class="block text-sm font-medium text-gray-700">Last Name</label>
				<input
					type="text"
					placeholder="Enter last name"
					class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					name="LastName"
					bind:value={$form.LastName}
					aria-invalid={$errors.LastName ? 'true' : undefined}
					{...$constraints.LastName}
				/>
				{#if $errors.LastName}
					<p class="mt-1 text-sm text-red-500">{$errors.LastName}</p>
				{/if}
			</div>

			<div>
				<label for="CountryCode" class="block text-sm font-medium text-gray-700">Country Code</label
				>
				<input
					type="text"
					placeholder="Enter country code"
					class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					name="CountryCode"
					bind:value={$form.CountryCode}
					aria-invalid={$errors.CountryCode ? 'true' : undefined}
					{...$constraints.CountryCode}
				/>
				{#if $errors.CountryCode}
					<p class="mt-1 text-sm text-red-500">{$errors.CountryCode}</p>
				{/if}
			</div>

			<div>
				<label for="Phone" class="block text-sm font-medium text-gray-700">Phone</label>
				<input
					name="Phone"
					type="number"
					placeholder="Enter phone number"
					class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					bind:value={$form.Phone}
					aria-invalid={$errors.Phone ? 'true' : undefined}
					{...$constraints.Phone}
				/>
				{#if $errors.Phone}
					<p class="mt-1 text-sm text-red-500">{$errors.Phone}</p>
				{/if}
			</div>

			<div>
				<label for="Email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					name="Email"
					type="email"
					placeholder="Enter email"
					class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					bind:value={$form.Email}
					aria-invalid={$errors.Email ? 'true' : undefined}
					{...$constraints.Email}
				/>
				{#if $errors.Email}
					<p class="mt-1 text-sm text-red-500">{$errors.Email}</p>
				{/if}
			</div>

			<div>
				<label for="Username" class="block text-sm font-medium text-gray-700">Username</label>
				<input
					name="Username"
					type="text"
					placeholder="Enter username"
					class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					bind:value={$form.Username}
					aria-invalid={$errors.Username ? 'true' : undefined}
					{...$constraints.Username}
				/>
				{#if $errors.Username}
					<p class="mt-1 text-sm text-red-500">{$errors.Username}</p>
				{/if}
			</div>

			<div>
				<label for="Password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					name="Password"
					type="password"
					placeholder="Enter password"
					class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					bind:value={$form.Password}
					aria-invalid={$errors.Password ? 'true' : undefined}
					{...$constraints.Password}
				/>
				{#if $errors.Password}
					<p class="mt-1 text-sm text-red-500">{$errors.Password}</p>
				{/if}
			</div>

			<div class="flex justify-between space-x-2">
				<button
					type="button"
					class="w-1/2 rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
					onclick={resetForm}
				>
					Reset
				</button>
				<button
					type="submit"
					class="w-1/2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
					Submit
				</button>
			</div>
		</form>
	</div>
</div>
