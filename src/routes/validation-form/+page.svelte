<!--
Form page.svelte 'script' section structure 
    // Importing required modules
    // Getting page server data
    // Page title setting
    // Define form variable
    // Page params based values
    // Define Form data handler
    // Define init function
    // On mount function
    // After navigate function
    // Update breadcrumbs function
    // Define reactive staments (In Svelte 5, define them through Runes)
-->

<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageServerData } from '../$types.js';
	import { ColumnFormDataHandler } from './colum.data';
	import { enhance } from '$app/forms';
	// import type { ColumnFormDataHandler } from './colum.data.js';

	export let data: PageServerData;

	// data.title = 'View';

	export let form: any;

	// Page params based values
	let userId = $page.params.userId;
	let serviceId = $page.params.serviceId;
	let modelId = $page.params.modelId;
	let columnId = $page.params.columnId;

	// Page server data
	let columnFormDataHandler = new ColumnFormDataHandler();

	// let model = data.entity;
	// let column = data.column;
	// let service = data.service;

	// let availableEnumerations: EnumerationValue[] = data.enumerations ?? [];

	// let serviceId = service.id;
	// let modelId = model.id;
	// let columnId = column.id;

	let modelName: string, columnName: string, serviceName: string;
	let enumerationNames: string[];
	let homePath: string, servicesPath: string, servicePath: string, modelsPath: string;
	let modelPath: string, columnsPath: string;
	let breadCrumbs: any[] = [];

	let name: string, description: string;
	let dataType: string, nullable: boolean, defaultValue: string, unique: boolean, input: boolean;
	let requiredInput: boolean, output: boolean, editable: boolean, index: boolean;
	let validationType: string, dataSize: number, min: number, max: number;
	let queriable: boolean,
		allowPartialStringSearch: boolean,
		sortable: boolean,
		searchOutput: boolean,
		outputAsObject: boolean;

	let example: string, keywords: string[], keywordsStr: string;
	let enumerationName: string, enumerationId: string | null | undefined;

	let name_: string, description_: string;
	let dataType_: string,
		nullable_: boolean,
		defaultValue_: string,
		unique_: boolean,
		input_: boolean;
	let requiredInput_: boolean, output_: boolean, editable_: boolean, index_: boolean;
	let validationType_: string, dataSize_: number, min_: number, max_: number;
	let queriable_: boolean,
		allowPartialStringSearch_: boolean,
		sortable_: boolean,
		searchOutput_: boolean,
		outputAsObject_: boolean;
	let example_: string, keywords_: string[], keywordsStr_: string;
	let enumerationName_: string, enumerationId_: string | null | undefined;

	// function getEnumId(name: string): string | null | undefined {
	// 	const x = availableEnumerations.find((e) => e.name === name);
	// 	return x ? x.id : null;
	// }

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
			{ name: modelId, path: modelPath },
			{ name: 'Columns', path: columnsPath },
			{ name: columnName, path: null }
		];
	};

	const init = () => {
	// 	userId = $page.params.userId;
		columnFormDataHandler.saveServerData(data);

	// 	// model = data.entity;
	// 	// column = data.column;
	// 	// service = data.service;
	// 	// availableEnumerations = data.enumerations ?? [];

	// 	modelName = model.name;
	// 	columnName = column.name;
	// 	serviceName = service.name;
	// 	enumerationNames = availableEnumerations.map((e) => e.name);
	// 	serviceId = service.id;
	// 	modelId = model.id;
	// 	columnId = column.id;

	// 	name = column.name;
	// 	description = column.description ?? '';

	// 	dataType = column.dataType ?? 'String';
	// 	nullable = column.nullable ?? true;
	// 	defaultValue = column.defaultValue ?? '';
	// 	unique = column.unique ?? false;
	// 	input = column.input ?? true;
	// 	requiredInput = column.requiredInput ?? true;
	// 	output = column.output ?? true;
	// 	editable = column.editable ?? false;
	// 	index = column.index ?? false;

	// 	validationType = column.validationType ?? 'None';
	// 	dataSize = column.dataSize ?? 64;
	// 	min = column.min ?? 0;
	// 	max = column.max ?? 64;

	// 	queriable = column.queriable ?? true;
	// 	allowPartialStringSearch = column.allowPartialStringSearch ?? true;
	// 	sortable = column.sortable ?? true;
	// 	searchOutput = column.searchOutput ?? true;
	// 	outputAsObject = column.outputAsObject ?? false;

	// 	enumerationName = column.enumerationName ?? '';
	// 	example = column.example ?? '';
	// 	keywords = column.keywords ?? [];
	// 	keywordsStr = keywords?.join(', ');

	// 	enumerationId = getEnumId(enumerationName);

	// 	//Storing the original values
	// 	name_ = name;
	// 	description_ = description;

	// 	dataType_ = dataType;
	// 	nullable_ = nullable;
	// 	defaultValue_ = defaultValue;
	// 	unique_ = unique;
	// 	input_ = input;
	// 	requiredInput_ = requiredInput;
	// 	output_ = output;
	// 	editable_ = editable;
	// 	index_ = index;

	// 	validationType_ = validationType;
	// 	dataSize_ = dataSize;
	// 	min_ = min;
	// 	max_ = max;

	// 	queriable_ = queriable;
	// 	allowPartialStringSearch_ = allowPartialStringSearch;
	// 	sortable_ = sortable;
	// 	searchOutput_ = searchOutput;
	// 	outputAsObject_ = outputAsObject;

	// 	example_ = example;
	// 	keywords_ = keywords;
	// 	keywordsStr_ = keywords ? keywords.join(', ') : '';

	// 	enumerationName_ = enumerationName;

		updateBreadcrumbs();
	};

	onMount(() => {
		init();
	});

	afterNavigate(({ from, to }) => {
		// Check if the column (slug) has changed, but path remains same
		init();
	});

	const reset = () => {
		columnFormDataHandler.reset();

		// name = name_;
		// description = description_;

		// dataType = dataType_;
		// nullable = nullable_;
		// defaultValue = defaultValue_;
		// unique = unique_;
		// input = input_;
		// requiredInput = requiredInput_;
		// output = output_;
		// editable = editable_;
		// index = index_;

		// validationType = validationType_;
		// dataSize = dataSize_;
		// min = min_;
		// max = max_;

		// queriable = queriable_;
		// allowPartialStringSearch = allowPartialStringSearch_;
		// sortable = sortable_;
		// searchOutput = searchOutput_;
		// outputAsObject = outputAsObject_;
		// enumerationName = enumerationName_;
		// enumerationId = enumerationId_;

		// example = example_;
		// keywords = keywords_;
		// keywordsStr = keywordsStr_;
	};

	const onNameChange = (e: Event) => {
		name = (e.target as HTMLInputElement).value;
		name = CaseConverter.pascalCase(name);
		if (modelName.length < 3) {
			return;
		}
	};

	// const onEnumChange = (e: Event) => {
	// 	const enumeration = availableEnumerations.find((e) => e.name === enumerationName);
	// 	if (enumeration) {
	// 		enumerationId = enumeration.id;
	// 	}
	// };

	const onDataSizeChange = (e: Event) => {
		dataSize = parseInt((e.target as HTMLInputElement).value);
		dataSize = dataSize < 1 ? 1 : dataSize;
		max = dataSize;
	};

	const onMinChange = (e: Event) => {
		min = parseInt((e.target as HTMLInputElement).value);
		min = min < 0 ? 0 : min;
		min = min > max ? max : min;
	};

	const onMaxChange = (e: Event) => {
		max = parseInt((e.target as HTMLInputElement).value);
		max = max < 1 ? 1 : max;
		max = max < min ? min : max;
		max = max > dataSize ? dataSize : max;
	};

	const onUpdateKeywords = (e: any) => {
		console.log('Keywords = ', e.detail);
		keywords = e.detail;
		keywordsStr = keywords?.join(', ');
		// console.log(JSON.stringify(e, null, 2));
	};

	const onAdvancedClick = (e: any) => {
		e.preventDefault();
		console.log('Advanced Clicked');
		showAdvanced_ = !showAdvanced_;
	};

	let showValidation = true;
	let showAdvanced_ = true;
	let availableEnumerations= true
	// $: enumerationId = getEnumId(enumerationName);
	// enumerationId_ = enumerationId;

	// let showAdvanced_ = false;

	// $: enableDatasize = dataType === 'String' || dataType === 'Long String';

	// $: showValidation =
	// 	columnFormDataHandler._currentData.dataType === 'String' ||
	// 	dataType === 'Long String' ||
	// 	dataType === 'Integer' ||
	// 	dataType === 'Float' ||
	// 	dataType === 'Double';

	// $: validationType = showValidation ? validationType : 'None';

	// $: showMinMax =
	// 	dataType === 'String' ||
	// 	dataType === 'Long String' ||
	// 	dataType === 'Integer' ||
	// 	dataType === 'Float' ||
	// 	dataType === 'Double';

	// $: inputValidationTypes =
	// 	dataType === 'String' || dataType === 'Long String' ? stringValidationTypes : ['None'];
	// $: maxLabel =
	// 	dataType === 'String' || dataType === 'Long String' ? 'Maximum length' : 'Maximum Value';
	// $: minLabel =
	// 	dataType === 'String' || dataType === 'Long String' ? 'Minimum length' : 'Minimum Value';
