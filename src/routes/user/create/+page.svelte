<!-- <script lang="ts">
	export let data;
	console.log(data);
	// export let formData: {
	// 	FirstName: string;
	// 	LastName: string;
	// 	CountryCode: string;
	// 	Phone: string;
	// 	Email: string;
	// 	Username: string;
	// 	Password: string;
	// };
	let formData = {
		FirstName: '',
		LastName: '',
		CountryCode: '',
		Phone: '',
		Email: '',
		Username: '',
		Password: ''
	};
	let formData_ = {
		FirstName: '',
		LastName: '',
		CountryCode: '',
		Phone: '',
		Email: '',
		Username: '',
		Password: ''
	};

	let errors = {
		FirstName: '',
		LastName: '',
		CountryCode: '',
		Phone: '',
		Email: '',
		Username: '',
		Password: ''
	};

	// Reactive validation for each field
	$: validateFirstname();
	$: validateLastname();
	$: validateCountryCode();
	$: formData.CountryCode && validatePhone();
	$: validateEmail();
	$: validateUsername();
	$: validatePassword();

	// CountryCode-based logic: Show/Hide Phone field
	$: showPhoneField = !!formData.CountryCode;

	// Individual validation methods
	const validateFirstname = () => {
		errors.FirstName = formData.FirstName.trim() ? '' : 'First name is required.';
	};

	const validateLastname = () => {
		errors.LastName = formData.LastName.trim() ? '' : 'Last name is required.';
	};

	const validateCountryCode = () => {
		errors.CountryCode = /^\d+$/.test(formData.CountryCode.trim()) ? '' : 'Invalid country code.';
	};

	const validatePhone = () => {
		errors.Phone = /^\d+$/.test(formData.Phone.trim()) ? '' : 'Invalid phone number.';
	};

	const validateEmail = () => {
		const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		errors.Email = emailRegex.test(formData.Email.trim()) ? '' : 'Invalid email address.';
	};

	const validateUsername = () => {
		errors.Username = formData.Username.trim() ? '' : 'Username is required.';
	};

	const validatePassword = () => {
		errors.Password =
			formData.Password.length >= 6 ? '' : 'Password must be at least 6 characters long.';
	};

	const validateForm = () => {
		return !Object.values(errors).some((error) => error !== '');
	};

	// Handle form submission
	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (validateForm()) {
			console.log('Form Data:', formData);
		} else {
			console.log('Validation errors:', errors);
		}
	};
</script>

