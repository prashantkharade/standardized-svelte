# Form Validation and Handling in Svelte 5

This document explains best practices for client-side form validation and handling in Svelte 5, with examples covering a variety of topics such as `use:enhance`, `stopPropagation`, and `preventDefault`. These techniques are aimed at creating user-friendly and error-proof forms that do not reload or reset unnecessarily upon submission.

---

## Topics Covered

1. Client-side Validation
2. Preventing Form Reset or Reload
3. Avoiding Empty Form Submissions
4. Proper Form Handling
   - Input binding
   - Error handling
5. Advanced Techniques:
   - `use:enhance`
   - `stopPropagation`
   - `preventDefault`
   - Other Svelte 5 features

---

## 1. Client-side Validation

### Client-Side Form Handling Without Stores

```svelte
<script lang="ts">
	let formData = {
		title: '',
		description: '',
		type: '',
		currentVersion: '',
		defaultSectionNumbering: false
	};

	let errors = {
		title: '',
		description: '',
		type: '',
		currentVersion: ''
	};

	const validate = () => {
		let tempErrors = { title: '', description: '', type: '', currentVersion: '' };

		if (!formData.title) {
			tempErrors.title = 'Title is required';
		} else if (formData.title.length < 5) {
			tempErrors.title = 'Title must be at least 5 characters';
		}

		if (!formData.description) {
			tempErrors.description = 'Description is required';
		} else if (formData.description.length < 10) {
			tempErrors.description = 'Description must be at least 10 characters';
		}

		if (!formData.type) {
			tempErrors.type = 'Type is required';
		}

		if (formData.currentVersion && isNaN(Number(formData.currentVersion))) {
			tempErrors.currentVersion = 'Current Version must be a number';
		}

		errors = tempErrors;
		return !Object.values(tempErrors).some((error) => error);
	};

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		if (validate()) {
			console.log('Form Submitted', formData);
		}
	};
</script>

<form class="space-y-4" on:submit={handleSubmit}>
	<div>
		<label for="title" class="block text-sm font-medium">Title</label>
		<input
			id="title"
			type="text"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			bind:value={formData.title}
		/>
		{#if errors.title}
			<p class="text-red-500 text-sm mt-1">{errors.title}</p>
		{/if}
	</div>

	<div>
		<label for="description" class="block text-sm font-medium">Description</label>
		<textarea
			id="description"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			bind:value={formData.description}
		></textarea>
		{#if errors.description}
			<p class="text-red-500 text-sm mt-1">{errors.description}</p>
		{/if}
	</div>

	<div>
		<label for="type" class="block text-sm font-medium">Type</label>
		<input
			id="type"
			type="text"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			bind:value={formData.type}
		/>
		{#if errors.type}
			<p class="text-red-500 text-sm mt-1">{errors.type}</p>
		{/if}
	</div>

	<div>
		<label for="currentVersion" class="block text-sm font-medium">Current Version</label>
		<input
			id="currentVersion"
			type="text"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			bind:value={formData.currentVersion}
		/>
		{#if errors.currentVersion}
			<p class="text-red-500 text-sm mt-1">{errors.currentVersion}</p>
		{/if}
	</div>

	<button
		type="submit"
		class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-500"
	>
		Submit
	</button>
</form>
```

### Using Writable Stores

```svelte
<script>
	import { writable } from 'svelte/store';

	let formData = writable({
		title: '',
		description: '',
		type: '',
		currentVersion: '',
		defaultSectionNumbering: false
	});

	let errors = writable({
		title: '',
		description: '',
		type: '',
		currentVersion: ''
	});

	const validate = () => {
		let tempErrors = { title: '', description: '', type: '', currentVersion: '' };
		let data = $formData;

		if (!data.title) {
			tempErrors.title = 'Title is required';
		} else if (data.title.length < 5) {
			tempErrors.title = 'Title must be at least 5 characters';
		}

		if (!data.description) {
			tempErrors.description = 'Description is required';
		} else if (data.description.length < 10) {
			tempErrors.description = 'Description must be at least 10 characters';
		}

		if (!data.type) {
			tempErrors.type = 'Type is required';
		}

		if (data.currentVersion && isNaN(Number(data.currentVersion))) {
			tempErrors.currentVersion = 'Current Version must be a number';
		}

		errors.set(tempErrors);
		return !Object.values(tempErrors).some((error) => error);
	};

	const handleSubmit = (event) => {
		if (!validate()) {
			event.preventDefault();
		}
	};
</script>

<form on:submit={handleSubmit}>
	<label for="title">Title</label>
	<input type="text" id="title" bind:value={$formData.title} required />
	{#if $errors.title}<span>{$errors.title}</span>{/if}

	<label for="description">Description</label>
	<textarea id="description" bind:value={$formData.description}></textarea>
	{#if $errors.description}<span>{$errors.description}</span>{/if}

	<button type="submit">Submit</button>
</form>
```

---

## 2. Preventing Form Reset or Reload

### Using `preventDefault`

```svelte
<script>
	const handleSubmit = (event) => {
		event.preventDefault(); // Prevent default form submission
		console.log('Form submitted!');
	};
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="text" placeholder="Enter something" />
	<button type="submit">Submit</button>
</form>
```

---

## 3. Avoiding Empty Form Submissions

Ensure all required fields are validated before submission:

```svelte
<script>
	let formData = { name: '', email: '' };
	let errors = {};

	const validate = () => {
		errors = {};

		if (!formData.name) {
			errors.name = 'Name is required';
		}

		if (!formData.email) {
			errors.email = 'Email is required';
		}

		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (validate()) {
			console.log('Form data:', formData);
		}
	};
</script>

<form on:submit={handleSubmit}>
	<label for="name">Name</label>
	<input id="name" type="text" bind:value={formData.name} />
	{#if errors.name}<span>{errors.name}</span>{/if}

	<label for="email">Email</label>
	<input id="email" type="email" bind:value={formData.email} />
	{#if errors.email}<span>{errors.email}</span>{/if}

	<button type="submit">Submit</button>
</form>
```

---

## 4. Proper Form Handling

### Code for Form Reset

```svelte
<script>
	let formData = { title: '', description: '' };

	const resetForm = () => {
		formData = { title: '', description: '' };
	};
</script>

<form>
	<input type="text" bind:value={formData.title} placeholder="Title" />
	<textarea bind:value={formData.description} placeholder="Description"></textarea>

	<button type="button" on:click={resetForm}>Reset</button>
</form>
```

### Binding and Error Display

```svelte
<script>
	let formData = { title: '', description: '' };
	let errors = { title: '', description: '' };
</script>

<form>
	<label for="title">Title</label>
	<input type="text" id="title" bind:value={formData.title} />
	{#if errors.title}<span>{errors.title}</span>{/if}

	<label for="description">Description</label>
	<textarea id="description" bind:value={formData.description}></textarea>
	{#if errors.description}<span>{errors.description}</span>{/if}
</form>
```

---

## 5. Advanced Techniques

### `use:enhance`

The `use:enhance` directive can improve form handling by making it progressive, allowing for enhanced user experiences without full page reloads. This technique enables forms to handle submissions asynchronously.

The `use:enhance` directive provides a powerful way to intercept form events, modify data, and perform custom actions before, during, and after form submission. It allows you to create more dynamic and interactive forms.

```svelte
<script>
	export let formAction;
</script>

<form
	method="post"
	action={formAction}
	use:enhance={() => {
		return async ({ action, result }) => {
			console.log('Form enhanced:', action, result);
		};
	}}
>
	<input type="text" name="name" placeholder="Name" />
	<button type="submit">Submit</button>
</form>
```

or this is for seperate API call

```svelte
<form
	use:enhance={() => {
		return async ({ action, result }) => {
			if (action === 'submit') {
				// Validate form data here
				if (validate()) {
					// Submit form data to the server
					await fetch('/submit-form', {
						method: 'POST',
						body: JSON.stringify(formData)
					});
				} else {
					// Handle validation errors
					console.error('Validation failed');
				}
			}
		};
	}}
></form>
```

### `stopPropagation`

This technique stops event propagation, preventing parent handlers from being notified of the event. It’s useful when you want to manage events locally without affecting other parts of your application.

```svelte
<button on:click|stopPropagation={() => console.log('Click stopped!')}> Click me </button>
```

In this example, clicking the button will only log "Button clicked" to the console, as the event is stopped from propagating to the parent div.

### `preventDefault`

The `preventDefault` method prevents the default browser behavior for events like clicks on links or submitting forms. This allows developers to control how events are handled and improve user experience, and `preventDefault` modifier prevents the default browser behavior for an event. This is commonly used to prevent form submission or link navigation.

```svelte
<a href="#" on:click|preventDefault={() => console.log('Default prevented!')}> Click me </a>
```

This link will not navigate to the specified URL, but you can use JavaScript to perform custom actions, such as opening a new tab or triggering a different event

---

## 6. Validation on each input

calling the function for each input (Validation on event)

```svelte
	let inputElement: any;

	function validateInput(event: Event) {
		const value = event.target.value;
		console.log(value);

		if (value === '') {
			inputElement.setCustomValidity('Name cannot be empty');
		}else if(value.length <= 3){
			inputElement.setCustomValidity('Enter value greater than 3');
		}
		else if(value.length > 10){
			inputElement.setCustomValidity('Too much value for required length i.e.10');
		}else {
			inputElement.setCustomValidity('');
		}
	}
	<div>
		<label for="name">Name:</label>
		<input
			type="text"
			id="name"
			name="name"
			value={form?.data?.name ?? ''}
			maxlength="10"
			bind:this={inputElement}
			on:input={validateInput}

		/>
		<label for="name" class="error">
			{#if form?.errors?.name}
				<span>{form?.errors?.name}</span>
			{/if}
		</label>
	</div>
```

Customize the validation on calling the functions

```html
const onNameChange = (e: Event) => {
        name = (e.target as HTMLInputElement).value;
        name = CaseConverter.pascalCase(name);
        if (modelName.length < 3) {
            return;
        }
    };

            <div class="form-control">
            <label
                class="label"
                for="name"
            >
                <span class="label-text">Name *</span>
            </label>
            <input
                type="text"
                placeholder="Type here"
                class="input"
                name="name"
                id="name"
                bind:value={name}
                on:input={onNameChange}
                required
            />
            {#if form?.validationErrors?.name}
                <p class="text-red-500 text-sm">{form?.validationErrors?.name[0]}</p>
            {/if}
        </div>
```