</script>

<div class="mx-auto flex max-w-screen-xl shrink-0 flex-col gap-4 p-6">
	<form action="?/updateColumnAction" class="flex flex-col gap-2 p-2" method="post" use:enhance>
		<div class="form-control">
			<label class="label" for="name">
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
				<p class="text-sm text-red-500">{form?.validationErrors?.name[0]}</p>
			{/if}
		</div>

		<div class="py-1"></div>

		<div class="py-1"></div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="form-control grow">
				<!-- <Select
					icon="mdi:format-list-bulleted"
					name="dataType"
					label="Column Data Type"
					tooltip="Select the data type for this column."
					bind:value={dataType}
					options={columnDataTypes}
				/> -->
			</div>

			{#if availableEnumerations}
				<div class="form-control grow">
					<div class="felx-row flex">
						<div class="w-full grow">
							<a href={`/users/${userId}/enumerations/new`} class="btn btn-sm btn-primary">
								No enumerations found! Create One
							</a>
						</div>
					</div>
				</div>
			{:else}
				<div class="form-control grow">
					<!-- <Select
							icon="mdi:format-list-bulleted"
							name="enumerationName"
							label="Enum Name (List of possible values)"
							tooltip="Select the enumeration name from existing enums."
							options={enumerationNames}
							bind:value={enumerationName}
							on:change={onEnumChange}
						/> -->
				</div>
			{/if}

			<input type="hidden" name="enumerationId" id="enumerationId" bind:value={enumerationId} />

			<div class="form-control grow">
				<input type="checkbox" name="required" bind:checked={nullable} />
			</div>

			<div class="form-control grow">
				<input type="text" name="defaultValue" bind:value={defaultValue} />
			</div>

			<div class="form-control grow">
				<input type="checkbox" name="unique" bind:checked={unique} />
			</div>
			<div class="form-control grow">
				<input type="checkbox" name="input" bind:checked={input} />
			</div>

			<div class="form-control grow">
				<input type="checkbox" name="requiredInput" bind:checked={requiredInput} />
			</div>
			<div class="form-control grow">
				<input type="checkbox" name="editable" bind:checked={editable} />
			</div>

			<div class="form-control grow">
				<input type="checkbox" name="output" bind:checked={output} />
			</div>

			<div class="form-control grow">
				<input type="checkbox" name="index" bind:checked={index} />
			</div>
		</div>

		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="btn btn-sm btn-outline my-4 mr-auto"
			on:keydown={onAdvancedClick}
			on:click={onAdvancedClick}
		>
			<div class="flex flex-row items-center gap-2">
				<span>Advanced Options</span>
				{#if showAdvanced_}
					<!-- <Icon icon="mdi:chevron-up" class="text-xl" /> -->
				{:else}
					<!-- <Icon icon="mdi:chevron-down" class="text-xl" /> -->
				{/if}
			</div>
		</div>

		{#if showValidation}
			<div class="py-1"></div>

			<div class="py-1"></div>

			<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
				<div class="form-control grow">
					<!-- <
							icon="grommet-icons:validate"
							name="validationType"
							label="Validation Type"
							options={inputValidationTypes}
							tooltip="Select the validation type for this column. If not sure, select None."
							bind:value={validationType}
						/> -->
				</div>

				<div class="form-control grow">
					<input
						type="number"
						name="dataSize"
						bind:value={dataSize}
				
						on:change={onDataSizeChange}
					/>
				</div>

				<div class="form-control grow">
					<input type="number" name="min" bind:value={min} on:change={onMinChange} />
				</div>

				<div class="form-control grow">
					<input type="number" name="max" bind:value={max} on:change={onMaxChange} />
				</div>
			</div>
		{/if}

		<!-- Output, search, filtering and sorting -->

		<div class="py-1"></div>

		<div class="py-1"></div>

		<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
			<div class="form-control grow">
				<input type="checkbox" name="searchOutput" bind:checked={searchOutput} />
			</div>
			<div class="form-control grow">
				<input type="checkbox" bind:checked={outputAsObject} />
			</div>
			<div class="form-control grow">
				<input type="checkbox" name="sortable" bind:checked={sortable} />
			</div>

			<div class="form-control grow">
				<input type="checkbox" name="queriable" bind:checked={queriable} />
			</div>

			<div class="form-control grow">
				<input
					type="checkbox"
					name="allowPartialStringSearch"
					bind:checked={allowPartialStringSearch}
				/>
			</div>
		</div>

		<div class="py-1"></div>

		<div class="form-control">
			<label class="label" for="description">
				<span class="label-text">Description</span>
			</label>
			<textarea
				class="textarea"
				placeholder="Type here"
				name="description"
				id="description"
				bind:value={description}
			></textarea>
			{#if form?.validationErrors?.description}
				<p class="text-sm text-red-500">
					{form?.validationErrors?.description[0]}
				</p>
			{/if}
		</div>

		<div class="form-control">
			<label class="label" for="example">
				<span class="label-text">Example</span>
			</label>
			<input
				type="text"
				placeholder="Type here"
				class="input"
				name="example"
				id="example"
				bind:value={example}
				required
			/>
		</div>

		<div class="form-control">
			<label class="label" for="keywords">
				<span class="label-text">Keywords</span>
				<span class="label-text-alt">Press Enter to add new.</span>
			</label>

			<input type="hidden" name="keywordsStr" id="keywordsStr" bind:value={keywordsStr} />
		</div>

		<div class="flex flex-row-reverse gap-2">
			<button type="submit" class="btn btn-sm btn-primary px-6">Submit</button>
			<button type="button" on:click={reset} class="btn btn-sm btn-outline btn-primary px-6"
				>Reset</button
			>
		</div>
	</form>
</div>
