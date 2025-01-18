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

# Script Section

## Import all the required modules

## Get pageServerData

`let { data }: { data: PageData } = $props();`

`let { data }: { data: PageServerData } = $props();`

or commomly

`//let { data } = $props();`

## Get page params

They should be in const
`//const userId = $page.params.userId`

## Setting page title

`//data.title = 'Model - List Of Columns';`

## Define form variable and all required local variables

## Define Form data handler

getting form from data and setting the client-side validation on form and all errors setting for form.
in case of superforms:

```js
const { form, enhance, constraints, validate, validateForm, message, errors } = superForm(
	data.form,
		{
		    validators: ClientValidationAdapter<S> | 'clear' | false,
			validationMethod: 'oninput',
			validators: zodClient(schema),
			errorSelector: '[aria-invalid="true"],[data-invalid]',
			scrollToError: 'smooth',
			autoFocusOnError: 'detect',
			stickyNavbar: undefined,
			customValidity: true
		}
);
```

## Define init() function

```js
const init = () => {
	formDataHandler.setData(data.user);
	currentData = { ...formDataHandler._currentData };
};
```

## Define onMount() function

```js
onMount(() => {
	console.log('This is onMount');
	init();
});
```

## Define beforeNavigate() and afterNavigate() function (If necessary)

> Use beforeNavigate first and then afterNavigate later for better UX

```js
beforeNavigate(() => {
	console.log('this is beforeNavigate');
	init();
});

afterNavigate(() => {
	console.log('this is beforeNavigate');
	init();
});
```

## Define reactive statements

these are defined already in variable defination sections just make them reactive here
ex here user.name is already defined above

```js
	// Reactive statements using $()
	$: name = user.name * 2;

    // Derived state with #()
	# quadrupled = doubled * 2;
```

## Update breadcrumbs function

```js
const updateBreadcrumbs = () => {
	// Paths
	homePath = `/users/${userId}/home`;
	servicesPath = `/users/${userId}/services`;
	servicePath = `${servicesPath}/${serviceId}`;
	modelsPath = `${servicePath}/models`;
	modelPath = `${modelsPath}/${modelId}`;
	columnsPath = `${modelPath}/columns`;

	breadCrumbs = [
		{ name: 'Home', path: homePath },
		{ name: 'Services', path: servicesPath },
		{ name: serviceName, path: servicePath },
		{ name: 'Models', path: modelsPath },
		{ name: model.name, path: modelPath },
		{ name: 'Columns', path: columnsPath },
		{ name: columnName, path: null }
	];
};
```


# Structure of HTML


# page local style

```html
<style>
	.delete-button {
		@apply absolute -right-7 top-[40%] hidden border p-1 text-white;
	}

	.hover-container:hover .delete-button {
		@apply block;
	}

	.highlight {
		border: 2px solid blue; /* You can change the border style and color */
	}

	:global(.dialog-content.dialog-content) {
		scrollbar-width: none;
		-ms-overflow-style: none;
		overflow-y: scroll;
	}

	:global(.dialog-content.dialog-content::-webkit-scrollbar) {
		width: 0;
		height: 0;
		display: none;
	}
</style>
```
