# Validation using superforms

## Topics to be coverd (Features of superforms)

1. Server and client-side validation (Realtime client-side validation)
2. support built-in progressive enhancement (No need to import and `use:enhance` from `$app/forms` or no need to explicitely import it)
3. Auto form field validation based on schema ( client side validation based on zod schema defined for server side validation) `validators: valibotClient(schema)`
4. Can change the schemas `validators: valibot(partialSchema)`
5. Saves form state or form field state ( after navigating to other page and back to form saves the values of variables, or saves state of variables on error in server side)
6. Generates default form values from many validation schemas.
7. Many form can be handled from single page
8. validation for files, arrays and Objects
9. Built in loading spinner.
10. Hook into a number of events for full control over the validation data and the ActionResult, with a possibility to cancel the update at every step.

~~Completed and Uncompleted Tasks~~

## Load method returns form with validating with schemas

```js
import { formDataArray, schema } from '$lib/index';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const user = formDataArray.find((user) => user.id === 1);

	if (!user) {
		return {
			status: 404,
			error: new Error('User not found')
		};
	}

	if (!user) error(404, 'Not found');

	const form = await superValidate(user, zod(schema));

	// Always return { form } in load functions
	return { form };
};
```

> form can return directly or with modifcations for showing errors form API

## in page.svelte for normal form with validation

```js
import {superForm} from 'sveltekit-superforms';
import SuperDebug from 'sveltekit-superforms';
let {data} = $props(); 
const {(form, errors, constraints, message, enhance)} = superForm(data.form);
```

```html
<div>
	<label for="firstName">First Name</label>
	<input
		name="FirstName"
		bind:value={$form.FirstName}
		aria-invalid={$errors.FirstName ? 'true' : undefined}
		{...$constraints.FirstName}
	/>

	{#if $errors.FirstName}
		<p class="mt-1 text-sm text-red-500">{$errors.FirstName}</p>
	{/if}
</div>
```

# Form action

```js
export const actions = {
	create: async ({ request }) => {
		console.log('Form submitted');
		// The adapter must be defined before superValidate for JSON Schema.
		const adapter = zod(schema);
		const form = await superValidate(request, adapter);

		console.log(form);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
};
```

## Client side validation - Custom validation for each filed [Link of documentation](https://superforms.rocks/concepts/client-validation)

**The validate function, deconstructed from superForm, gives you complete control over the validation process for specific fields. Examples of how to use it:**

```js
// Simplest case, validate what's in the field right now
validate('FirstName');

// Validate without updating, for error checking
const nameErrors = await validate('FirstName', { update: false });

// Validate and update field with a custom value
validate('FirstName', { value: 'Test' });

// Validate a custom value, update errors only
validate('FirstName', { value: 'Test', update: 'errors' });

// Validate and update nested data, and also taint the field
validate('FirstName', { value: 'Test', taint: true });
```

_Similar to validate, validateForm lets you validate the whole form and return a SuperValidated result:_

```js
const result = await validateForm();

if (result.valid) {
	// ...
}

// You can use the update option to trigger a client-side validation
await validateForm({ update: true });

// Or the schema option to validate the form partially
const result2 = await validateForm({ schema: zod(partialSchema) });
```

## Error Handling [Link of Documentation](https://superforms.rocks/concepts/error-handling)