<div class="mx-auto max-w-lg rounded-md bg-white p-6 shadow-md">
	<h2 class="mb-4 text-2xl font-bold">User Information Form</h2>
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div>
			<label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
			<input
				type="text"
				bind:value={formData.FirstName}
				placeholder="Enter first name"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				on:input={validateFirstname}
			/>
			{#if errors.FirstName}
				<p class="mt-1 text-sm text-red-500">{errors.FirstName}</p>
			{/if}
		</div>

		<div>
			<label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
			<input
				type="text"
				bind:value={formData.LastName}
				placeholder="Enter last name"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				on:input={validateLastname}
			/>
			{#if errors.LastName}
				<p class="mt-1 text-sm text-red-500">{errors.LastName}</p>
			{/if}
		</div>

		<div>
			<label for="countryCode" class="block text-sm font-medium text-gray-700">Country Code</label>
			<input
				type="text"
				bind:value={formData.CountryCode}
				placeholder="91"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				on:input={validateCountryCode}
			/>
			{#if errors.CountryCode}
				<p class="mt-1 text-sm text-red-500">{errors.CountryCode}</p>
			{/if}
		</div>

		{#if showPhoneField}
			<div>
				<label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
				<input
					type="tel"
					bind:value={formData.Phone}
					placeholder="Enter phone number"
					class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					on:input={validatePhone}
				/>
				{#if errors.Phone}
					<p class="mt-1 text-sm text-red-500">{errors.Phone}</p>
				{/if}
			</div>
		{/if}

		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<input
				type="email"
				bind:value={formData.Email}
				placeholder="Enter email address"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				on:input={validateEmail}
			/>
			{#if errors.Email}
				<p class="mt-1 text-sm text-red-500">{errors.Email}</p>
			{/if}
		</div>

		<div>
			<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
			<input
				type="text"
				bind:value={formData.Username}
				placeholder="Enter username"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				on:input={validateUsername}
			/>
			{#if errors.Username}
				<p class="mt-1 text-sm text-red-500">{errors.Username}</p>
			{/if}
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
			<input
				type="password"
				bind:value={formData.Password}
				placeholder="Enter password"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				on:input={validatePassword}
			/>
			{#if errors.Password}
				<p class="mt-1 text-sm text-red-500">{errors.Password}</p>
			{/if}
		</div>

		<button class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
			Reset
		</button>
		<button
			type="submit"
			class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
		>
			Submit
		</button>
	</form>
</div> -->

<!-- <script lang="ts">
	import { onMount } from 'svelte';
	import { errors, FormDataHandler } from './helper';
	import type { PageServerData } from './$types';
	import { beforeNavigate } from '$app/navigation';

	export let data: PageServerData;

	const formDataHandler = new FormDataHandler(data.user);

	let currentData = { ...formDataHandler._currentData };

	const init = () => {
		formDataHandler.setData(data.user);
		currentData = { ...formDataHandler._currentData };
	};

	onMount(() => {
		console.log('this is onMount');
		init();
	});

	beforeNavigate(() => {
		console.log('this is beforeNavigate');
		init();
		
	})

	const resetForm = () => {
		formDataHandler.resetData();
		currentData = { ...formDataHandler._currentData };
		// validateForm();
		Object.keys(errors).forEach((key) => (errors[key] = ''));
	};

	const validateFirstname = () => {
		errors.FirstName =
			currentData.FirstName.trim().length > 5 ? '' : 'First name must be at least 5 characters.';
	};

	const validateLastname = () => {
		errors.LastName = currentData.LastName.trim() ? '' : 'Last name is required.';
	};

	const validateCountryCode = () => {
		errors.CountryCode = /^\d+$/.test(currentData.CountryCode.trim())
			? ''
			: 'Invalid country code.';
	};

	const validatePhone = () => {
		errors.Phone = /^\d+$/.test(currentData.Phone.trim()) ? '' : 'Invalid phone number.';
	};

	const validateEmail = () => {
		const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		errors.Email = emailRegex.test(currentData.Email.trim()) ? '' : 'Invalid email address.';
	};

	const validateUsername = () => {
		errors.Username = currentData.Username.trim() ? '' : 'Username is required.';
	};

	const validatePassword = () => {
		errors.Password =
			currentData.Password.length >= 6 ? '' : 'Password must be at least 6 characters.';
	};

	const validateForm = () => {
		validateFirstname();
		validateLastname();
		validateCountryCode();
		validatePhone();
		validateEmail();
		validateUsername();
		validatePassword();

		const hasErrors = Object.values(errors).some((error) => error !== '');

		if (!hasErrors) {
			console.log('Form Submitted Successfully:', currentData);
			alert('Form submitted successfully!');
			resetForm();
		} else {
			console.log('Validation Failed:', errors);
			alert('Please fix the errors before submitting the form.');
		}
	};
</script>

<div class="mx-auto max-w-lg rounded-md bg-white p-6 shadow-md">
	<h2 class="mb-4 text-2xl font-bold">User Information Form</h2>
	<form class="space-y-4" on:submit|preventDefault={validateForm}>
		<div>
			<label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
			<input
				type="text"
				bind:value={currentData.FirstName}
				on:input={validateFirstname}
				placeholder="Enter first name"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
			/>
			{#if errors.FirstName}
				<p class="mt-1 text-sm text-red-500">{errors.FirstName}</p>
			{/if}
		</div>

		<div>
			<label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
			<input
				type="text"
				bind:value={currentData.LastName}
				on:input={validateLastname}
				placeholder="Enter last name"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
			/>
			{#if errors.LastName}
				<p class="mt-1 text-sm text-red-500">{errors.LastName}</p>
			{/if}
		</div>

		<div>
			<label for="countryCode" class="block text-sm font-medium text-gray-700">Country Code</label>
			<input
				type="text"
				bind:value={currentData.CountryCode}
				on:input={validateCountryCode}
				placeholder="Enter country code"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
			/>
			{#if errors.CountryCode}
				<p class="mt-1 text-sm text-red-500">{errors.CountryCode}</p>
			{/if}
		</div>

		<div>
			<label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
			<input
				type="tel"
				bind:value={currentData.Phone}
				on:input={validatePhone}
				placeholder="Enter phone number"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
			/>
			{#if errors.Phone}
				<p class="mt-1 text-sm text-red-500">{errors.Phone}</p>
			{/if}
		</div>

		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<input
				type="email"
				bind:value={currentData.Email}
				on:input={validateEmail}
				placeholder="Enter email"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
			/>
			{#if errors.Email}
				<p class="mt-1 text-sm text-red-500">{errors.Email}</p>
			{/if}
		</div>

		<div>
			<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
			<input
				type="text"
				bind:value={currentData.Username}
				on:input={validateUsername}
				placeholder="Enter username"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
			/>
			{#if errors.Username}
				<p class="mt-1 text-sm text-red-500">{errors.Username}</p>
			{/if}
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
			<input
				type="password"
				bind:value={currentData.Password}
				on:input={validatePassword}
				placeholder="Enter password"
				class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
			/>
			{#if errors.Password}
				<p class="mt-1 text-sm text-red-500">{errors.Password}</p>
			{/if}
		</div>

		<div class="flex justify-between space-x-2">
			<button
				type="button"
				on:click={resetForm}
				class="w-1/2 rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
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
</div> -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { schema, formDataArray } from '$lib';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { valibotClient, valibot, zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	let { data } = $props();

	// console.log(formDataArray_);
	//you can also set the option to 'clear', to remove errors for a field as soon as it’s modified.
	const { form, enhance, constraints, validate, validateForm, message, errors } = superForm(
		data.form,
		{
			//   validators: ClientValidationAdapter<S> | 'clear' | false,
			validationMethod: 'oninput',
			//   customValidity: boolean = false
			validators: zodClient(schema), // Required option for validate to work
			errorSelector: '[aria-invalid="true"],[data-invalid]',
			scrollToError: 'smooth',
			autoFocusOnError: 'detect',
			stickyNavbar: undefined,
			customValidity: true
			// customValidity: false
			// Validate a custom value, update errors only
		}
	);
	// validate('FirstName', { value: formDataArray_.FirstName_, update: 'errors' });
	// validate('LastName', { value: formDataArray_.LastName_, update: 'errors' });

	function selectedUser(id: string) {
		const user = formDataArray.find((user) => user.id === id);
		if (user) {
			goto(`/user/create/${user.id}`);
		}
	}
</script>

<!-- <SuperDebug data={$form} /> -->

<div class="flex">
	<!-- User List -->
	<div class="w-1/4 bg-gray-100 p-4">
		<h3 class="mb-4 text-lg font-bold">Users</h3>
		<ul>
			{#each formDataArray as user}
				<li>
					<button
						class="cursor-pointer rounded-md p-2 hover:bg-blue-100"
						onclick={() => selectedUser(user.id)}
					>
						{user.FirstName}
						{user.LastName}
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="mx-auto max-w-lg rounded-md bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-bold">User Information Form</h2>
		{#if $message}<h3 class="text-bold text-blue-600">{$message}</h3>{/if}
		<form class="space-y-4" method="post" use:enhance action="?/create">
			<div>
				<label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
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
				<label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
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
				<label for="countryCode" class="block text-sm font-medium text-gray-700">Country Code</label
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
				<label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
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
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
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
				<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
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
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
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