[Documentation for Error Handling](https://superforms.rocks/concepts/error-handling)

### Set error to individual field on backend error

```js
if (user.Email === form.data.Email) {
	return setError(form, 'Email', 'E-mail already exists.');
}
```

_Errors added with setError will be removed when a schema is used in client-side validation and the first validation occurs (such as modifying a field)._

---

If no data was posted or sent to superValidate, no errors will be returned unless the errors option in superValidate is true. This is what happens in load functions when the only the schema is sent to superValidate

```js
export const load = async () => {
	// No errors set, since no data is sent to superValidate
	const form = await superValidate(zod(schema));

	// No data, but errors can still be added with an option
	const form2 = await superValidate(zod(schema), { errors: true });
};
```

> errorSelector
> This is the CSS selector used to locate the invalid input fields after form submission. The default is `[aria-invalid="true"],[data-invalid]`, and the first one found in the form will be scrolled to and focused on, depending on the other settings.

> scrollToError
> The `scrollToError` option determines how to scroll to the first error message in the form. smooth and auto are values from Window.scroll. If the non-string options are used, Element.scrollIntoView will be called with the option. This is mostly used with nested scrollbars, in which case Window.scroll won’t work.

---

_Since validation is handled by Superforms, there is no need for spreading `$constraints` on the field. But the biggest win is that there is no need to display `$errors`_

```js
const { form, enhance } = superForm(data.form, {
	customValidity: true,
	// Not required, but will use client-side validation for real-time error display:
	validators: schema
});
```

## Events [Link to Documentation](https://superforms.rocks/concepts/events)

![alt text](ckvef8y8.png)

```js
const { form, enhance } = superForm(data.form, {
  onSubmit: ({ action, formData, formElement, controller, submitter, cancel }) => void
  onResult: ({ result, formEl, cancel }) => void
  onUpdate: ({ form, cancel }) => void
  onUpdated: ({ form }) => void
  onError: (({ result, message }) => void) | 'apply'
})
```

## onSubmit

There are also three extra properties in the Superforms onSubmit event, for more advanced scenarios

### 1. jsonData

If you’re using nested data, the formData property cannot be used to modify the posted data, since $form is serialized and posted instead. If you want to post something else than $form, you can do it with the jsonData function:

### 2. validators

For advanced validation, you can change client-side validators for the current form submission with this function

### 3. customRequest

You can make a custom request with fetch or XMLHttpRequest when submitting the form. The main use case is to display a progress bar when uploading large files.

The customRequest option takes a function that should return a Promise<Response | XMLHttpRequest>. In the case of an XMLHttpRequest, the promise must be resolved after the request is complete. The response body should contain an ActionResult, as any form action does.

## onResult

`onResult: ({ result, formElement, cancel }) => void`

If the submission isn’t cancelled and client-side validation succeeds, the form is posted to the server. It then responds with a SvelteKit ActionResult, triggering the onResult event.

result contains the ActionResult. You can modify it; changes will be applied further down the event chain. formElement is the HTMLFormElement of the form. cancel() is a function which will cancel the rest of the event chain and any form updates.

## onUpdate

onUpdate: ({ form, formElement, cancel, result }) => void
The onUpdate event is triggered right before the form update is being applied, giving you the option to modify the validation result in form, or use cancel() to negate the update altogether. You also have access to the form’s HTMLFormElement with formElement.

If your app is a single-page application, onUpdate is the most convenient to process the form data. See the SPA page for more details.

## onUpdated

`onUpdated: ({ form }) => void`

If you just want to ensure that the form is validated and do something extra afterwards, like showing a toast notification, onUpdated is the easiest way.

The form parameter contains the validation result, and should be considered read-only here, since the stores have updated at this point. Unlike the previous events, $form, $errors and the other stores now contain updated data.

## onError

`onError: (({ result }) => void) | 'apply'`

When the SvelteKit error function is called on the server, you can use the onError event to catch it. result is the error ActionResult, with its error property:

## onChange

The onChange event is not triggered when submitting, but every time $form is modified, both as a html event (when modified with bind:value) and programmatically (direct assignment to $form).

The event is a discriminated union that you can distinguish between using the target property:

## Loading timers / spinners

Just import and define the time of timers

```js
const { form, enhance, submitting, delayed, timeout } = superForm(data.form, {
  delayMs?: 500
  timeoutMs?: 8000
})
```

Use

```js
<script lang="ts">
  const { form, errors, enhance, delayed } = superForm(data.form);
  import spinner from '$lib/assets/spinner.svg';
</script>

<form method="POST" use:enhance>
  <button>Submit</button>
  {#if $delayed}<img src={spinner} />{/if}
</form>
```

## Multiple Form handling by superform

- Define schemas for each form
- Export them from load function

```js
// Different schemas, no id required.
const loginForm = await superValidate(zod(loginSchema));
const registerForm = await superValidate(zod(registerSchema));

// Return them both
return { loginForm, registerForm };
```

- Write different named actions for each of them

```js
export const actions = {
  login: async ({ request }) => {
    const loginForm = await superValidate(request, zod(loginSchema));

    if (!loginForm.valid) return fail(400, { loginForm });

    // TODO: Login user
    return message(loginForm, 'Login form submitted');
  },

  register: async ({ request }) => {
    const registerForm = await superValidate(request, zod(registerSchema));

    if (!registerForm.valid) return fail(400, { registerForm });

    // TODO: Register user
    return message(registerForm, 'Register form submitted');
  }
} satisfies Actions;
```

- in +page.svelte import them seperately by constructing seperate object for each

```js
const {
	form: loginForm,
	errors: loginForm,
	enhance: loginForm,
	message: loginForm
} = superForm(data.loginForm, {
	resetForm: true
});

const {
	form: registerForm,
	errors: registerErrors,
	enhance: registerEnhance,
	message: registerMessage
} = superForm(data.registerForm, {
	resetForm: true
});
```

- binding to variables in html is like

```js
  First Name: <input name="email" type="email" bind:value={$registerForm.email} />
```

```js
 Last Name: <input name="password" type="password" bind:value={$form.password} />
```

# Snapshot

A nice SvelteKit feature is snapshots, which saves and restores data when the user navigates on the site. This is perfect for saving the form state, and with Superforms, you can take advantage of this in one line of code,

> Note that it only works for browser history navigation though.

`export const snapshot = { capture, restore };`

# Submit behavior

When a form is submitted, it’s important for the UX to show that things are happening on the server. Superforms provides you with loading timers and the following options for handling this:

Usage

```js
const { form, enhance } = superForm(data.form, {
  clearOnSubmit: 'message' | 'errors' | 'errors-and-message' | 'none' = 'message'
  multipleSubmits: 'prevent' | 'allow' | 'abort' = 'prevent'
})
```

### clearOnSubmit

The `clearOnSubmit` option decides what should happen to the form when submitting. It can clear the status message, all the errors, both, or none. The default is to clear the message.

If you don’t want any jumping content, which could occur when errors and messages are removed from the DOM, setting it to none can be useful.

### multipleSubmits

This one handles the occurence of multiple form submissions, before a result has been returned.

- When set to the default prevent, the form cannot be submitted again until a result is returned, or the timeout state is reached (see the section about loading timers).
- abort is the next sensible approach, which will cancel the previous request before submitting again.
- Finally, allow will pass through any number of frenetic clicks on the submit button!

## FIle, Object and Array Validation

schemas

```js
export const schema = z.object({
	file: z
		.instanceof(File)
		.refine((file) => file.size <= 2 * 1024 * 1024, 'File must be less than 2MB')
		.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), 'File must be a JPEG or PNG')
});

export const schema = z.object({
	user: z.object({
		name: z.string().min(1, 'Name is required'),
		age: z.number().min(18, 'Age must be 18 or older')
	})
});

export const schema = z.object({
	items: z
		.array(z.string().min(1, 'Item cannot be empty'))
		.min(1, 'At least one item is required')
		.max(5, 'No more than 5 items allowed')
});
```

form for file

```html
<form method="post" enctype="multipart/form-data" use:enhance>
	<label for="file">Upload a file (JPEG/PNG under 2MB):</label>
	<input type="file" name="file" bind:value="{$form.file}" />
	{#if $form.errors.file}
	<p class="error">{$form.errors.file}</p>
	{/if}
	<button type="submit">Submit</button>
</form>
```

form for Object

```html
<form method="post" use:enhance>
	<label for="name">Name:</label>
	<input type="text" name="user.name" bind:value="{$form.user.name}" />
	{#if $form.errors['user.name']}
	<p class="error">{$form.errors['user.name']}</p>
	{/if}

	<label for="age">Age:</label>
	<input type="number" name="user.age" bind:value="{$form.user.age}" />
	{#if $form.errors['user.age']}
	<p class="error">{$form.errors['user.age']}</p>
	{/if}

	<button type="submit">Submit</button>
</form>
```

form for Array

```html
<form method="post" use:enhance>
	<label for="items">Add Items:</label>
	{#each $form.items as item, index}
	<div>
		<input type="text" name="items[]" bind:value="{$form.items[index]}" />
	</div>
	{/each} {#if $form.errors.items}
	<p class="error">{$form.errors.items}</p>
	{/if}

	<button type="button" on:click="{()" ="">$form.items.push('')}>Add Item</button>
	<button type="submit">Submit</button>
</form>
```
